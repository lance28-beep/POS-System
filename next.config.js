/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  basePath: process.env.NODE_ENV === 'production' ? '/pos-system' : '',
}

module.exports = nextConfig 