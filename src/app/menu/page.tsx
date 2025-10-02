import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/navbar'
import { AddToCartButton } from '@/components/add-to-cart-button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Star } from 'lucide-react'
import Image from 'next/image'

export default async function MenuPage() {
  const categories = await prisma.category.findMany({
    include: {
      products: {
        where: {
          available: true,
        },
        orderBy: {
          name: 'asc',
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })

  return (
    <>
      <Navbar />
      <main className="container py-12 px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Наше меню</h1>
          <p className="text-gray-600 text-lg">
            Выберите из широкого ассортимента японской кухни
          </p>
        </div>

        <Tabs
          defaultValue={categories[0]?.name.toLowerCase() || 'all'}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
            {categories.map(category => (
              <TabsTrigger
                key={category.id}
                value={category.name.toLowerCase()}
                className="text-sm"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(category => (
            <TabsContent key={category.id} value={category.name.toLowerCase()}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
                {category.description && (
                  <p className="text-gray-600">{category.description}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.products.map(product => (
                  <Card
                    key={product.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-video bg-gray-200 relative">
                      {product.image && (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          onError={e => {
                            // Показываем placeholder при ошибке загрузки изображения
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      <Badge className="absolute top-4 right-4 bg-green-600">
                        Доступно
                      </Badge>
                    </div>

                    <CardHeader className="p-6">
                      <CardTitle className="text-xl mb-2">{product.name}</CardTitle>
                      <CardDescription className="mb-3">{product.description}</CardDescription>
                      {product.ingredients && (
                        <p className="text-sm text-gray-500 mb-2">
                          <strong>Состав:</strong> {product.ingredients}
                        </p>
                      )}
                      {product.weight && (
                        <p className="text-sm text-gray-500">
                          <strong>Вес:</strong> {product.weight}
                        </p>
                      )}
                    </CardHeader>

                    <CardContent className="p-6 pt-0">
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-orange-600">
                          {product.price} ₽
                        </div>
                        <AddToCartButton productId={product.id} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {category.products.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    В этой категории пока нет товаров
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Меню временно недоступно</p>
          </div>
        )}
      </main>
    </>
  )
}
