/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreduringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig