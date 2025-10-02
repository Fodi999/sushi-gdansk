'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Package, Clock, CheckCircle, XCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: {
    name: string
    image?: string
  }
}

interface Order {
  id: string
  status: string
  total: number
  subtotal?: number
  deliveryFee?: number
  createdAt: string
  deliveryAddress: string
  phone: string
  email?: string
  notes?: string
  orderItems: OrderItem[]
}

const statusLabels: Record<string, string> = {
  PENDING: 'Ожидает подтверждения',
  CONFIRMED: 'Подтвержден',
  PREPARING: 'Готовится',
  READY: 'Готов к доставке',
  DELIVERING: 'В доставке',
  DELIVERED: 'Доставлен',
  CANCELLED: 'Отменен',
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-orange-100 text-orange-800',
  READY: 'bg-purple-100 text-purple-800',
  DELIVERING: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

const statusIcons: Record<string, any> = {
  PENDING: Clock,
  CONFIRMED: CheckCircle,
  PREPARING: Package,
  READY: Package,
  DELIVERING: Package,
  DELIVERED: CheckCircle,
  CANCELLED: XCircle,
}

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session) {
      fetchOrders()
    }
  }, [session, status, router])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <>
        <Navbar />
        <div className="container py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">Загрузка...</div>
          </div>
        </div>
      </>
    )
  }

  if (!session) {
    return null
  }

  return (
    <>
      <Navbar />
      <main className="container py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Button variant="ghost" asChild className="mr-4">
              <Link href="/profile">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад в профиль
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold mb-2">История заказов</h1>
              <p className="text-gray-600">
                Все ваши заказы в Суши Город
              </p>
            </div>
          </div>

          {orders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  У вас пока нет заказов
                </h3>
                <p className="text-gray-600 mb-6">
                  Оформите свой первый заказ из нашего меню
                </p>
                <Button asChild>
                  <Link href="/menu">Перейти к меню</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map(order => {
                const StatusIcon = statusIcons[order.status as keyof typeof statusIcons]
                
                return (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center">
                            Заказ #{order.id.slice(-8)}
                            <Badge
                              className={`ml-3 ${
                                statusColors[order.status as keyof typeof statusColors]
                              }`}
                            >
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusLabels[order.status as keyof typeof statusLabels]}
                            </Badge>
                          </CardTitle>
                          <CardDescription>
                            {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-orange-600">
                            {order.total} ₽
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Состав заказа */}
                      <div className="space-y-3 mb-4">
                        {order.orderItems.map((item: OrderItem) => (
                          <div key={item.id} className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{item.product.name}</p>
                              <p className="text-sm text-gray-600">
                                {item.quantity} шт. × {item.price} ₽
                              </p>
                            </div>
                            <p className="font-semibold">
                              {item.quantity * item.price} ₽
                            </p>
                          </div>
                        ))}
                      </div>

                      <Separator className="my-4" />

                      {/* Информация о доставке */}
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-700 mb-1">
                            Контакт:
                          </p>
                          <p>{order.phone}</p>
                          {order.email && <p>{order.email}</p>}
                        </div>
                        <div>
                          <p className="font-medium text-gray-700 mb-1">
                            Адрес доставки:
                          </p>
                          <p>{order.deliveryAddress}</p>
                        </div>
                      </div>

                      {order.notes && (
                        <div className="mt-4">
                          <p className="font-medium text-gray-700 mb-1">
                            Комментарий к заказу:
                          </p>
                          <p className="text-sm text-gray-600">{order.notes}</p>
                        </div>
                      )}

                      {/* Действия */}
                      <div className="flex justify-end mt-4 space-x-2">
                        {order.status === 'completed' && (
                          <Button variant="outline" size="sm">
                            Заказать еще раз
                          </Button>
                        )}
                        {(order.status === 'pending' || order.status === 'confirmed') && (
                          <Button variant="outline" size="sm">
                            Отменить заказ
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
