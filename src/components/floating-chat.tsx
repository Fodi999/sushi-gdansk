'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Chat } from '@/components/chat'
import { MessageCircle, X } from 'lucide-react'

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Скрываем плавающий чат на странице профиля, где уже есть встроенный чат
  if (pathname === '/profile') {
    return null
  }

  return (
    <>
      {/* Плавающая кнопка */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40"
          size="sm"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Окно чата */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 z-50">
          <div className="relative">
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
              className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 z-10"
            >
              <X className="h-4 w-4" />
            </Button>
            <Chat className="shadow-2xl" />
          </div>
        </div>
      )}
    </>
  )
}
