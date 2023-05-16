/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify: true,
  images: {
    domains: ["firebasestorage.googleapis.com", "localhost", "127.0.0.1"],
    formats: ["image/webp"],
  },
  i18n: {
    locales: ["en", "ta"],
    defaultLocale: "en",
    domains: [
      { domain: "asatic.org", defaultLocale: "en", locales: ["en"] },
      {
        domain: "asatic.org/?siteLanguageId=tamil",
        defaultLocale: "ta",
        locales: ["ta"],
      },
    ],
  },
  async redirects() {
    return [{ source: "/subjects", destination: "/", permanent: true }]
  },
}

module.exports = nextConfig
