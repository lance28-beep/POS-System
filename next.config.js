/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/POS-System',
  images: {
    unoptimized: true,
  },
  assetPrefix: '/POS-System/',
}

module.exports = nextConfig 