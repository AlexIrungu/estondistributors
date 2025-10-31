// src/app/robots.js
// This tells search engines which pages to crawl and which to avoid

export default function robots() {
  const baseUrl = 'https://estondistributors.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',           // Don't crawl API routes
          '/dashboard/',     // Don't crawl user dashboards
          '/dashboard/*',
          '/admin/',         // Don't crawl admin pages
          '/admin/*',
          '/login',          // Don't crawl auth pages
          '/register',
          '/forgot-password',
          '/reset-password',
          '/_next/',         // Don't crawl Next.js internals
          '/alerts/manage',  // Don't crawl user-specific alert pages
          '/alerts/test',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/dashboard/*',
          '/admin/',
          '/admin/*',
        ],
        crawlDelay: 0,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/dashboard/*',
          '/admin/',
          '/admin/*',
        ],
        crawlDelay: 1,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

// This will automatically generate robots.txt at:
// https://estondistributors.vercel.app/robots.txt