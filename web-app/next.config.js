/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com'],
  },
  env: {
    ROOT_API: process.env.ROOT_API
  }
}

module.exports = nextConfig
