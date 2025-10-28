import { Fuel, Droplet, Zap, Shield, Award, Leaf, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';

export default function ProductsPage() {
  const products = [
    {
      name: 'Petrol (Gasoline)',
      icon: <Fuel className="h-12 w-12" />,
      description: 'Premium quality unleaded petrol suitable for all gasoline engines. Refined to meet international standards for optimal performance and reliability.',
      features: [
        'Octane rating: 91-95 for smooth combustion',
        'Ultra-low sulfur content for cleaner emissions',
        'Enhanced with cleaning additives for engine protection',
        'Reduces carbon deposits and improves fuel efficiency',
        'Meets Euro 5 emissions standards',
        'Consistent quality across all our stations',
      ],
      applications: ['Passenger Cars', 'Motorcycles', 'Small Generators', 'Light Commercial Vehicles'],
      image: 'https://images.unsplash.com/photo-1545262810-77515befe149?w=800&q=80',
    },
    {
      name: 'Super Petrol',
      icon: <Zap className="h-12 w-12" />,
      description: 'High-performance premium grade fuel engineered for superior engine efficiency and maximum power output in high-performance vehicles.',
      features: [
        'Higher octane rating: 95+ for optimal performance',
        'Advanced detergent system for engine cleaning',
        'Maximizes horsepower and torque output',
        'Improved fuel economy up to 5%',
        'Prevents engine knocking and pre-ignition',
        'Ideal for turbocharged and high-compression engines',
      ],
      applications: ['High-Performance Vehicles', 'Sports Cars', 'Luxury Vehicles', 'Premium SUVs'],
      image: 'https://images.unsplash.com/photo-1485463611174-f302f6a5c1c9?w=800&q=80',
    },
    {
      name: 'Diesel',
      icon: <Droplet className="h-12 w-12" />,
      description: 'Reliable diesel fuel formulated for heavy-duty vehicles and industrial equipment. Engineered for durability, efficiency, and cold weather performance.',
      features: [
        'Ultra-low sulfur diesel (ULSD) specification',
        'High cetane number for quick, efficient ignition',
        'Superior lubricity protects fuel injection systems',
        'Excellent cold weather performance down to -20°C',
        'Reduces particulate matter emissions',
        'Extended engine life and reduced maintenance costs',
      ],
      applications: ['Heavy-Duty Trucks', 'Buses', 'Construction Equipment', 'Industrial Generators', 'Marine Vessels', 'Agricultural Machinery'],
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80',
    },
  ];

  const qualityFeatures = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Quality Assured',
      description: 'All products meet international standards and undergo rigorous testing',
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: 'Certified Excellence',
      description: 'ISO certified facilities with regular quality audits',
    },
    {
      icon: <Leaf className="h-8 w-8" />,
      title: 'Eco-Friendly',
      description: 'Low sulfur formulations for reduced environmental impact',
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: '24/7 Availability',
      description: 'Reliable supply chain ensures product availability around the clock',
    },
  ];

  const stats = [
    { value: '50M+', label: 'Liters Supplied Monthly' },
    { value: '500+', label: 'Business Partners' },
    { value: '99.8%', label: 'Quality Compliance' },
    { value: '24/7', label: 'Customer Support' },
  ];

  return (
    <div>
      {/* Hero Section with Image */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1628745277861-2ec8da33a3ab?w=1920&q=80"
          alt="Fuel products"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/90 via-secondary-800/80 to-secondary-900/70"></div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in">
            Premium Fuel Products
          </h1>
          <p className="text-xl md:text-2xl text-neutral-100 max-w-3xl mx-auto mb-8 leading-relaxed">
            Quality petroleum products meeting international standards for all your fuel needs
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-600 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Get a Quote
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              href="#products"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all duration-300"
            >
              View Products
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-neutral-300 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Features */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-800 mb-4">
              Why Choose Our Products
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              We maintain the highest standards in fuel quality and service delivery
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {qualityFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-secondary-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="products" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-800 mb-4">
              Our Product Range
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Comprehensive fuel solutions for every vehicle and application
            </p>
          </div>
          
          <div className="space-y-16">
            {products.map((product, index) => (
              <ProductCard key={product.name} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* About Our Quality Section */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1585992441919-d2d1be6b5e8f?w=800&q=80"
                alt="Quality control"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-secondary-800 mb-6">
                Committed to Quality & Safety
              </h2>
              <p className="text-lg text-neutral-700 mb-6 leading-relaxed">
                Our state-of-the-art facilities and rigorous quality control processes ensure that every liter of fuel meets the highest industry standards. We invest in continuous testing and quality assurance to deliver products you can trust.
              </p>
              <p className="text-lg text-neutral-700 mb-8 leading-relaxed">
                From refinery to pump, we maintain a complete quality assurance chain, ensuring consistency, purity, and performance in every product we supply.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    ✓
                  </span>
                  <span className="text-neutral-700">ISO 9001:2015 certified quality management system</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    ✓
                  </span>
                  <span className="text-neutral-700">Regular third-party audits and testing</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    ✓
                  </span>
                  <span className="text-neutral-700">Advanced laboratory testing at every stage</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80"
          alt="Contact us"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-secondary-900/85"></div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Need Bulk Orders or Regular Supply?
          </h2>
          <p className="text-xl text-neutral-200 max-w-3xl mx-auto mb-10 leading-relaxed">
            We offer competitive pricing for bulk purchases, flexible payment terms, and reliable supply contracts tailored to your business needs
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary-500 text-white px-10 py-5 rounded-xl text-lg font-semibold hover:bg-primary-600 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Request a Quote
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              href="/transport"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 px-10 py-5 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all duration-300"
            >
              View Transport Options
            </Link>
          </div>
        </div>
      </section>

      {/* SVG Wave Divider */}
      <div className="bg-white">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="#1a365d"/>
        </svg>
      </div>
    </div>
  );
}