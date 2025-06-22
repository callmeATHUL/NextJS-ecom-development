/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoyellowuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig