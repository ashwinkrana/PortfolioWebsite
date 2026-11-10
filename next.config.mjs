/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Only needed if you migrate the reveal assets to next/image.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  // The design explorations stay available in development but never ship publicly.
  async redirects() {
    if (process.env.NODE_ENV !== "production") return [];
    return [
      { source: "/variants", destination: "/", permanent: false },
      { source: "/variants/:path*", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
