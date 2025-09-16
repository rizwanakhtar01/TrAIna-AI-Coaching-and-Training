/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV !== 'production',
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV !== 'production',
  },
  images: {
    unoptimized: true,
  },
  // Configure headers for Replit environment with proper security
  async headers() {
    const isProduction = process.env.NODE_ENV === 'production';
    
    return [
      {
        source: '/(.*)',
        headers: isProduction 
          ? [
              {
                key: 'X-Frame-Options',
                value: 'SAMEORIGIN',
              },
              {
                key: 'Content-Security-Policy',
                value: "frame-ancestors 'self'",
              },
            ]
          : [
              {
                key: 'Content-Security-Policy',
                value: "frame-ancestors 'self' *.replit.dev *.repl.co",
              },
            ],
      },
    ]
  },
}

export default nextConfig
