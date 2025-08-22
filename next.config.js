/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'yt3.ggpht.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'abs.twimg.com',
        pathname: '/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3310',
  },
  // Production 빌드 최적화
  output: 'standalone',
  poweredByHeader: false,
  compress: true,

  // Next.js 15 새로운 최적화 기능
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // 개발 환경 설정
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  },

  // TypeScript 에러 무시 (개발 시에만)
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;