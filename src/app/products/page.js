// ✅ PRODUCTS PAGE - Server Component with metadata
import ProductsPageClient from './ProductsPageClient';

// ✅ SEO METADATA (Server Component only)
export const metadata = {
  title: 'Fuel Products - Petrol, Diesel, Kerosene & More',
  description: 'Browse our complete range of petroleum products. Competitive prices on premium petrol (PMS), diesel (AGO), and kerosene (IK). EPRA licensed with bulk discounts available. Real-time stock levels.',
  keywords: [
    'PMS petrol Kenya',
    'AGO diesel supplier',
    'kerosene IK prices',
    'premium petrol Nairobi',
    'ultra low sulfur diesel',
    'bulk fuel purchase',
    'petroleum products Kenya',
    'fuel specifications Kenya',
    'diesel for trucks Kenya',
    'kerosene for cooking'
  ],
  openGraph: {
    title: 'Fuel Products | Eston Distributors Kenya',
    description: 'Premium petrol, diesel, and kerosene at competitive prices. Real-time stock availability and bulk discounts.',
    url: 'https://estondistributors.vercel.app/products',
    images: [
      {
        url: '/og-products.jpg',
        width: 1200,
        height: 630,
        alt: 'Eston Distributors Fuel Products'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quality Fuel Products - Eston Distributors',
    description: 'Premium petrol, diesel, and kerosene with real-time pricing and stock availability.',
  },
  alternates: {
    canonical: 'https://estondistributors.vercel.app/products',
  },
};

// ✅ PRODUCT SCHEMA (can stay here as it's just data)
export function generateProductSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "Product",
        "position": 1,
        "name": "Premium Petrol (PMS)",
        "description": "High-quality unleaded petrol suitable for all gasoline engines. Octane rating 91-95, ultra-low sulfur content.",
        "category": "Petroleum Products",
        "brand": {
          "@type": "Brand",
          "name": "Eston Distributors"
        },
        "offers": {
          "@type": "Offer",
          "availability": "https://schema.org/InStock",
          "priceCurrency": "KES",
          "price": "195.00",
          "priceValidUntil": "2025-11-30",
          "url": "https://estondistributors.vercel.app/products#pms",
          "seller": {
            "@type": "Organization",
            "name": "Eston Distributors"
          }
        },
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "Octane Rating",
            "value": "91-95"
          },
          {
            "@type": "PropertyValue",
            "name": "Sulfur Content",
            "value": "Ultra-low"
          }
        ]
      },
      {
        "@type": "Product",
        "position": 2,
        "name": "Diesel (AGO)",
        "description": "Reliable diesel fuel for heavy-duty vehicles and industrial equipment. Ultra-low sulfur diesel with high cetane number.",
        "category": "Petroleum Products",
        "brand": {
          "@type": "Brand",
          "name": "Eston Distributors"
        },
        "offers": {
          "@type": "Offer",
          "availability": "https://schema.org/InStock",
          "priceCurrency": "KES",
          "price": "180.00",
          "priceValidUntil": "2025-11-30",
          "url": "https://estondistributors.vercel.app/products#ago",
          "seller": {
            "@type": "Organization",
            "name": "Eston Distributors"
          }
        },
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "Type",
            "value": "Ultra-low sulfur diesel (ULSD)"
          },
          {
            "@type": "PropertyValue",
            "name": "Cetane Number",
            "value": "High"
          }
        ]
      },
      {
        "@type": "Product",
        "position": 3,
        "name": "Kerosene (IK)",
        "description": "Clean-burning illuminating kerosene for lighting, heating, and cooking. Low smoke and odor.",
        "category": "Petroleum Products",
        "brand": {
          "@type": "Brand",
          "name": "Eston Distributors"
        },
        "offers": {
          "@type": "Offer",
          "availability": "https://schema.org/InStock",
          "priceCurrency": "KES",
          "price": "165.00",
          "priceValidUntil": "2025-11-30",
          "url": "https://estondistributors.vercel.app/products#ik",
          "seller": {
            "@type": "Organization",
            "name": "Eston Distributors"
          }
        },
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "Purity",
            "value": "High"
          },
          {
            "@type": "PropertyValue",
            "name": "Usage",
            "value": "Lighting, Heating, Cooking"
          }
        ]
      }
    ]
  };
}

// ✅ Server Component - passes data to Client Component
export default function ProductsPage() {
  const productSchema = generateProductSchema();
  
  return (
    <>
      {/* ✅ Product Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      
      {/* ✅ Client Component handles all interactivity */}
      <ProductsPageClient />
    </>
  );
}