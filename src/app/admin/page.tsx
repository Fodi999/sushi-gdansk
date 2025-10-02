'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Package, Plus } from 'lucide-react'

// Компоненты
import { AdminHeader } from '@/components/admin/admin-header'
import { StatsCards } from '@/components/admin/stats-cards'
import { AddStockDialog, type StockFormPayload } from '@/components/admin/add-stock-dialog'
import { StockItemsList } from '@/components/admin/stock-items-list'
import { StockMovementsList } from '@/components/admin/stock-movements-list'

// Типы и утилиты
import type { AdminStats, StockItem, StockMovement, Ingredient } from '@/types/admin'
import { getCategoryLabel } from '@/lib/admin-utils'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // States
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [stockItems, setStockItems] = useState<StockItem[]>([])
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddStockDialog, setShowAddStockDialog] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
      return
    }

    if (session) {
      checkAdminAccess()
      fetchStats()
      fetchStockItems()
      fetchStockMovements()
    }
  }, [session, status, router])

  const checkAdminAccess = async () => {
    try {
      const response = await fetch('/api/auth/check-admin')
      const data = await response.json()

      if (!data.isAdmin) {
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Error checking admin access:', error)
      router.push('/admin/login')
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStockItems = async () => {
    try {
      const response = await fetch('/api/admin/stock')
      if (response.ok) {
        const data = await response.json()
        setIngredients(data)
        // Добавляем информацию об ингредиенте к каждому stockItem
        const allStockItems = data.flatMap((ing: Ingredient) => 
          (ing.stockItems || []).map((item: StockItem) => ({
            ...item,
            ingredient: {
              id: ing.id,
              name: ing.name,
              category: ing.category,
              unit: ing.unit
            }
          }))
        )
        setStockItems(allStockItems)
      }
    } catch (error) {
      console.error('Error fetching stock items:', error)
    }
  }

  const fetchStockMovements = async () => {
    try {
      const response = await fetch('/api/admin/stock/movements')
      if (response.ok) {
        const data = await response.json()
        setStockMovements(data)
      }
    } catch (error) {
      console.error('Error fetching stock movements:', error)
    }
  }

  const handleAddStockItem = async (formData: StockFormPayload) => {
    try {
      const response = await fetch('/api/admin/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          expiryDate: formData.expiryDate || null,
        }),
      })

      if (response.ok) {
        await fetchStockItems()
        await fetchStockMovements()
        setShowAddStockDialog(false)
      } else {
        const data = await response.json()
        alert(data.error || 'Ошибка при добавлении товара')
      }
    } catch (error) {
      console.error('Error adding stock item:', error)
      alert('Ошибка при добавлении товара')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p>Загрузка админ панели...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader
        userName={session?.user?.name}
        userEmail={session?.user?.email}
      />

      <main className="container py-8 px-6">
        <StatsCards stats={stats} />

        <Tabs defaultValue="stock" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="orders">Заказы</TabsTrigger>
            <TabsTrigger value="products">Товары</TabsTrigger>
            <TabsTrigger value="stock">Склад</TabsTrigger>
            <TabsTrigger value="users">Пользователи</TabsTrigger>
            <TabsTrigger value="analytics">Аналитика</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>

          {/* Вкладка Склад */}
          <TabsContent value="stock">
            <div className="grid gap-6">
              {/* Складской учет */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Склад продуктов</CardTitle>
                      <CardDescription>
                        Управление запасами, приход и списание товаров
                      </CardDescription>
                    </div>
                    <Button onClick={() => setShowAddStockDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить приход
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {stockItems.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Склад пуст</h3>
                      <p className="text-gray-600">Добавьте первый товар на склад</p>
                    </div>
                  ) : (
                    <StockItemsList
                      items={stockItems}
                      getCategoryLabel={getCategoryLabel}
                    />
                  )}
                </CardContent>
              </Card>

              {/* История движений */}
              <Card>
                <CardHeader>
                  <CardTitle>История движений</CardTitle>
                  <CardDescription>
                    Последние операции со складом
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <StockMovementsList movements={stockMovements} limit={10} />
                </CardContent>
              </Card>
            </div>

            {/* Диалог добавления на склад */}
            <AddStockDialog
              open={showAddStockDialog}
              onOpenChange={setShowAddStockDialog}
              ingredients={ingredients}
              onSubmit={handleAddStockItem}
              getCategoryLabel={getCategoryLabel}
            />
          </TabsContent>

          {/* Другие вкладки - заглушки */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Управление заказами</CardTitle>
                <CardDescription>
                  Просмотр и управление заказами клиентов
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Здесь будет список заказов</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Управление товарами</CardTitle>
                <CardDescription>
                  Каталог продуктов и управление наличием
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Здесь будет список товаров</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Управление пользователями</CardTitle>
                <CardDescription>
                  Просмотр пользователей и их активность
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Здесь будет список пользователей</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Аналитика</CardTitle>
                <CardDescription>
                  Статистика и отчеты
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Здесь будет аналитика</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Настройки системы</CardTitle>
                <CardDescription>
                  Общие настройки и конфигурация
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Здесь будут настройки</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
