import Link from 'next/link';
import { Fuel, TruckIcon, Shield, Clock } from 'lucide-react';

export default function Home() {
  const products = [
    {
      name: 'Petrol/Gasoline',
      description: 'High-quality unleaded petrol for all vehicles',
      icon: '⛽',
    },
    {
      name: 'Super Petrol',
      description: 'Premium grade fuel for enhanced performance',
      icon: '🚗',
    },
    {
      name: 'Diesel',
      description: 'Reliable diesel fuel for heavy-duty vehicles',
      icon: '🚚',
    },
  ];

  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Quality Assured',
      description: 'All our petroleum products meet international standards',
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: '24/7 Service',
      description: 'Round-the-clock availability for your convenience',
    },
    {
      icon: <TruckIcon className="h-8 w-8" />,
      title: 'Fast Delivery',
      description: 'Prompt and reliable transport services',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary-700 via-secondary-600 to-primary-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Trusted Petroleum & Transport Partner
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-neutral-100">
              Supplying quality fuel products and reliable transport services across Kenya
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="bg-primary-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-600 transition-colors text-center"
              >
                View Products
              </Link>
              <Link
                href="/contact"
                className="bg-white text-secondary-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-neutral-100 transition-colors text-center"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-800 mb-4">
              Our Products
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              High-quality petroleum products for all your fuel needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.name}
                className="bg-neutral-50 rounded-xl p-8 text-center hover:shadow-lg transition-shadow border border-neutral-200"
              >
                <div className="text-6xl mb-4">{product.icon}</div>
                <h3 className="text-2xl font-bold text-secondary-800 mb-3">
                  {product.name}
                </h3>
                <p className="text-neutral-600 mb-6">{product.description}</p>
                <Link
                  href="/products"
                  className="text-primary-500 font-semibold hover:text-primary-600"
                >
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-800 mb-4">
              Why Choose Eston?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-8 text-center hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-secondary-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-500 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact us today for competitive prices and reliable service
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-neutral-100 transition-colors"
          >
            Contact Us Now
          </Link>
        </div>
      </section>
    </div>
  );
}