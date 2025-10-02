import { Navbar } from '@/components/navbar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Clock, Award, Users, Heart } from 'lucide-react'
import Image from 'next/image'

export default function AboutPage() {
  const features = [
    {
      icon: <Clock className="h-8 w-8 text-orange-600" />,
      title: 'Быстрая доставка',
      description:
        'Доставляем ваши заказы в течение 30-60 минут по всему городу',
    },
    {
      icon: <Award className="h-8 w-8 text-orange-600" />,
      title: 'Высокое качество',
      description:
        'Используем только свежие ингредиенты от проверенных поставщиков',
    },
    {
      icon: <Users className="h-8 w-8 text-orange-600" />,
      title: 'Опытные повара',
      description: 'Наши повара обучались в лучших ресторанах Японии',
    },
    {
      icon: <Heart className="h-8 w-8 text-orange-600" />,
      title: 'С любовью к делу',
      description:
        'Каждое блюдо готовится с особой тщательностью и вниманием к деталям',
    },
  ]

  return (
    <>
      <Navbar />
      <main>
        {/* Главный баннер */}
        <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-16">
          <div className="container px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-3">О нас</h1>
              <p className="text-xl md:text-2xl opacity-90">
                Мы создаем не просто еду — мы создаем кулинарные шедевры
              </p>
            </div>
          </div>
        </section>

        {/* Наша история */}
        <section className="py-16">
          <div className="container px-6">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-3">Наша история</h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    Суши Город начал свою историю в 2018 году с небольшого
                    семейного ресторана в центре Москвы. Основатели компании,
                    Хироши и Анна Танака, решили познакомить россиян с подлинным
                    вкусом традиционной японской кухни.
                  </p>
                  <p>
                    Хироши родился в Токио и с детства изучал искусство
                    приготовления суши от своего деда, который был мастером суши
                    в знаменитом рыбном рынке Цукидзи. Анна, москвичка по
                    происхождению, влюбилась в японскую культуру и кулинарию во
                    время учебы в Японии.
                  </p>
                  <p>
                    Сегодня Суши Город — это не просто ресторан доставки, это
                    место, где традиции встречаются с современностью, где каждое
                    блюдо рассказывает свою историю, а каждый клиент становится
                    частью большой семьи.
                  </p>
                </div>
              </div>
              <div className="aspect-square bg-gray-200 rounded-lg relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  Фото нашего ресторана
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Наши преимущества */}
        <section className="py-16 bg-gray-50">
          <div className="container px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Почему выбирают нас</h2>
              <p className="text-gray-600 text-lg">
                Что делает нас особенными в мире доставки японской кухни
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="text-center p-6">
                  <CardHeader>
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Наша команда */}
        <section className="py-16">
          <div className="container px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Наша команда</h2>
              <p className="text-gray-600 text-lg">
                Профессионалы, которые создают для вас лучшие блюда
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center p-6">
                <CardHeader>
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <CardTitle className="mb-2">Хироши Танака</CardTitle>
                  <CardDescription>Шеф-повар и основатель</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Мастер суши с 20-летним опытом. Обучался у лучших мастеров
                    Токио.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardHeader>
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <CardTitle className="mb-2">Анна Танака</CardTitle>
                  <CardDescription>Менеджер и со-основатель</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Эксперт по японской культуре и кулинарии. Отвечает за
                    качество сервиса.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardHeader>
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <CardTitle className="mb-2">Юки Сато</CardTitle>
                  <CardDescription>Су-шеф</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Молодой талантливый повар, специалист по современным
                    техникам приготовления.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Наши принципы */}
        <section className="py-16 bg-gray-50">
          <div className="container px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Наши принципы</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2 text-orange-600">
                  Качество
                </h3>
                <p className="text-gray-600">
                  Мы никогда не идем на компромиссы в вопросах качества
                  ингредиентов и приготовления блюд.
                </p>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold mb-2 text-orange-600">
                  Традиции
                </h3>
                <p className="text-gray-600">
                  Мы бережно храним и передаем традиции японской кулинарии,
                  адаптируя их к современным реалиям.
                </p>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold mb-2 text-orange-600">
                  Инновации
                </h3>
                <p className="text-gray-600">
                  Мы постоянно совершенствуем наши рецепты и технологии, не
                  забывая о традиционных основах.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
