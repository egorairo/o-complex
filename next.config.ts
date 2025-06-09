/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['o-complex.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://o-complex.com:1337/:path*',
      },
    ]
  },
}

export default nextConfig
