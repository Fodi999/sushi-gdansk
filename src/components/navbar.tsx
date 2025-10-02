'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ShoppingCart, User, Menu, LogOut, Package } from 'lucide-react'

export function Navbar() {
  const { data: session } = useSession()
  const [cartItemsCount, setCartItemsCount] = useState(0)

  useEffect(() => {
    if (session) {
      fetchCartCount()
    }
  }, [session])

  const fetchCartCount = async () => {
    try {
      const response = await fetch('/api/cart')
      if (response.ok) {
        const data = await response.json()
        setCartItemsCount(data.count || 0)
      }
    } catch (error) {
      console.error('Error fetching cart count:', error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-6 flex h-16 items-center justify-between">
        {/* Логотип */}
        <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
          <span className="text-xl sm:text-2xl font-bold text-primary">🍣 Суши Город</span>
        </Link>

        {/* Навигация для десктопа */}
        <nav className="hidden lg:flex items-center space-x-8">
          <Link
            href="/menu"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Меню
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            О нас
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Контакты
          </Link>
        </nav>

        {/* Правая часть */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Корзина */}
          <Button variant="ghost" size="sm" asChild className="relative">
            <Link href="/cart" className="flex items-center">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Корзина</span>
              {cartItemsCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </Badge>
              )}
            </Link>
          </Button>

          {/* Пользователь для десктопа */}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  <User className="h-4 w-4 mr-2" />
                  <span className="max-w-[100px] truncate">
                    {session.user?.name || session.user?.email}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Профиль
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    Мои заказы
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()} className="flex items-center">
                  <LogOut className="h-4 w-4 mr-2" />
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden lg:flex space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/signin">Войти</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/signup">Регистрация</Link>
              </Button>
            </div>
          )}

          {/* Мобильное меню */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Открыть меню</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader className="text-left">
                <SheetTitle className="flex items-center">
                  🍣 Суши Город
                </SheetTitle>
                <SheetDescription>
                  Доставка японской кухни
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-8 space-y-6">
                {/* Профиль пользователя в мобильном меню */}
                {session && (
                  <div className="border-b pb-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {session.user?.name || 'Пользователь'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {session.user?.email}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                        <Link href="/profile">
                          <User className="h-4 w-4 mr-2" />
                          Профиль
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                        <Link href="/orders">
                          <Package className="h-4 w-4 mr-2" />
                          Мои заказы
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Навигация */}
                <nav className="space-y-2">
                  <Button variant="ghost" size="sm" asChild className="w-full justify-start text-base">
                    <Link href="/menu">
                      🍱 Меню
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild className="w-full justify-start text-base">
                    <Link href="/about">
                      ℹ️ О нас
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild className="w-full justify-start text-base">
                    <Link href="/contact">
                      📞 Контакты
                    </Link>
                  </Button>
                </nav>

                {/* Авторизация для незарегистрированных */}
                {!session && (
                  <div className="border-t pt-6 space-y-3">
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/auth/signin">Войти</Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link href="/auth/signup">Регистрация</Link>
                    </Button>
                  </div>
                )}

                {/* Выход для авторизованных */}
                {session && (
                  <div className="border-t pt-6">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => signOut()} 
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Выйти
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
