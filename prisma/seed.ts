import { PrismaClient, IngredientCategory } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Начинаем заполнение базы данных...')

  // Создаем админа
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sushigorod.ru' },
    update: {},
    create: {
      email: 'admin@sushigorod.ru',
      name: 'Администратор',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // Создаем тестового пользователя
  const userPassword = await bcrypt.hash('user123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Тестовый пользователь',
      password: userPassword,
      phone: '+7 (999) 123-45-67',
      address: 'г. Москва, ул. Тестовая, д. 1',
      role: 'USER',
    },
  })

  // Создаем категории
  const categories = [
    {
      name: 'Классические роллы',
      description: 'Традиционные японские роллы',
    },
    {
      name: 'Запеченные роллы',
      description: 'Роллы, запеченные в духовке',
    },
    {
      name: 'Сеты',
      description: 'Готовые наборы роллов',
    },
    {
      name: 'Суши',
      description: 'Классические суши',
    },
    {
      name: 'Горячие блюда',
      description: 'Горячие японские блюда',
    },
  ]

  const createdCategories = []
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    })
    createdCategories.push(created)
  }

  // Создаем ингредиенты
  const ingredients = [
    // Рыба
    { name: 'Лосось', category: IngredientCategory.FISH, unit: 'кг', minStock: 5, purchasePrice: 800 },
    { name: 'Тунец', category: IngredientCategory.FISH, unit: 'кг', minStock: 3, purchasePrice: 1200 },
    { name: 'Угорь', category: IngredientCategory.FISH, unit: 'кг', minStock: 2, purchasePrice: 1500 },
    
    // Морепродукты
    { name: 'Креветки', category: IngredientCategory.SEAFOOD, unit: 'кг', minStock: 2, purchasePrice: 900 },
    { name: 'Крабовое мясо', category: IngredientCategory.SEAFOOD, unit: 'кг', minStock: 3, purchasePrice: 400 },
    { name: 'Икра тобико', category: IngredientCategory.SEAFOOD, unit: 'г', minStock: 200, purchasePrice: 2 },
    
    // Рис
    { name: 'Рис для суши', category: IngredientCategory.RICE, unit: 'кг', minStock: 20, purchasePrice: 150 },
    
    // Овощи
    { name: 'Авокадо', category: IngredientCategory.VEGETABLES, unit: 'шт', minStock: 10, purchasePrice: 80 },
    { name: 'Огурец', category: IngredientCategory.VEGETABLES, unit: 'кг', minStock: 5, purchasePrice: 100 },
    { name: 'Зеленый лук', category: IngredientCategory.VEGETABLES, unit: 'кг', minStock: 1, purchasePrice: 200 },
    
    // Водоросли
    { name: 'Нори', category: IngredientCategory.SEAWEED, unit: 'упак', minStock: 5, purchasePrice: 300 },
    { name: 'Чука', category: IngredientCategory.SEAWEED, unit: 'кг', minStock: 2, purchasePrice: 500 },
    
    // Соусы
    { name: 'Соевый соус', category: IngredientCategory.SAUCES, unit: 'л', minStock: 5, purchasePrice: 200 },
    { name: 'Унаги соус', category: IngredientCategory.SAUCES, unit: 'л', minStock: 3, purchasePrice: 400 },
    { name: 'Спайси соус', category: IngredientCategory.SAUCES, unit: 'л', minStock: 3, purchasePrice: 350 },
    { name: 'Васаби', category: IngredientCategory.SAUCES, unit: 'кг', minStock: 1, purchasePrice: 800 },
    
    // Сыры
    { name: 'Сливочный сыр', category: IngredientCategory.CHEESE, unit: 'кг', minStock: 5, purchasePrice: 600 },
    { name: 'Сыр Филадельфия', category: IngredientCategory.CHEESE, unit: 'кг', minStock: 3, purchasePrice: 800 },
    
    // Приправы
    { name: 'Кунжут', category: IngredientCategory.SEASONINGS, unit: 'кг', minStock: 2, purchasePrice: 300 },
    { name: 'Имбирь маринованный', category: IngredientCategory.SEASONINGS, unit: 'кг', minStock: 3, purchasePrice: 250 },
    
    // Упаковка
    { name: 'Контейнеры для роллов', category: IngredientCategory.PACKAGING, unit: 'шт', minStock: 100, purchasePrice: 15 },
    { name: 'Палочки', category: IngredientCategory.PACKAGING, unit: 'упак', minStock: 50, purchasePrice: 5 },
    { name: 'Пакеты', category: IngredientCategory.PACKAGING, unit: 'упак', minStock: 20, purchasePrice: 50 },
  ]

  console.log('Создаем ингредиенты...')
  for (const ingredient of ingredients) {
    await prisma.ingredient.upsert({
      where: { name: ingredient.name },
      update: {},
      create: ingredient,
    })
  }

  // Создаем продукты
  const products = [
    // Классические роллы
    {
      name: 'Филадельфия Классик',
      description: 'Лосось, сливочный сыр, огурец',
      price: 320,
      categoryName: 'Классические роллы',
      ingredients: 'Лосось, сливочный сыр, огурец, нори, рис',
      weight: '250г',
    },
    {
      name: 'Калифорния',
      description: 'Краб, авокадо, огурец, икра тобико',
      price: 280,
      categoryName: 'Классические роллы',
      ingredients: 'Краб, авокадо, огурец, икра тобико, нори, рис',
      weight: '230г',
    },
    {
      name: 'Дракон',
      description: 'Угорь, огурец, унаги соус',
      price: 380,
      categoryName: 'Классические роллы',
      ingredients: 'Угорь, огурец, унаги соус, нори, рис',
      weight: '260г',
    },
    {
      name: 'Спайси Тунец',
      description: 'Тунец, спайси соус, зеленый лук',
      price: 340,
      categoryName: 'Классические роллы',
      ingredients: 'Тунец, спайси соус, зеленый лук, нори, рис',
      weight: '240г',
    },
    // Запеченные роллы
    {
      name: 'Запеченная Филадельфия',
      description: 'Лосось, сливочный сыр, запеченный с соусом',
      price: 390,
      categoryName: 'Запеченные роллы',
      ingredients: 'Лосось, сливочный сыр, спайси соус, нори, рис',
      weight: '280г',
    },
    {
      name: 'Запеченный Краб',
      description: 'Краб, авокадо, запеченный с сыром',
      price: 350,
      categoryName: 'Запеченные роллы',
      ingredients: 'Краб, авокадо, сыр, спайси соус, нори, рис',
      weight: '270г',
    },
    // Суши
    {
      name: 'Суши Лосось',
      description: 'Классические суши с лососем',
      price: 80,
      categoryName: 'Суши',
      ingredients: 'Лосось, рис, васаби',
      weight: '30г',
    },
    {
      name: 'Суши Тунец',
      description: 'Классические суши с тунцом',
      price: 90,
      categoryName: 'Суши',
      ingredients: 'Тунец, рис, васаби',
      weight: '30г',
    },
    {
      name: 'Суши Угорь',
      description: 'Классические суши с угрем',
      price: 95,
      categoryName: 'Суши',
      ingredients: 'Угорь, рис, унаги соус',
      weight: '30г',
    },
    // Сеты
    {
      name: 'Сет Классический',
      description: 'Филадельфия, Калифорния, Дракон',
      price: 890,
      categoryName: 'Сеты',
      ingredients: '24 ролла: Филадельфия, Калифорния, Дракон',
      weight: '750г',
    },
    {
      name: 'Сет Большой',
      description: '6 видов роллов для большой компании',
      price: 1590,
      categoryName: 'Сеты',
      ingredients: '48 роллов: разные виды',
      weight: '1.5кг',
    },
  ]

  for (const product of products) {
    const category = createdCategories.find(
      c => c.name === product.categoryName
    )
    if (category) {
      const existingProduct = await prisma.product.findFirst({
        where: { name: product.name },
      })

      if (!existingProduct) {
        await prisma.product.create({
          data: {
            name: product.name,
            description: product.description,
            price: product.price,
            categoryId: category.id,
            ingredients: product.ingredients,
            weight: product.weight,
            available: true,
          },
        })
      }
    }
  }

  console.log('База данных успешно заполнена!')
  console.log('Администратор: admin@sushigorod.ru / admin123')
  console.log('Пользователь: user@example.com / user123')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
