'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { AlertCircle } from 'lucide-react'

interface Ingredient {
  id: string
  name: string
  category: string
}

interface AddStockDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ingredients: Ingredient[]
  onSubmit: (data: StockFormPayload) => Promise<void>
  getCategoryLabel: (category: string) => string
}

export interface StockFormData {
  ingredientId: string
  newIngredientName?: string
  newIngredientCategory?: string
  unit: string
  grossWeight: string
  netWeight: string
  purchasePrice: string
  totalPrice: number
  supplier: string
  expiryDate: string
  receivedDate: string
  notes: string
}

export interface StockFormPayload {
  ingredientId: string
  newIngredientName?: string
  newIngredientCategory?: string
  unit: string
  grossWeight: number
  netWeight: number
  purchasePrice: number
  totalPrice: number
  supplier: string
  expiryDate: string
  receivedDate: string
  notes: string
}

// Получить текущую дату в формате YYYY-MM-DD с учетом локального часового пояса
const getLocalDateString = () => {
  return new Date().toLocaleDateString('sv-SE') // шведская локаль дает YYYY-MM-DD
}

export function AddStockDialog({
  open,
  onOpenChange,
  ingredients,
  onSubmit,
  getCategoryLabel,
}: AddStockDialogProps) {
  const [submitting, setSubmitting] = useState(false)
  const [isNewIngredient, setIsNewIngredient] = useState(false)
  const [formData, setFormData] = useState<StockFormData>({
    ingredientId: '',
    unit: 'кг',
    grossWeight: '',
    netWeight: '',
    purchasePrice: '',
    totalPrice: 0,
    supplier: '',
    expiryDate: '',
    receivedDate: getLocalDateString(),
    notes: '',
  })
  const [wastagePercent, setWastagePercent] = useState<number>(0)

  // Автоматически пересчитываем totalPrice при изменении grossWeight или purchasePrice
  useEffect(() => {
    const gross = Number(formData.grossWeight) || 0
    const price = Number(formData.purchasePrice) || 0
    setFormData(prev => ({
      ...prev,
      totalPrice: gross * price
    }))
  }, [formData.grossWeight, formData.purchasePrice])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Валидация: проверяем выбор ингредиента
    if (!isNewIngredient && !formData.ingredientId) {
      alert('Пожалуйста, выберите ингредиент из списка')
      return
    }
    
    // Валидация: проверяем новый ингредиент
    if (isNewIngredient && (!formData.newIngredientName || !formData.newIngredientCategory)) {
      alert('Пожалуйста, заполните название и категорию нового ингредиента')
      return
    }
    
    // Валидация: проверяем обязательные числовые поля
    if (!formData.grossWeight || !formData.netWeight || !formData.purchasePrice) {
      alert('Пожалуйста, заполните все обязательные поля (брутто, нетто, цена)')
      return
    }
    
    // Валидация: нетто не может быть больше брутто
    if (Number(formData.netWeight) > Number(formData.grossWeight)) {
      alert('Нетто не может быть больше брутто')
      return
    }

    setSubmitting(true)

    try {
      // Приводим строковые значения к числам перед отправкой
      const payload = {
        ...formData,
        grossWeight: Number(formData.grossWeight),
        netWeight: Number(formData.netWeight),
        purchasePrice: Number(formData.purchasePrice),
        totalPrice: Number(formData.totalPrice),
      }
      
      await onSubmit(payload)
      // Очищаем форму после успешной отправки
      resetForm()
    } catch (error) {
      console.error('Error in AddStockDialog:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      ingredientId: '',
      newIngredientName: '',
      newIngredientCategory: '',
      unit: 'кг',
      grossWeight: '',
      netWeight: '',
      purchasePrice: '',
      totalPrice: 0,
      supplier: '',
      expiryDate: '',
      receivedDate: getLocalDateString(),
      notes: '',
    })
    setWastagePercent(0)
    setIsNewIngredient(false)
  }

  const calculateWastage = (gross: number, net: number) => {
    if (gross > 0 && net > 0) {
      setWastagePercent(((gross - net) / gross) * 100)
    } else {
      setWastagePercent(0)
    }
  }

  const handleGrossWeightChange = (value: string) => {
    setFormData({ ...formData, grossWeight: value })
    const gross = Number(value) || 0
    const net = Number(formData.netWeight) || 0
    calculateWastage(gross, net)
  }

  const handleNetWeightChange = (value: string) => {
    setFormData({ ...formData, netWeight: value })
    const net = Number(value) || 0
    const gross = Number(formData.grossWeight) || 0
    calculateWastage(gross, net)
  }

  // Определяем уровень критичности отхода
  const getWastageColor = () => {
    if (wastagePercent > 30) return 'bg-red-50 border-red-300'
    if (wastagePercent > 15) return 'bg-orange-50 border-orange-300'
    return 'bg-amber-50 border-amber-200'
  }

  const getWastageTextColor = () => {
    if (wastagePercent > 30) return 'text-red-800'
    if (wastagePercent > 15) return 'text-orange-800'
    return 'text-amber-800'
  }

  const getWastageIconColor = () => {
    if (wastagePercent > 30) return 'text-red-600'
    if (wastagePercent > 15) return 'text-orange-600'
    return 'text-amber-600'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Добавить приход товара на склад</DialogTitle>
          <DialogDescription>
            Заполните информацию о поступлении товара
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Переключатель: выбор из списка или добавление нового */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Label htmlFor="new-ingredient-toggle" className="cursor-pointer">
                  {isNewIngredient ? '✨ Добавление нового ингредиента' : '📋 Выбор из существующих'}
                </Label>
              </div>
              <Switch
                id="new-ingredient-toggle"
                checked={isNewIngredient}
                onCheckedChange={(checked: boolean) => {
                  setIsNewIngredient(checked)
                  setFormData({ ...formData, ingredientId: '', newIngredientName: '', newIngredientCategory: '' })
                }}
              />
            </div>

            {/* Выбор ингредиента или добавление нового */}
            <div className="space-y-2">
              {isNewIngredient ? (
                <div className="space-y-3 p-4 border-2 border-dashed rounded-lg bg-blue-50">
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    Новый ингредиент
                  </Badge>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newIngredientName">Название ингредиента *</Label>
                    <Input
                      id="newIngredientName"
                      value={formData.newIngredientName || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, newIngredientName: e.target.value })
                      }
                      placeholder="Например: Лосось свежий"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newIngredientCategory">Категория *</Label>
                    <Select
                      value={formData.newIngredientCategory || ''}
                      onValueChange={(value) =>
                        setFormData({ ...formData, newIngredientCategory: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FISH">🐟 Рыба</SelectItem>
                        <SelectItem value="SEAFOOD">🦐 Морепродукты</SelectItem>
                        <SelectItem value="RICE">🍚 Рис</SelectItem>
                        <SelectItem value="VEGETABLES">🥑 Овощи</SelectItem>
                        <SelectItem value="SEAWEED">🌊 Водоросли</SelectItem>
                        <SelectItem value="SAUCES">🥫 Соусы</SelectItem>
                        <SelectItem value="CHEESE">🧀 Сыры</SelectItem>
                        <SelectItem value="SEASONINGS">🌿 Приправы</SelectItem>
                        <SelectItem value="PACKAGING">📦 Упаковка</SelectItem>
                        <SelectItem value="OTHER">📋 Прочее</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Ингредиент *</Label>
                  <Select
                    value={formData.ingredientId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, ingredientId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите ингредиент" />
                    </SelectTrigger>
                    <SelectContent>
                      {ingredients.map((ingredient) => (
                        <SelectItem key={ingredient.id} value={ingredient.id}>
                          {ingredient.name} - {getCategoryLabel(ingredient.category)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Единица измерения */}
            <div className="space-y-2">
              <Label htmlFor="unit">Единица измерения *</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => setFormData({ ...formData, unit: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="шт">Штуки (шт)</SelectItem>
                  <SelectItem value="кг">Килограммы (кг)</SelectItem>
                  <SelectItem value="г">Граммы (г)</SelectItem>
                  <SelectItem value="л">Литры (л)</SelectItem>
                  <SelectItem value="мл">Миллилитры (мл)</SelectItem>
                  <SelectItem value="упак">Упаковки (упак)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Вес брутто и нетто */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grossWeight">Брутто ({formData.unit}) *</Label>
                <Input
                  id="grossWeight"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.grossWeight}
                  onChange={(e) => handleGrossWeightChange(e.target.value)}
                  placeholder="Сколько пришло"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="netWeight">Нетто ({formData.unit}) *</Label>
                <Input
                  id="netWeight"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.netWeight}
                  onChange={(e) => handleNetWeightChange(e.target.value)}
                  placeholder="После обработки"
                />
              </div>
            </div>

            {/* Отход (вычисляется автоматически) */}
            <div className={`p-3 border rounded-md ${wastagePercent > 0 ? getWastageColor() : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-2">
                {wastagePercent > 30 && (
                  <AlertCircle className={`h-4 w-4 ${getWastageIconColor()}`} />
                )}
                <span className={`text-sm font-medium ${wastagePercent > 0 ? getWastageTextColor() : 'text-gray-600'}`}>
                  Отход: {wastagePercent.toFixed(1)}%
                </span>
                {wastagePercent > 0 && (
                  <span className={`text-xs ${getWastageIconColor()}`}>
                    ({(Number(formData.grossWeight) - Number(formData.netWeight)).toFixed(2)} {formData.unit})
                  </span>
                )}
              </div>
              {wastagePercent > 30 && (
                <p className="text-xs text-red-700 mt-1">
                  ⚠️ Высокий процент отхода! Проверьте качество поставки.
                </p>
              )}
              {wastagePercent > 15 && wastagePercent <= 30 && (
                <p className="text-xs text-orange-700 mt-1">
                  ⚡ Повышенный отход. Рекомендуется обратить внимание.
                </p>
              )}
            </div>

            {/* Закупочная цена */}
            <div className="space-y-2">
              <Label htmlFor="purchasePrice">Цена за {formData.unit} (₽) *</Label>
              <Input
                id="purchasePrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.purchasePrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    purchasePrice: e.target.value,
                  })
                }
                placeholder="Цена за единицу"
              />
            </div>

            {/* Общая сумма (отображается автоматически) */}
            {formData.totalPrice > 0 && (
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Общая сумма к оплате</p>
                    <p className="text-3xl font-bold text-green-700">
                      {new Intl.NumberFormat('ru-RU', { 
                        style: 'currency', 
                        currency: 'RUB' 
                      }).format(formData.totalPrice)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Расчёт:</p>
                    <p className="text-sm text-gray-700 font-medium">
                      {Number(formData.grossWeight || 0).toFixed(2)} {formData.unit} × {Number(formData.purchasePrice || 0).toFixed(2)} ₽
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Поставщик */}
            <div className="space-y-2">
              <Label htmlFor="supplier">Поставщик</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) =>
                  setFormData({ ...formData, supplier: e.target.value })
                }
                placeholder="Название поставщика"
              />
            </div>

            {/* Дата поступления и срок годности */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="receivedDate">Дата поступления *</Label>
                <Input
                  id="receivedDate"
                  type="date"
                  value={formData.receivedDate}
                  onChange={(e) =>
                    setFormData({ ...formData, receivedDate: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Срок годности</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    setFormData({ ...formData, expiryDate: e.target.value })
                  }
                  min={formData.receivedDate}
                />
              </div>
            </div>

            {/* Комментарий */}
            <div className="space-y-2">
              <Label htmlFor="notes">Комментарий</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Особенности хранения, условия доставки, номер партии и т.д."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false)
                resetForm()
              }}
              disabled={submitting}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Добавление...' : 'Добавить на склад'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
