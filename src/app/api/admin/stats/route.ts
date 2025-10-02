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

    // Получаем статистику
    const [
      totalUsers,
      totalOrders,
      totalProducts,
      pendingOrders,
      revenueData,
    ] = await Promise.all([
      // Общее количество пользователей
      prisma.user.count({
        where: { role: 'USER' }
      }),
      
      // Общее количество заказов
      prisma.order.count(),
      
      // Общее количество товаров
      prisma.product.count({
        where: { available: true }
      }),
      
      // Заказы в ожидании
      prisma.order.count({
        where: { status: 'PENDING' }
      }),
      
      // Общий доход
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { in: ['DELIVERED', 'CONFIRMED'] } }
      }),
    ])

    // Активные пользователи (заказывали за последние 30 дней)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const activeUsers = await prisma.user.count({
      where: {
        role: 'USER',
        orders: {
          some: {
            createdAt: {
              gte: thirtyDaysAgo
            }
          }
        }
      }
    })

    // Новые пользователи за этот месяц
    const firstDayOfMonth = new Date()
    firstDayOfMonth.setDate(1)
    firstDayOfMonth.setHours(0, 0, 0, 0)

    const newUsersThisMonth = await prisma.user.count({
      where: {
        role: 'USER',
        createdAt: {
          gte: firstDayOfMonth
        }
      }
    })

    // Количество администраторов
    const adminCount = await prisma.user.count({
      where: { role: 'ADMIN' }
    })

    const stats = {
      totalUsers,
      totalOrders,
      totalProducts,
      pendingOrders,
      activeUsers,
      newUsersThisMonth,
      adminCount,
      totalRevenue: revenueData._sum.total || 0,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
