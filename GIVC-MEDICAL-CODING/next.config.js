/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint during build for simplicity
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Enable static export for Cloudflare Pages
  ...(process.env.STATIC_EXPORT === "true" && {
    output: "export",
    trailingSlash: true,
    images: {
      unoptimized: true,
    },
  }),
};

module.exports = nextConfig;