/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  env: {
    // DeepL APIキー
    DEEPL_API_KEY: '3b6926d8-d7fe-0ab5-a139-58078d395af5:fx',
  },
}

module.exports = nextConfig 