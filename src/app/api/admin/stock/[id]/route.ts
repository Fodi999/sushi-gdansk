import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateStockItemSchema = z.object({
  quantity: z.number().min(0).optional(),
  unit: z.string().optional(),
  grossWeight: z.number().optional(),
  netWeight: z.number().optional(),
  wastagePercent: z.number().optional(),
  purchasePrice: z.number().optional(),
  totalPrice: z.number().optional(),
  supplier: z.string().optional(),
  expiryDate: z.string().optional().nullable(),
  receivedDate: z.string().optional(),
  notes: z.string().optional(),
})

// PATCH /api/admin/stock/[id] - обновить складскую позицию
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
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
    const data = updateStockItemSchema.parse(body)

    // Получаем текущую складскую позицию
    const currentStock = await prisma.stockItem.findUnique({
      where: { id },
      include: { ingredient: true },
    })

    if (!currentStock) {
      return NextResponse.json(
        { error: 'Складская позиция не найдена' },
        { status: 404 }
      )
    }

    // Вычисляем процент отхода, если обновлены брутто и нетто
    let wastagePercent = data.wastagePercent
    if (data.grossWeight && data.netWeight && data.grossWeight > 0) {
      wastagePercent = ((data.grossWeight - data.netWeight) / data.grossWeight) * 100
    }

    // Обновляем складскую позицию
    const updatedStock = await prisma.stockItem.update({
      where: { id },
      data: {
        quantity: data.quantity,
        unit: data.unit,
        grossWeight: data.grossWeight,
        netWeight: data.netWeight,
        wastagePercent: wastagePercent || null,
        purchasePrice: data.purchasePrice,
        totalPrice: data.totalPrice || null,
        supplier: data.supplier || null,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        receivedDate: data.receivedDate ? new Date(data.receivedDate) : undefined,
        notes: data.notes || null,
      },
      include: {
        ingredient: true,
      },
    })

    // Если количество изменилось, создаем запись о движении
    if (data.quantity !== undefined && data.quantity !== currentStock.quantity) {
      const diff = data.quantity - currentStock.quantity
      await prisma.stockMovement.create({
        data: {
          type: diff > 0 ? 'ARRIVAL' : 'WRITE_OFF',
          ingredientName: currentStock.ingredient.name,
          quantity: Math.abs(diff),
          unit: data.unit || currentStock.unit,
          price: data.purchasePrice,
          notes: diff > 0 ? 'Приход ингредиента' : 'Списание ингредиента',
          createdBy: session.user.email || undefined,
        },
      })
    }

    return NextResponse.json(updatedStock)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Некорректные данные', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Update stock item error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/stock/[id] - удалить складскую позицию
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
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

    // Получаем складскую позицию
    const stockItem = await prisma.stockItem.findUnique({
      where: { id },
      include: { ingredient: true },
    })

    if (!stockItem) {
      return NextResponse.json(
        { error: 'Складская позиция не найдена' },
        { status: 404 }
      )
    }

    // Удаляем складскую позицию
    await prisma.stockItem.delete({
      where: { id },
    })

    // Создаем запись о списании
    await prisma.stockMovement.create({
      data: {
        type: 'WRITE_OFF',
        ingredientName: stockItem.ingredient.name,
        quantity: stockItem.quantity,
        unit: stockItem.unit,
        notes: 'Удаление из складского учета',
        createdBy: session.user.email || undefined,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete stock item error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
