import { Badge } from '@/components/ui/badge'

interface StockMovement {
  id: string
  type: string
  productName: string
  quantity: number
  unit: string
  price?: number
  supplier?: string
  notes?: string
  createdBy?: string
  createdAt: string
}

interface StockMovementsListProps {
  movements: StockMovement[]
  limit?: number
}

export function StockMovementsList({ movements, limit = 10 }: StockMovementsListProps) {
  if (movements.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Нет записей о движении товаров</p>
      </div>
    )
  }

  const displayMovements = limit ? movements.slice(0, limit) : movements

  return (
    <div className="space-y-2">
      {displayMovements.map((movement) => (
        <div
          key={movement.id}
          className="flex items-center justify-between border-b pb-2"
        >
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <Badge
                className={
                  movement.type === 'ARRIVAL'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }
              >
                {movement.type === 'ARRIVAL' ? 'Приход' : 'Списание'}
              </Badge>
              <span className="font-medium">{movement.productName}</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              <span>
                {movement.quantity} {movement.unit}
              </span>
              {movement.price && <span> • {movement.price} ₽</span>}
              {movement.supplier && <span> • {movement.supplier}</span>}
              {movement.createdBy && <span> • {movement.createdBy}</span>}
              {movement.notes && (
                <span className="block text-xs text-gray-500 mt-1">
                  {movement.notes}
                </span>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {new Date(movement.createdAt).toLocaleDateString('ru-RU')}
          </div>
        </div>
      ))}
    </div>
  )
}
