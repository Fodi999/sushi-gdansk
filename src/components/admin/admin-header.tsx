import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Shield, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'

interface AdminHeaderProps {
  userName?: string | null
  userEmail?: string | null
}

export function AdminHeader({ userName, userEmail }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Панель администратора</h1>
            <p className="text-sm text-gray-600">Суши Город</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Онлайн
          </Badge>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{userName || userEmail}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
