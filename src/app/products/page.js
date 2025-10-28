import { Fuel, Droplet, Zap } from 'lucide-react';
import Link from 'next/link';

export default function ProductsPage() {
  const products = [
    {
      name: 'Petrol (Gasoline)',
      icon: <Fuel className="h-12 w-12" />,
      description: 'Premium quality unleaded petrol suitable for all gasoline engines.',
      features: [
        'Octane rating: 91-95',
        'Low sulfur content',
        'Enhanced engine performance',
        'Reduces carbon emissions',
      ],
      applications: ['Cars', 'Motorcycles', 'Small generators'],
    },
    {
      name: 'Super Petrol',
      icon: <Zap className="h-12 w-12" />,
      description: 'High-performance premium grade fuel for superior engine efficiency.',
      features: [
        'Higher octane rating: 95+',
        'Advanced engine cleaning',
        'Maximizes power output',
        'Improved fuel economy',
      ],
      applications: ['High-performance vehicles', 'Sports cars', 'Luxury vehicles'],
    },
    {
      name: 'Diesel',
      icon: <Droplet className="h-12 w-12" />,
      description: 'Reliable diesel fuel for heavy-duty vehicles and industrial equipment.',
      features: [
        'Low sulfur diesel',
        'High cetane number',
        'Excellent lubricity',
        'Cold weather performance',
      ],
      applications: ['Trucks', 'Buses', 'Construction equipment', 'Generators'],
    },
  ];

  return (
    <div>
      {/* Header Section */}
      <section className="bg-secondary-700 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
          <p className="text-xl text-neutral-200 max-w-3xl">
            Quality petroleum products meeting international standards for all your fuel needs
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {products.map((product, index) => (
              <div
                key={product.name}
                className={`flex flex-col ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } gap-8 items-center bg-neutral-50 rounded-2xl p-8 md:p-12`}
              >
                <div className="flex-1">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 text-primary-600 rounded-full mb-6">
                    {product.icon}
                  </div>
                  <h2 className="text-3xl font-bold text-secondary-800 mb-4">
                    {product.name}
                  </h2>
                  <p className="text-lg text-neutral-700 mb-6">
                    {product.description}
                  </p>

                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-secondary-700 mb-3">
                      Key Features:
                    </h3>
                    <ul className="space-y-2">
                      {product.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <span className="text-primary-500 mt-1">✓</span>
                          <span className="text-neutral-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-secondary-700 mb-3">
                      Suitable For:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.applications.map((app) => (
                        <span
                          key={app}
                          className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm"
                        >
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <div className="bg-gradient-to-br from-primary-400 to-secondary-600 rounded-xl h-64 md:h-96 flex items-center justify-center text-white text-6xl">
                    {product.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Need Bulk Orders?
          </h2>
          <p className="text-xl mb-8 text-neutral-200 max-w-2xl mx-auto">
            We offer competitive pricing for bulk purchases and regular supply contracts
          </p>
          <Link
            href="/contact"
            className="inline-block bg-primary-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-600 transition-colors"
          >
            Request a Quote
          </Link>
        </div>
      </section>
    </div>
  );
}