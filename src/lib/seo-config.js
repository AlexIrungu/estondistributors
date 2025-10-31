// src/lib/seo-config.js
// Centralized SEO configuration using environment variables

/**
 * Get the base URL for the application
 * Handles both development and production environments
 */
export function getBaseUrl() {
  // Priority: Environment variable > Vercel URL > localhost
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  return 'http://localhost:3000';
}

/**
 * Get the app URL (for client-side usage)
 */
export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || getBaseUrl();
}

/**
 * Site-wide metadata configuration
 */
export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Eston Distributors',
  description: 'Leading fuel distributor in Kenya. Competitive prices on petrol, diesel, kerosene. Fleet management, bulk orders, and delivery across Nairobi.',
  url: getBaseUrl(),
  
  // Business Information
  business: {
    name: 'Eston Distributors',
    legalName: 'Eston Distributors Limited',
    phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+254-722-943291',
    email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || 'estonkd@gmail.com',
    address: {
      street: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || 'P.O Box 343-00500',
      city: 'Nairobi',
      region: 'Nairobi County',
      postalCode: '00500',
      country: 'KE',
    },
    coordinates: {
      latitude: '-1.286389',
      longitude: '36.817223',
    },
  },
  
  // Social Media
  social: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL,
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL,
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL,
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
  },
  
  // SEO Configuration
  seo: {
    keywords: [
      'fuel distributor Kenya',
      'diesel prices Nairobi',
      'petrol supplier Kenya',
      'bulk fuel orders',
      'kerosene supplier',
      'EPRA licensed distributor',
      'fuel transport services',
      'petroleum products Kenya',
      'diesel delivery Nairobi',
      'fleet fuel management',
    ],
    twitterHandle: '@estondistributors', // Add your actual handle
  },
  
  // Analytics
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    googleTagManagerId: process.env.NEXT_PUBLIC_GTM_ID,
  },
  
  // Verification Codes
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    bing: process.env.NEXT_PUBLIC_BING_VERIFICATION,
  },
};

/**
 * Generate Organization Schema
 */
export function generateOrganizationSchema() {
  const baseUrl = getBaseUrl();
  const { business, social } = siteConfig;
  
  // Filter out undefined social media URLs
  const socialLinks = Object.values(social).filter(Boolean);
  
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    "name": business.name,
    "legalName": business.legalName,
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "description": siteConfig.description,
    "email": business.email,
    "telephone": business.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": business.address.street,
      "addressLocality": business.address.city,
      "addressRegion": business.address.region,
      "postalCode": business.address.postalCode,
      "addressCountry": business.address.country
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": business.coordinates.latitude,
      "longitude": business.coordinates.longitude
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "telephone": business.phone,
      "email": business.email,
      "areaServed": "KE",
      "availableLanguage": ["English", "Swahili"]
    },
    ...(socialLinks.length > 0 && { "sameAs": socialLinks })
  };
}

/**
 * Generate LocalBusiness Schema
 */
export function generateLocalBusinessSchema() {
  const baseUrl = getBaseUrl();
  const { business } = siteConfig;
  
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/#business`,
    "name": business.name,
    "description": siteConfig.description,
    "url": baseUrl,
    "telephone": business.phone,
    "email": business.email,
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": business.address.street,
      "addressLocality": business.address.city,
      "addressRegion": business.address.region,
      "postalCode": business.address.postalCode,
      "addressCountry": business.address.country
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": business.coordinates.latitude,
      "longitude": business.coordinates.longitude
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "areaServed": {
      "@type": "State",
      "name": "Kenya"
    }
  };
}

/**
 * Generate default metadata for pages
 */
export function generateMetadata({
  title,
  description,
  path = '',
  image = '/og-image.jpg',
  noIndex = false,
}) {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${path}`;
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  
  return {
    title: fullTitle,
    description: description || siteConfig.description,
    keywords: siteConfig.seo.keywords,
    
    openGraph: {
      title: fullTitle,
      description: description || siteConfig.description,
      url: url,
      siteName: siteConfig.name,
      images: [
        {
          url: `${baseUrl}${image}`,
          width: 1200,
          height: 630,
          alt: fullTitle,
        }
      ],
      locale: 'en_KE',
      type: 'website',
    },
    
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: description || siteConfig.description,
      images: [`${baseUrl}${image}`],
      creator: siteConfig.seo.twitterHandle,
    },
    
    alternates: {
      canonical: url,
    },
    
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      }
    }),
  };
}

/**
 * Generate breadcrumb schema
 */
export function generateBreadcrumbSchema(breadcrumbs) {
  const baseUrl = getBaseUrl();
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${baseUrl}${item.path}`
    }))
  };
}

/**
 * Utility to inject structured data script
 */
export function StructuredData({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}