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
import { Clock, Star, ArrowRight } from 'lucide-react'

export default function HomePage() {
  const featuredProducts = [
    {
      id: 1,
      name: 'Филадельфия',
      price: 320,
      rating: 4.8,
    },
    {
      id: 2,
      name: 'Калифорния',
      price: 280,
      rating: 4.6,
    },
    {
      id: 3,
      name: 'Дракон',
      price: 380,
      rating: 4.9,
    },
  ]

  return (
    <>
      <Navbar />
      <main>
        {/* Главный баннер */}
        <section className="relative bg-gradient-to-r from-orange-500 to-red-600 text-white py-20">
          <div className="container px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Суши Город
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Свежие суши с доставкой за 30 минут
              </p>
              <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-6">
                <Link href="/menu">
                  Заказать сейчас
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Популярные роллы */}
        <section className="py-16">
          <div className="container px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">
                Популярные роллы
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {featuredProducts.map(product => (
                <Card
                  key={product.id}
                  className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader className="p-6">
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🍣</span>
                    </div>
                    <CardTitle className="text-xl mb-2">{product.name}</CardTitle>
                    <div className="flex items-center justify-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{product.rating}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-orange-600">
                        {product.price} ₽
                      </span>
                      <Button size="sm">В корзину</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button variant="outline" asChild>
                <Link href="/menu">Все меню</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Преимущества */}
        <section className="py-16 bg-gray-50">
          <div className="container px-6">
            <div className="max-w-2xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 text-center">
                <div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold mb-2">30 минут</h3>
                  <p className="text-sm text-gray-600">Быстрая доставка</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold mb-2">4.8 ★</h3>
                  <p className="text-sm text-gray-600">Рейтинг клиентов</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Минимальный футер */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container px-6">
          <div className="text-center">
            <h3 className="text-lg font-bold mb-2">🍣 Суши Город</h3>
            <p className="text-gray-400 text-sm mb-4">+7 (999) 123-45-67</p>
            <div className="flex justify-center space-x-6 text-sm">
              <Link href="/menu" className="text-gray-400 hover:text-white transition-colors">
                Меню
              </Link>
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                О нас
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                Контакты
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
