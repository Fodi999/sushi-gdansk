import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    // Игнорируем ESLint ошибки при build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Игнорируем TypeScript ошибки при build (осторожно!)
    // ignoreBuildErrors: true,
  },
}

export default nextConfig
