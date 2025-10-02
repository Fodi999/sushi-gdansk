// Утилиты для админ панели

// Функция для перевода категорий ингредиентов
export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    FISH: 'Рыба',
    SEAFOOD: 'Морепродукты',
    RICE: 'Рис',
    VEGETABLES: 'Овощи',
    SEAWEED: 'Водоросли',
    SAUCES: 'Соусы',
    CHEESE: 'Сыры',
    SEASONINGS: 'Приправы',
    PACKAGING: 'Упаковка',
    OTHER: 'Прочее',
  }
  return labels[category] || category
}

// Цвета статусов заказов
export const getStatusColor = (status: string): string => {
  const colors: { [key: string]: string } = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    PREPARING: 'bg-orange-100 text-orange-800',
    READY: 'bg-purple-100 text-purple-800',
    DELIVERING: 'bg-indigo-100 text-indigo-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

// Метки статусов заказов
export const getStatusLabel = (status: string): string => {
  const labels: { [key: string]: string } = {
    PENDING: 'Ожидает',
    CONFIRMED: 'Подтвержден',
    PREPARING: 'Готовится',
    READY: 'Готов',
    DELIVERING: 'Доставляется',
    DELIVERED: 'Доставлен',
    CANCELLED: 'Отменен',
  }
  return labels[status] || status
}
