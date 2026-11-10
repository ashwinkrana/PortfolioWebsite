/**
 * Public site URL for metadata, robots and the sitemap.
 * Vercel provides VERCEL_PROJECT_PRODUCTION_URL; on any other host set NEXT_PUBLIC_SITE_URL.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
