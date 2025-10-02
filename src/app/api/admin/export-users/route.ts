import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    // Получаем всех пользователей с их заказами
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
          },
        },
        orders: {
          select: {
            total: true,
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Формируем CSV
    const csvHeader = 'ID,Имя,Email,Роль,Дата регистрации,Количество заказов,Общая сумма заказов,Последний заказ\n'
    const csvRows = users.map((user) => {
      const totalSpent = user.orders.reduce((sum, order) => {
        if (order.status === 'DELIVERED' || order.status === 'CONFIRMED') {
          return sum + order.total
        }
        return sum
      }, 0)

      const lastOrder = user.orders.length > 0
        ? new Date(user.orders[0].createdAt).toLocaleDateString('ru-RU')
        : 'Нет заказов'

      return `${user.id},"${user.name}",${user.email},${user.role},${new Date(user.createdAt).toLocaleDateString('ru-RU')},${user._count.orders},${totalSpent},"${lastOrder}"`
    }).join('\n')

    const csv = csvHeader + csvRows

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="users-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Export users error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
