import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET /api/admin/stock - получить все ингредиенты на складе
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    // Проверяем права администратора
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Недостаточно прав' },
        { status: 403 }
      )
    }

    // Получаем все ингредиенты с партиями поступления
    const ingredients = await prisma.ingredient.findMany({
      include: {
        stockItems: {
          orderBy: {
            receivedDate: 'desc',
          },
        },
        _count: {
          select: {
            recipeItems: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return NextResponse.json(ingredients)
  } catch (error) {
    console.error('Get stock error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

const createStockItemSchema = z.object({
  ingredientId: z.string().optional(),
  newIngredientName: z.string().optional(),
  newIngredientCategory: z.string().optional(),
  unit: z.string().default('кг'),
  grossWeight: z.number().min(0), // сколько пришло (обязательно)
  netWeight: z.number().min(0), // сколько осталось после обработки (обязательно)
  purchasePrice: z.number().min(0),
  totalPrice: z.number().min(0).optional(), // общая сумма
  supplier: z.string().optional(),
  expiryDate: z.string().optional(),
  receivedDate: z.string().optional(),
  notes: z.string().optional(), // комментарий
})

// POST /api/admin/stock - добавить приход ингредиента на склад
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    // Проверяем права администратора
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Недостаточно прав' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const data = createStockItemSchema.parse(body)

    let ingredientId = data.ingredientId

    // Если это новый ингредиент - создаем его
    if (data.newIngredientName && data.newIngredientCategory) {
      const newIngredient = await prisma.ingredient.create({
        data: {
          name: data.newIngredientName,
          category: data.newIngredientCategory as any,
          unit: data.unit,
          minStock: 0,
          purchasePrice: data.purchasePrice,
          currentStock: 0,
        },
      })
      ingredientId = newIngredient.id
    }

    // Проверяем существование ингредиента
    if (!ingredientId) {
      return NextResponse.json(
        { error: 'Необходимо указать ингредиент' },
        { status: 400 }
      )
    }

    const ingredient = await prisma.ingredient.findUnique({
      where: { id: ingredientId },
    })

    if (!ingredient) {
      return NextResponse.json(
        { error: 'Ингредиент не найден' },
        { status: 404 }
      )
    }

    // Вычисляем процент отхода, если заданы брутто и нетто
    let wastagePercent: number | undefined
    if (data.grossWeight && data.netWeight && data.grossWeight > 0) {
      wastagePercent = ((data.grossWeight - data.netWeight) / data.grossWeight) * 100
    }

    // Количество на складе = нетто (после обработки)
    const actualQuantity = data.netWeight

    // Создаем партию поступления ингредиента
    const stockItem = await prisma.stockItem.create({
      data: {
        ingredientId: ingredientId,
        quantity: actualQuantity,
        unit: data.unit,
        grossWeight: data.grossWeight,
        netWeight: data.netWeight,
        wastagePercent: wastagePercent || null,
        purchasePrice: data.purchasePrice,
        totalPrice: data.totalPrice || null,
        supplier: data.supplier || null,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        receivedDate: data.receivedDate ? new Date(data.receivedDate) : new Date(),
        notes: data.notes || null,
      },
      include: {
        ingredient: true,
      },
    })

    // Обновляем текущий остаток ингредиента на складе (используем нетто)
    const newStock = ingredient.currentStock + actualQuantity
    const newAvgPrice =
      newStock > 0
        ? (ingredient.currentStock * ingredient.purchasePrice +
            actualQuantity * data.purchasePrice) /
          newStock
        : data.purchasePrice

    await prisma.ingredient.update({
      where: { id: ingredientId },
      data: {
        currentStock: newStock,
        purchasePrice: newAvgPrice,
      },
    })

    // Создаем запись о движении ингредиента
    await prisma.stockMovement.create({
      data: {
        type: 'ARRIVAL',
        ingredientName: ingredient.name,
        quantity: actualQuantity, // записываем нетто
        unit: data.unit,
        price: data.purchasePrice,
        supplier: data.supplier,
        notes: data.notes 
          ? `${data.notes}${wastagePercent ? ` (отход: ${wastagePercent.toFixed(1)}%)` : ''}`
          : wastagePercent 
            ? `Отход: ${wastagePercent.toFixed(1)}%`
            : undefined,
        createdBy: session.user.email || undefined,
      },
    })

    return NextResponse.json(stockItem, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Некорректные данные', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Create stock item error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
