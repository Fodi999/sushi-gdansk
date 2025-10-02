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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, ShoppingBag, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface CartItem {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    weight?: string
  }
}

interface CartData {
  items: CartItem[]
  total: number
  count: number
}

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [cartData, setCartData] = useState<CartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [error, setError] = useState('')
  const [orderId, setOrderId] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    deliveryAddress: '',
    notes: '',
    paymentMethod: 'CASH',
  })

  useEffect(() => {
    if (session) {
      fetchCart()
      fetchProfile()
    } else {
      router.push('/auth/signin')
    }
  }, [session, router])

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

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const profile = await response.json()
        setFormData(prev => ({
          ...prev,
          name: profile.name || '',
          phone: profile.phone || '',
          email: profile.email || '',
          deliveryAddress: profile.address || '',
        }))
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deliveryAddress: formData.deliveryAddress,
          phone: formData.phone,
          email: formData.email || undefined,
          notes: formData.notes,
          paymentMethod: formData.paymentMethod,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Если есть детали ошибок валидации
        if (data.details && Array.isArray(data.details)) {
          const errorMessages = data.details.map((issue: any) => 
            `${issue.path.join('.')}: ${issue.message}`
          ).join('\n')
          throw new Error(errorMessages)
        }
        throw new Error(data.error || 'Ошибка при создании заказа')
      }

      setOrderId(data.id)
      setOrderSuccess(true)
      
      // Перенаправляем на страницу успешного заказа через 3 секунды
      setTimeout(() => {
        router.push(`/orders`)
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
    } finally {
      setSubmitting(false)
    }
  }

  if (!session) {
    return null
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="container py-12 px-6">
          <div className="text-center py-16">
            <Loader2 className="h-16 w-16 text-gray-300 mx-auto mb-6 animate-spin" />
            <h1 className="text-3xl font-bold mb-4">Загрузка...</h1>
          </div>
        </main>
      </>
    )
  }

  if (!cartData || cartData.items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="container py-12 px-6">
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

  if (orderSuccess) {
    return (
      <>
        <Navbar />
        <main className="container py-12 px-6">
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Заказ оформлен!</h1>
            <p className="text-gray-600 mb-2">
              Номер вашего заказа: <strong>#{orderId.slice(-8)}</strong>
            </p>
            <p className="text-gray-600 mb-8">
              Мы свяжемся с вами в ближайшее время для подтверждения заказа.
              <br />
              Ожидаемое время доставки: 30-60 минут.
            </p>
            <div className="flex justify-center space-x-4">
              <Button asChild>
                <Link href="/orders">Мои заказы</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/menu">Продолжить покупки</Link>
              </Button>
            </div>
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
      <main className="container py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Оформление заказа</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Форма заказа */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit}>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Контактная информация</CardTitle>
                    <CardDescription>
                      Укажите данные для связи и доставки
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Имя</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={e =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        placeholder="Ваше имя"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Телефон *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={e =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          required
                          placeholder="+7 (999) 123-45-67"
                        />
                        <p className="text-xs text-gray-500">Минимум 9 цифр</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={e =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="example@mail.com"
                        />
                        <p className="text-xs text-gray-500">Необязательно</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Адрес доставки *</Label>
                      <Input
                        id="address"
                        value={formData.deliveryAddress}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            deliveryAddress: e.target.value,
                          })
                        }
                        required
                        placeholder="Улица, дом, квартира"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Комментарий к заказу</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                        placeholder="Например: не звонить в дверь, позвонить за 10 минут"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Способ оплаты</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select
                      value={formData.paymentMethod}
                      onValueChange={value =>
                        setFormData({ ...formData, paymentMethod: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CASH">Наличными курьеру</SelectItem>
                        <SelectItem value="CARD">Картой курьеру</SelectItem>
                        <SelectItem value="ONLINE">Онлайн оплата</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-red-800 mb-1">Ошибка при оформлении заказа</p>
                      <p className="text-red-700 text-sm whitespace-pre-line">{error}</p>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Оформление...
                    </>
                  ) : (
                    `Оформить заказ на ${finalTotal} ₽`
                  )}
                </Button>
              </form>
            </div>

            {/* Сводка заказа */}
            <div>
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Ваш заказ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {cartData.items.map(item => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-gray-600">
                            {item.quantity} x {item.product.price} ₽
                          </p>
                        </div>
                        <p className="font-medium">
                          {item.product.price * item.quantity} ₽
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Подытог:</span>
                      <span>{cartData.total} ₽</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Доставка:</span>
                      <span>
                        {deliveryFee === 0 ? (
                          <Badge variant="secondary" className="text-xs">
                            Бесплатно
                          </Badge>
                        ) : (
                          `${deliveryFee} ₽`
                        )}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Итого:</span>
                    <span className="text-orange-600">{finalTotal} ₽</span>
                  </div>

                  <div className="text-xs text-gray-600 space-y-1 pt-4">
                    <p>🕒 Время доставки: 30-60 минут</p>
                    <p>📞 Мы позвоним для подтверждения</p>
                    <p>💳 Оплата при получении</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
