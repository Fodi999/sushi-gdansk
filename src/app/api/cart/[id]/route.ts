import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateCartItemSchema = z.object({
  quantity: z.number().min(0),
})

// PATCH /api/cart/[id] - обновить количество товара в корзине
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { quantity } = updateCartItemSchema.parse(body)

    // Если количество 0, удаляем товар из корзины
    if (quantity === 0) {
      await prisma.cartItem.delete({
        where: {
          id,
          userId: session.user.id,
        },
      })
      return NextResponse.json({ message: 'Товар удален из корзины' })
    }

    // Обновляем количество
    const cartItem = await prisma.cartItem.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        quantity,
      },
      include: {
        product: true,
      },
    })

    return NextResponse.json(cartItem)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Некорректные данные', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Update cart item error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// DELETE /api/cart/[id] - удалить товар из корзины
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    await prisma.cartItem.delete({
      where: {
        id,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ message: 'Товар удален из корзины' })
  } catch (error) {
    console.error('Delete cart item error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
