/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify: true,
  images: {
    domains: ["firebasestorage.googleapis.com", "localhost", "127.0.0.1"],
    formats: ["image/webp"],
  },
  async redirects() {
    return [
      // { source: "/collections", destination: "/", permanent: true },
      { source: "/subjects", destination: "/", permanent: true },
    ]
  },
}

module.exports = nextConfig
