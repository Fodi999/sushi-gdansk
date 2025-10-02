import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Логика middleware
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Проверяем админские роуты
        if (req.nextUrl.pathname.startsWith('/admin')) {
          // Для админских роутов нужна роль ADMIN
          return token?.role === 'ADMIN'
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*']
}
