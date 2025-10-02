# Компоненты админ панели

Модульная структура админ панели для лучшей организации кода и переиспользования компонентов.

## Структура

```
src/
├── app/
│   └── admin/
│       ├── page.tsx                      # Главная страница админки (упрощенная)
│       └── page-old.tsx.backup          # Старая версия (backup)
├── components/
│   └── admin/
│       ├── index.ts                      # Экспорт всех компонентов
│       ├── admin-header.tsx              # Шапка админ панели
│       ├── stats-cards.tsx               # Карточки статистики
│       ├── add-stock-dialog.tsx          # Диалог добавления на склад
│       ├── stock-items-list.tsx          # Список товаров на складе
│       └── stock-movements-list.tsx      # История движений
├── types/
│   └── admin.ts                          # TypeScript типы для админки
└── lib/
    └── admin-utils.ts                    # Утилитарные функции
```

## Компоненты

### AdminHeader
Шапка админ панели с информацией о пользователе и кнопкой выхода.

**Props:**
- `userName?: string | null` - имя пользователя
- `userEmail?: string | null` - email пользователя

### StatsCards
Карточки с основной статистикой (доход, заказы, пользователи, товары).

**Props:**
- `stats: AdminStats | null` - данные статистики

### AddStockDialog
Диалоговое окно для добавления прихода товара на склад.

**Props:**
- `open: boolean` - открыт ли диалог
- `onOpenChange: (open: boolean) => void` - callback изменения состояния
- `ingredients: Ingredient[]` - список ингредиентов
- `onSubmit: (data: StockFormData) => Promise<void>` - callback отправки формы
- `getCategoryLabel: (category: string) => string` - функция перевода категорий

**Features:**
- Автоматический расчет процента отхода
- Валидация полей
- Динамическое обновление единиц измерения

### StockItemsList
Список товаров на складе с детальной информацией.

**Props:**
- `items: StockItem[]` - массив складских позиций
- `getCategoryLabel: (category: string) => string` - функция перевода категорий

### StockMovementsList
История движений товаров (приход/списание).

**Props:**
- `movements: StockMovement[]` - массив движений
- `limit?: number` - количество отображаемых записей (default: 10)

## Типы

Все типы находятся в `src/types/admin.ts`:
- `AdminStats` - статистика админ панели
- `StockItem` - складская позиция
- `StockMovement` - движение товара
- `Ingredient` - ингредиент
- `Order` - заказ
- `Product` - товар
- `User` - пользователь

## Утилиты

В `src/lib/admin-utils.ts`:
- `getCategoryLabel(category: string)` - перевод категорий ингредиентов
- `getStatusColor(status: string)` - цвета для статусов заказов
- `getStatusLabel(status: string)` - метки для статусов заказов

## Преимущества модульной структуры

1. **Читаемость** - каждый компонент в отдельном файле
2. **Переиспользование** - компоненты можно использовать в разных местах
3. **Тестирование** - проще писать unit-тесты для отдельных компонентов
4. **Поддержка** - легче найти и исправить баги
5. **Масштабируемость** - легко добавлять новые компоненты

## Использование

```tsx
import { AdminHeader, StatsCards, AddStockDialog } from '@/components/admin'
import { getCategoryLabel } from '@/lib/admin-utils'

// В компоненте
<AdminHeader userName={userName} userEmail={userEmail} />
<StatsCards stats={stats} />
<AddStockDialog
  open={showDialog}
  onOpenChange={setShowDialog}
  ingredients={ingredients}
  onSubmit={handleSubmit}
  getCategoryLabel={getCategoryLabel}
/>
```

## Дальнейшее развитие

Следующие компоненты, которые можно создать:
- `OrdersList` - список заказов
- `OrderCard` - карточка заказа
- `ProductsList` - список товаров
- `UsersList` - список пользователей
- `AnalyticsCharts` - графики аналитики
- `SettingsPanel` - панель настроек
