import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createOrderSchema = z.object({
  deliveryAddress: z
    .string()
    .min(5, 'Адрес должен содержать минимум 5 символов'),
  phone: z
    .string()
    .min(9, 'Номер телефона должен содержать минимум 9 цифр')
    .regex(/^[\d\s\+\-\(\)]+$/, 'Номер телефона содержит недопустимые символы'),
  email: z.string().email('Введите корректный email').optional().or(z.literal('')),
  notes: z.string().optional(),
  paymentMethod: z.enum(['CASH', 'CARD', 'ONLINE']).default('CASH'),
})

// POST /api/orders - создать заказ
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { deliveryAddress, phone, email, notes, paymentMethod } =
      createOrderSchema.parse(body)

    // Получаем товары из корзины
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: true,
      },
    })

    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'Корзина пуста' }, { status: 400 })
    }

    // Проверяем доступность всех товаров
    const unavailableProducts = cartItems.filter(
      item => !item.product.available
    )
    if (unavailableProducts.length > 0) {
      return NextResponse.json(
        {
          error: 'Некоторые товары больше недоступны',
          unavailableProducts: unavailableProducts.map(
            item => item.product.name
          ),
        },
        { status: 400 }
      )
    }

    // Рассчитываем стоимость
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )

    // Стоимость доставки (бесплатно от 800 рублей)
    const deliveryFee = subtotal >= 800 ? 0 : 150
    const total = subtotal + deliveryFee

    // Создаем заказ в транзакции
    const order = await prisma.$transaction(async tx => {
      // Создаем заказ
      const newOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          deliveryAddress,
          phone,
          email,
          notes,
          paymentMethod,
          subtotal,
          deliveryFee,
          total,
          estimatedDelivery: new Date(Date.now() + 60 * 60 * 1000), // +1 час
        },
      })

      // Создаем элементы заказа
      await tx.orderItem.createMany({
        data: cartItems.map(item => ({
          orderId: newOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
      })

      // Очищаем корзину
      await tx.cartItem.deleteMany({
        where: {
          userId: session.user.id,
        },
      })

      return newOrder
    })

    // Получаем полный заказ с элементами
    const fullOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(fullOrder, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Некорректные данные', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Create order error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// GET /api/orders - получить заказы пользователя
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
