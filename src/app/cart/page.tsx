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
import { Minus, Plus, Trash2, ShoppingBag, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface CartItem {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    image?: string
    weight?: string
    category: {
      name: string
    }
  }
}

interface CartData {
  items: CartItem[]
  total: number
  count: number
}

export default function CartPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [cartData, setCartData] = useState<CartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (session) {
      fetchCart()
    } else {
      setLoading(false)
    }
  }, [session])

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart')
      if (response.ok) {
        const data = await response.json()
        setCartData(data)
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) return

    setUpdatingItems(prev => new Set(prev).add(itemId))

    try {
      if (newQuantity === 0) {
        await fetch(`/api/cart/${itemId}`, {
          method: 'DELETE',
        })
      } else {
        await fetch(`/api/cart/${itemId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quantity: newQuantity }),
        })
      }
      fetchCart()
    } catch (error) {
      console.error('Error updating cart:', error)
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  const removeItem = async (itemId: string) => {
    await updateQuantity(itemId, 0)
  }

  if (!session) {
    return (
      <>
        <Navbar />
        <main className="container py-12 px-6">
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-3">Войдите в аккаунт</h1>
            <p className="text-gray-600 mb-8">
              Для просмотра корзины необходимо войти в аккаунт
            </p>
            <Button asChild>
              <Link href="/auth/signin">Войти</Link>
            </Button>
          </div>
        </main>
      </>
    )
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="container py-8">
          <div className="text-center py-16">
            <Loader2 className="h-16 w-16 text-gray-300 mx-auto mb-6 animate-spin" />
            <h1 className="text-3xl font-bold mb-4">Загрузка корзины...</h1>
          </div>
        </main>
      </>
    )
  }

  if (!cartData || cartData.items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="container py-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Корзина пуста</h1>
            <p className="text-gray-600 mb-8">
              Добавьте товары из нашего меню, чтобы оформить заказ
            </p>
            <Button asChild>
              <Link href="/menu">Перейти к меню</Link>
            </Button>
          </div>
        </main>
      </>
    )
  }

  const deliveryFee = cartData.total >= 800 ? 0 : 150
  const finalTotal = cartData.total + deliveryFee

  return (
    <>
      <Navbar />
      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">
            Корзина ({cartData.count}{' '}
            {cartData.count === 1
              ? 'товар'
              : cartData.count < 5
                ? 'товара'
                : 'товаров'}
            )
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Товары в корзине */}
            <div className="lg:col-span-2 space-y-4">
              {cartData.items.map(item => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 relative overflow-hidden">
                        {item.product.image && (
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            onError={e => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                            }}
                          />
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {item.product.name}
                        </h3>
                        <p className="text-gray-600">
                          {item.product.category.name}
                        </p>
                        {item.product.weight && (
                          <p className="text-sm text-gray-500">
                            {item.product.weight}
                          </p>
                        )}
                        <p className="text-lg font-bold text-orange-600 mt-2">
                          {item.product.price} ₽
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={updatingItems.has(item.id)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={updatingItems.has(item.id)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-lg">
                          {item.product.price * item.quantity} ₽
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 mt-2"
                          disabled={updatingItems.has(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Итоги заказа */}
            <div>
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Итого</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Подытог:</span>
                    <span>{cartData.total} ₽</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Доставка:</span>
                    <span>
                      {deliveryFee === 0 ? (
                        <Badge variant="secondary">Бесплатно</Badge>
                      ) : (
                        `${deliveryFee} ₽`
                      )}
                    </span>
                  </div>

                  {deliveryFee > 0 && (
                    <div className="text-sm text-gray-600 bg-orange-50 p-3 rounded-lg">
                      💡 Добавьте товаров на{' '}
                      <strong>{800 - cartData.total} ₽</strong> для бесплатной
                      доставки
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>К оплате:</span>
                    <span className="text-orange-600">{finalTotal} ₽</span>
                  </div>

                  <Button className="w-full" size="lg" asChild>
                    <Link href="/checkout">Оформить заказ</Link>
                  </Button>

                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/menu">Добавить еще</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Информация о доставке */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Условия доставки</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-600">
                  <p>🕒 Время доставки: 30-60 минут</p>
                  <p>🚚 Бесплатная доставка от 800 ₽</p>
                  <p>💳 Оплата наличными или картой</p>
                  <p>⏰ Работаем с 10:00 до 23:00</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
