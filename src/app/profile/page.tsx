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
import { Separator } from '@/components/ui/separator'
import { Chat } from '@/components/chat'
import { User, Mail, Phone, MapPin, Edit, Save, X, Shield } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  createdAt: string
  role?: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session) {
      fetchProfile()
    }
  }, [session, status, router])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          address: data.address || '',
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedProfile = await response.json()
        setProfile(updatedProfile)
        setEditing(false)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: profile?.name || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
    })
    setEditing(false)
  }

  if (status === 'loading' || loading) {
    return (
      <>
        <Navbar />
        <div className="container py-12 px-6">
          <div className="max-w-2xl mx-auto">
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
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Личный кабинет</h1>
                <p className="text-gray-600">
                  Управляйте своими данными и настройками
                </p>
              </div>
              {profile?.role === 'ADMIN' && (
                <Button asChild variant="default" className="bg-orange-600 hover:bg-orange-700">
                  <Link href="/admin">
                    <Shield className="h-4 w-4 mr-2" />
                    Админ панель
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Левая колонка - профиль и статистика */}
            <div className="space-y-6">
              {/* Основная информация */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Личные данные
                    </span>
                    {!editing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditing(true)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Редактировать
                      </Button>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Ваша основная информация для заказов
                    {profile?.role === 'ADMIN' && (
                      <Badge className="ml-2 bg-orange-100 text-orange-800 hover:bg-orange-200">
                        <Shield className="h-3 w-3 mr-1" />
                        Администратор
                      </Badge>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {editing ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="name">Имя</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={e =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Телефон</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={e =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="+7 (999) 123-45-67"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Адрес доставки</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={e =>
                            setFormData({ ...formData, address: e.target.value })
                          }
                          placeholder="Улица, дом, квартира"
                        />
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          onClick={handleSave}
                          disabled={saving}
                          className="flex-1"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {saving ? 'Сохранение...' : 'Сохранить'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                          disabled={saving}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center space-x-3">
                        <User className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">{profile?.name}</p>
                          <p className="text-sm text-gray-600">Имя</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">{profile?.email}</p>
                          <p className="text-sm text-gray-600">Email</p>
                        </div>
                      </div>

                      {profile?.phone && (
                        <div className="flex items-center space-x-3">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium">{profile.phone}</p>
                            <p className="text-sm text-gray-600">Телефон</p>
                          </div>
                        </div>
                      )}

                      {profile?.address && (
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium">{profile.address}</p>
                            <p className="text-sm text-gray-600">Адрес доставки</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Статистика */}
              <Card>
                <CardHeader>
                  <CardTitle>Статистика заказов</CardTitle>
                  <CardDescription>
                    Информация о ваших заказах в Суши Город
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">0</p>
                      <p className="text-sm text-gray-600">Заказов сделано</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">0 ₽</p>
                      <p className="text-sm text-gray-600">Потрачено всего</p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-3">
                      Регистрация:{' '}
                      {profile?.createdAt
                        ? new Date(profile.createdAt).toLocaleDateString('ru-RU')
                        : 'Неизвестно'}
                    </p>
                    <Button variant="outline" asChild>
                      <a href="/orders">Посмотреть историю заказов</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Правая колонка - чат */}
            <div>
              <Chat />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
