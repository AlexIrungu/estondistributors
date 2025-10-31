// src/app/manifest.js
// Progressive Web App manifest for mobile SEO and app-like experience

export default function manifest() {
  return {
    name: 'Eston Distributors - Fuel Distribution Kenya',
    short_name: 'Eston Fuel',
    description: 'Leading fuel distributor in Kenya. Real-time prices, bulk orders, and reliable delivery.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#e68a00',
    orientation: 'portrait-primary',
    scope: '/',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
    categories: ['business', 'utilities', 'productivity'],
    screenshots: [
      {
        src: '/screenshot-mobile.png',
        sizes: '540x720',
        type: 'image/png',
        form_factor: 'narrow',
      },
      {
        src: '/screenshot-desktop.png',
        sizes: '1920x1080',
        type: 'image/png',
        form_factor: 'wide',
      },
    ],
  };
}

// Note: You'll need to create these icon files:
// - /public/icon-192x192.png
// - /public/icon-512x512.png
// - /public/screenshot-mobile.png (optional)
// - /public/screenshot-desktop.png (optional)