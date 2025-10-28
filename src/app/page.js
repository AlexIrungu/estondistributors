import Link from 'next/link';
import Image from 'next/image';
import { Shield, Clock, TruckIcon, Award, Users, MapPin } from 'lucide-react';

export default function Home() {
  const products = [
    {
      name: 'Petrol/Gasoline',
      description: 'High-quality unleaded petrol for all vehicles',
      image: 'https://images.unsplash.com/photo-1545262722-c8fbe9012f57?w=800&q=80',
      icon: '⛽',
    },
    {
      name: 'Super Petrol',
      description: 'Premium grade fuel for enhanced performance',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      icon: '🚗',
    },
    {
      name: 'Diesel',
      description: 'Reliable diesel fuel for heavy-duty vehicles',
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80',
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
    {
      icon: <Award className="h-8 w-8" />,
      title: 'Industry Leaders',
      description: 'Decades of experience in petroleum distribution',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Expert Team',
      description: 'Professional staff dedicated to your needs',
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: 'Wide Coverage',
      description: 'Serving locations across Kenya',
    },
  ];

  const stats = [
    { value: '10+', label: 'Years Experience' },
    { value: '500+', label: 'Happy Clients' },
    { value: '24/7', label: 'Support Available' },
    { value: '100%', label: 'Quality Guaranteed' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-secondary-900 text-white overflow-hidden">
        {/* Hero Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1578932750355-5eb30ece487a?w=1920&q=80"
            alt="Fuel tanker"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-secondary-900/60"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-block mb-4 px-4 py-2 bg-primary-500/20 border border-primary-500/30 rounded-full">
              <span className="text-primary-400 text-sm font-semibold">Trusted Fuel Distribution Partner</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Powering Kenya with Quality Petroleum Products
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-neutral-200">
              Reliable fuel supply and transport services for businesses across the nation
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="bg-primary-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-600 transition-all duration-300 text-center shadow-lg hover:shadow-xl hover:scale-105"
              >
                View Products
              </Link>
              <Link
                href="/contact"
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/20 transition-all duration-300 text-center border border-white/20"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 md:h-16 fill-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary-500 mb-2">
                  {stat.value}
                </div>
                <div className="text-neutral-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-secondary-900 mb-4">
              Our Products
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Premium petroleum products tailored to meet your specific needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.name}
                className="group bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-neutral-200"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-5xl">
                    {product.icon}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-secondary-900 mb-3">
                    {product.name}
                  </h3>
                  <p className="text-neutral-600 mb-6">{product.description}</p>
                  <Link
                    href="/products"
                    className="inline-flex items-center text-primary-500 font-semibold hover:text-primary-600 transition-colors"
                  >
                    Learn More 
                    <svg className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section with Image */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 lg:h-full min-h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=1200&q=80"
                alt="Fuel distribution"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-secondary-900 mb-6">
                Why Choose Eston?
              </h2>
              <p className="text-lg text-neutral-600 mb-8">
                With over a decade of experience in petroleum distribution, we've built our reputation on reliability, quality, and exceptional service. Our commitment to excellence has made us a trusted partner for businesses across Kenya.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                    <Shield className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary-900 mb-1">Certified Quality</h4>
                    <p className="text-neutral-600">All products meet international quality standards</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                    <TruckIcon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary-900 mb-1">Reliable Transport</h4>
                    <p className="text-neutral-600">Modern fleet ensuring timely deliveries</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                    <Clock className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary-900 mb-1">24/7 Availability</h4>
                    <p className="text-neutral-600">Always ready to serve your fuel needs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-8 hover:shadow-lg transition-all duration-300 border border-neutral-200"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 text-primary-600 rounded-xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-secondary-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?w=1920&q=80"
            alt="Contact us"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-neutral-200">
            Contact us today for competitive prices and reliable service. Our team is ready to handle all your fuel distribution needs.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-primary-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Contact Us Now
          </Link>
        </div>
      </section>
    </div>
  );
}