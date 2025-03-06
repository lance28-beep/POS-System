/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/pos-system' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/pos-system/' : '',
}

module.exports = nextConfig 