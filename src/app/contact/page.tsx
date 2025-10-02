import { Navbar } from '@/components/navbar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react'

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Главный баннер */}
        <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-16">
          <div className="container px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-3">Контакты</h1>
              <p className="text-xl md:text-2xl opacity-90">
                Свяжитесь с нами любым удобным способом
              </p>
            </div>
          </div>
        </section>

        {/* Контактная информация */}
        <section className="py-16">
          <div className="container px-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Левая колонка - контакты */}
              <div>
                <h2 className="text-3xl font-bold mb-3">
                  Как с нами связаться
                </h2>

                <div className="space-y-6">
                  <Card className="p-6">
                    <CardHeader className="flex flex-row items-center space-y-0 pb-4">
                      <Phone className="h-6 w-6 text-orange-600 mr-4" />
                      <div>
                        <CardTitle className="text-lg mb-2">Телефон</CardTitle>
                        <CardDescription>
                          Для заказов и вопросов
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-orange-600">
                        +7 (999) 123-45-67
                      </p>
                      <p className="text-gray-600 mt-1">
                        Ежедневно с 10:00 до 23:00
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="p-6">
                    <CardHeader className="flex flex-row items-center space-y-0 pb-4">
                      <Mail className="h-6 w-6 text-orange-600 mr-4" />
                      <div>
                        <CardTitle className="text-lg mb-2">Email</CardTitle>
                        <CardDescription>Для обратной связи</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold">
                        info@sushigorod.ru
                      </p>
                      <p className="text-gray-600 mt-1">
                        Отвечаем в течение 2 часов
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="p-6">
                    <CardHeader className="flex flex-row items-center space-y-0 pb-4">
                      <MapPin className="h-6 w-6 text-orange-600 mr-4" />
                      <div>
                        <CardTitle className="text-lg mb-2">Адрес</CardTitle>
                        <CardDescription>Наша кухня</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold">
                        г. Москва, ул. Примерная, д. 123
                      </p>
                      <p className="text-gray-600 mt-1">
                        м. Примерная (5 мин пешком)
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="p-6">
                    <CardHeader className="flex flex-row items-center space-y-0 pb-4">
                      <Clock className="h-6 w-6 text-orange-600 mr-4" />
                      <div>
                        <CardTitle className="text-lg mb-2">Время работы</CardTitle>
                        <CardDescription>График доставки</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        <p className="font-semibold">
                          Понедельник - Воскресенье
                        </p>
                        <p className="text-gray-600">
                          10:00 - 23:00 (прием заказов)
                        </p>
                        <p className="text-gray-600">
                          10:30 - 22:30 (доставка)
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Правая колонка - форма обратной связи */}
              <div>
                <h2 className="text-3xl font-bold mb-3">Напишите нам</h2>

                <Card className="p-6">
                  <CardHeader>
                    <CardTitle className="flex items-center mb-2">
                      <MessageSquare className="h-5 w-5 mr-2" />
                      Форма обратной связи
                    </CardTitle>
                    <CardDescription>
                      Оставьте сообщение, и мы свяжемся с вами в ближайшее время
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Имя</Label>
                          <Input id="firstName" placeholder="Ваше имя" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Фамилия</Label>
                          <Input id="lastName" placeholder="Ваша фамилия" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Телефон</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+7 (999) 123-45-67"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Тема</Label>
                        <Input id="subject" placeholder="Тема сообщения" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Сообщение</Label>
                        <textarea
                          id="message"
                          placeholder="Ваше сообщение..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                          rows={5}
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        Отправить сообщение
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Зона доставки */}
        <section className="py-16 bg-gray-50">
          <div className="container px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Зона доставки</h2>
              <p className="text-gray-600 text-lg">
                Мы доставляем во все районы Москвы
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center p-6">
                <CardHeader>
                  <CardTitle className="text-lg mb-2">Центральный округ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-orange-600 mb-2">
                    Бесплатно
                  </p>
                  <p className="text-gray-600">При заказе от 800 ₽</p>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardHeader>
                  <CardTitle className="text-lg mb-2">Северный округ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-orange-600 mb-2">
                    150 ₽
                  </p>
                  <p className="text-gray-600">При заказе от 1000 ₽</p>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardHeader>
                  <CardTitle className="text-lg mb-2">Южный округ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-orange-600 mb-2">
                    200 ₽
                  </p>
                  <p className="text-gray-600">При заказе от 1200 ₽</p>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardHeader>
                  <CardTitle className="text-lg mb-2">Другие округа</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-orange-600 mb-2">
                    250 ₽
                  </p>
                  <p className="text-gray-600">При заказе от 1500 ₽</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Доставка осуществляется в течение 30-60 минут с момента
                подтверждения заказа
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <div className="container px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">
                Часто задаваемые вопросы
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="mb-2">Как долго готовится заказ?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    В среднем приготовление заказа занимает 20-30 минут.
                    Доставка осуществляется в течение 30-60 минут с момента
                    подтверждения.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="mb-2">Можно ли оплатить картой?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Да, мы принимаем оплату наличными и картой при получении, а
                    также онлайн-оплату на сайте.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="mb-2">Есть ли минимальная сумма заказа?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Минимальная сумма заказа зависит от района доставки. Для
                    центральных районов — от 800 ₽.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="mb-2">
                    Можно ли заказать на определенное время?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Да, при оформлении заказа вы можете указать желаемое время
                    доставки. Мы стараемся выполнить заказ точно в срок.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
