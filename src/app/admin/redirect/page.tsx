'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminRedirect() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    } else if (session) {
      // Проверим права администратора
      fetch('/api/auth/check-admin')
        .then(res => res.json())
        .then(data => {
          if (data.isAdmin) {
            // Перенаправляем на dashboard, так как он находится в /admin/page.tsx
            router.replace('/admin')
          } else {
            router.push('/admin/login')
          }
        })
        .catch(() => {
          router.push('/admin/login')
        })
    }
  }, [session, status, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <p>Проверка доступа...</p>
      </div>
    </div>
  )
}
