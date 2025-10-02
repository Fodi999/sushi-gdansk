import { PrismaClient, IngredientCategory } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Начинаем заполнение базы данных тестовыми ингредиентами...')

  // Создаем ингредиенты
  const ingredients = [
    // Рыба
    { name: 'Лосось', category: 'FISH' as IngredientCategory, unit: 'кг', minStock: 5, purchasePrice: 800 },
    { name: 'Тунец', category: 'FISH' as IngredientCategory, unit: 'кг', minStock: 3, purchasePrice: 1200 },
    { name: 'Угорь', category: 'FISH' as IngredientCategory, unit: 'кг', minStock: 2, purchasePrice: 1500 },
    
    // Морепродукты
    { name: 'Креветки', category: 'SEAFOOD' as IngredientCategory, unit: 'кг', minStock: 3, purchasePrice: 600 },
    { name: 'Краб (снежный)', category: 'SEAFOOD' as IngredientCategory, unit: 'кг', minStock: 2, purchasePrice: 2000 },
    { name: 'Икра (масаго)', category: 'SEAFOOD' as IngredientCategory, unit: 'кг', minStock: 0.5, purchasePrice: 1800 },
    { name: 'Икра (тобико)', category: 'SEAFOOD' as IngredientCategory, unit: 'кг', minStock: 0.5, purchasePrice: 2200 },
    
    // Рис
    { name: 'Рис для суши', category: 'RICE' as IngredientCategory, unit: 'кг', minStock: 20, purchasePrice: 150 },
    { name: 'Рисовый уксус', category: 'RICE' as IngredientCategory, unit: 'л', minStock: 5, purchasePrice: 300 },
    
    // Овощи
    { name: 'Авокадо', category: 'VEGETABLES' as IngredientCategory, unit: 'кг', minStock: 5, purchasePrice: 400 },
    { name: 'Огурец', category: 'VEGETABLES' as IngredientCategory, unit: 'кг', minStock: 10, purchasePrice: 80 },
    { name: 'Манго', category: 'VEGETABLES' as IngredientCategory, unit: 'кг', minStock: 2, purchasePrice: 500 },
    
    // Водоросли
    { name: 'Нори (листы)', category: 'SEAWEED' as IngredientCategory, unit: 'упак', minStock: 50, purchasePrice: 30 },
    { name: 'Чука салат', category: 'SEAWEED' as IngredientCategory, unit: 'кг', minStock: 2, purchasePrice: 600 },
    
    // Соусы
    { name: 'Соевый соус', category: 'SAUCES' as IngredientCategory, unit: 'л', minStock: 5, purchasePrice: 200 },
    { name: 'Соус Унаги', category: 'SAUCES' as IngredientCategory, unit: 'л', minStock: 3, purchasePrice: 450 },
    { name: 'Соус Спайси', category: 'SAUCES' as IngredientCategory, unit: 'л', minStock: 3, purchasePrice: 350 },
    { name: 'Васаби', category: 'SAUCES' as IngredientCategory, unit: 'кг', minStock: 1, purchasePrice: 800 },
    
    // Сыры
    { name: 'Сыр Филадельфия', category: 'CHEESE' as IngredientCategory, unit: 'кг', minStock: 5, purchasePrice: 500 },
    { name: 'Сливочный сыр', category: 'CHEESE' as IngredientCategory, unit: 'кг', minStock: 3, purchasePrice: 400 },
    
    // Приправы
    { name: 'Имбирь маринованный', category: 'SEASONINGS' as IngredientCategory, unit: 'кг', minStock: 3, purchasePrice: 300 },
    { name: 'Кунжут белый', category: 'SEASONINGS' as IngredientCategory, unit: 'кг', minStock: 2, purchasePrice: 250 },
    { name: 'Кунжут черный', category: 'SEASONINGS' as IngredientCategory, unit: 'кг', minStock: 1, purchasePrice: 300 },
    
    // Упаковка
    { name: 'Коробка для роллов', category: 'PACKAGING' as IngredientCategory, unit: 'шт', minStock: 100, purchasePrice: 15 },
    { name: 'Палочки для еды', category: 'PACKAGING' as IngredientCategory, unit: 'пара', minStock: 200, purchasePrice: 3 },
    { name: 'Контейнер для соусов', category: 'PACKAGING' as IngredientCategory, unit: 'шт', minStock: 200, purchasePrice: 2 },
  ]

  for (const ing of ingredients) {
    await prisma.ingredient.upsert({
      where: { name: ing.name },
      update: {},
      create: {
        name: ing.name,
        category: ing.category,
        unit: ing.unit,
        minStock: ing.minStock,
        purchasePrice: ing.purchasePrice,
        currentStock: 0,
      },
    })
  }

  console.log('✅ Ингредиенты созданы!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
