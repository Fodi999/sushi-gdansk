import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'

interface StockItem {
  id: string
  ingredientId: string
  quantity: number
  unit: string
  grossWeight?: number
  netWeight?: number
  purchasePrice?: number
  supplier?: string
  expiryDate?: string
  receivedDate: string
  ingredient: {
    id: string
    name: string
    category: string
    unit: string
  }
}

interface StockItemsListProps {
  items: StockItem[]
  getCategoryLabel: (category: string) => string
}

export function StockItemsList({ items, getCategoryLabel }: StockItemsListProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h4 className="font-semibold text-lg">{item.ingredient.name}</h4>
                <Badge variant="outline">
                  {getCategoryLabel(item.ingredient.category)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Количество:</p>
                  <p className="font-semibold">
                    {item.quantity} {item.unit}
                  </p>
                </div>

                {item.grossWeight && (
                  <div>
                    <p className="text-gray-500">Вес брутто:</p>
                    <p className="font-semibold">{item.grossWeight} кг</p>
                  </div>
                )}

                {item.netWeight && (
                  <div>
                    <p className="text-gray-500">Вес нетто:</p>
                    <p className="font-semibold">{item.netWeight} кг</p>
                  </div>
                )}

                {item.purchasePrice && (
                  <div>
                    <p className="text-gray-500">Закупочная цена:</p>
                    <p className="font-semibold">{item.purchasePrice} ₽</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mt-3">
                {item.supplier && (
                  <div>
                    <p className="text-gray-500">Поставщик:</p>
                    <p className="font-medium">{item.supplier}</p>
                  </div>
                )}

                <div>
                  <p className="text-gray-500">Дата прихода:</p>
                  <p className="font-medium">
                    {new Date(item.receivedDate).toLocaleDateString('ru-RU')}
                  </p>
                </div>

                {item.expiryDate && (
                  <div>
                    <p className="text-gray-500">Срок годности:</p>
                    <p className="font-medium text-orange-600">
                      до {new Date(item.expiryDate).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col space-y-2 ml-4">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-red-600">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
