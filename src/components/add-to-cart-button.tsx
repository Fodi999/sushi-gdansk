'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus, Loader2, Check } from 'lucide-react'

interface AddToCartButtonProps {
  productId: string
  quantity?: number
  className?: string
}

export function AddToCartButton({
  productId,
  quantity = 1,
  className,
}: AddToCartButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState(false)

  const addToCart = async () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity,
        }),
      })

      if (response.ok) {
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
        // Здесь можно добавить toast уведомление
        console.log('Товар добавлен в корзину')
      } else {
        const error = await response.json()
        console.error('Ошибка добавления в корзину:', error.error)
      }
    } catch (error) {
      console.error('Ошибка добавления в корзину:', error)
    } finally {
      setLoading(false)
    }
  }

  if (added) {
    return (
      <Button disabled className={className}>
        <Check className="h-4 w-4 mr-2" />
        Добавлено
      </Button>
    )
  }

  return (
    <Button onClick={addToCart} disabled={loading} className={className}>
      {loading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Plus className="h-4 w-4 mr-2" />
      )}
      В корзину
    </Button>
  )
}
