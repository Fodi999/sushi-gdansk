import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/navbar'
import Link from 'next/link'
import { Clock, MapPin, Phone, Star } from 'lucide-react'

export default function HomePage() {
  const featuredProducts = [
    {
      id: 1,
      name: 'Филадельфия Классик',
      description: 'Лосось, сливочный сыр, огурец',
      price: 320,
      image: '/images/philadelphia.jpg',
      rating: 4.8,
    },
    {
      id: 2,
      name: 'Калифорния',
      description: 'Краб, авокадо, огурец, икра тобико',
      price: 280,
      image: '/images/california.jpg',
      rating: 4.6,
    },
    {
      id: 3,
      name: 'Дракон',
      description: 'Угорь, огурец, унаги соус',
      price: 380,
      image: '/images/dragon.jpg',
      rating: 4.9,
    },
  ]

  return (
    <>
      <Navbar />
      <main>
        {/* Главный баннер */}
        <section className="relative bg-gradient-to-r from-orange-500 to-red-600 text-white">
          <div className="container py-20 md:py-32">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Лучшие суши в городе с доставкой на дом
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Свежие ингредиенты, традиционные рецепты и быстрая доставка
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/menu">Посмотреть меню</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-orange-600"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  +7 (999) 123-45-67
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Преимущества */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Быстрая доставка</h3>
                <p className="text-gray-600">
                  Доставляем в течение 30-60 минут по всему городу
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Качество</h3>
                <p className="text-gray-600">
                  Только свежие ингредиенты и проверенные поставщики
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Широкая география
                </h3>
                <p className="text-gray-600">
                  Доставляем во все районы города без исключения
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Популярные товары */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Популярные роллы
              </h2>
              <p className="text-gray-600 text-lg">
                Самые любимые позиции наших клиентов
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredProducts.map(product => (
                <Card
                  key={product.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video bg-gray-200 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <Badge className="absolute top-4 right-4 bg-orange-600">
                      <Star className="h-3 w-3 mr-1" />
                      {product.rating}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-orange-600">
                        {product.price} ₽
                      </span>
                      <Button>В корзину</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button size="lg" variant="outline" asChild>
                <Link href="/menu">Смотреть все товары</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* О нас */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">О нас</h2>
                <p className="text-gray-600 text-lg mb-6">
                  Мы готовим суши по традиционным японским рецептам, используя
                  только самые свежие и качественные ингредиенты. Наши повара
                  имеют многолетний опыт работы в лучших ресторанах Японии.
                </p>
                <p className="text-gray-600 text-lg mb-8">
                  Каждый ролл готовится вручную с особой тщательностью и любовью
                  к делу. Мы гарантируем высочайшее качество и непревзойденный
                  вкус.
                </p>
                <Button asChild>
                  <Link href="/about">Узнать больше</Link>
                </Button>
              </div>
              <div className="aspect-square bg-gray-200 rounded-lg">
                {/* Здесь будет изображение */}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Футер */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">🍣 Суши Город</h3>
              <p className="text-gray-400">Лучшие суши с доставкой на дом</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <div className="space-y-2 text-gray-400">
                <p>+7 (999) 123-45-67</p>
                <p>info@sushigorod.ru</p>
                <p>г. Москва, ул. Примерная, 123</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Время работы</h4>
              <div className="space-y-2 text-gray-400">
                <p>Пн-Вс: 10:00 - 23:00</p>
                <p>Доставка до 22:30</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Навигация</h4>
              <div className="space-y-2">
                <Link
                  href="/menu"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Меню
                </Link>
                <Link
                  href="/about"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  О нас
                </Link>
                <Link
                  href="/contact"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Контакты
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Суши Город. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
