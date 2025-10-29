import Link from 'next/link';
import Image from 'next/image';
import { 
  Shield, Clock, TruckIcon, Award, Users, MapPin, 
  Zap, Star, TrendingUp, Calculator, Bell, Package,
  ArrowRight, CheckCircle, BarChart3, Fuel
} from 'lucide-react';
import PriceWidget from '@/components/PriceWidget';
import LowStockAlert from '@/components/inventory/LowStockAlert';

export default function Home() {
  const products = [
    {
      name: 'Petrol/Gasoline',
      description: 'High-quality unleaded petrol for all vehicles',
      image: 'https://images.unsplash.com/photo-1545262810-77515befe149?w=800&q=80',
      icon: '⛽',
      specs: ['RON 95', 'Premium Grade', 'Clean Burn'],
    },
    {
      name: 'Super Petrol',
      description: 'Premium grade fuel for enhanced performance',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      icon: '🚗',
      specs: ['RON 98', 'High Performance', 'Engine Protection'],
    },
    {
      name: 'Diesel',
      description: 'Reliable diesel fuel for heavy-duty vehicles',
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80',
      icon: '🚚',
      specs: ['Ultra Low Sulfur', 'High Cetane', 'Fuel Efficient'],
    },
  ];

  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Quality Assured',
      description: 'All our petroleum products meet international standards',
      color: 'blue',
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: '24/7 Service',
      description: 'Round-the-clock availability for your convenience',
      color: 'green',
    },
    {
      icon: <TruckIcon className="h-8 w-8" />,
      title: 'Fast Delivery',
      description: 'Prompt and reliable transport services',
      color: 'orange',
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: 'Industry Leaders',
      description: 'Decades of experience in petroleum distribution',
      color: 'purple',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Expert Team',
      description: 'Professional staff dedicated to your needs',
      color: 'pink',
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: 'Wide Coverage',
      description: 'Serving locations across Kenya',
      color: 'cyan',
    },
  ];

  const stats = [
    { label: 'Years Experience', value: '10+', icon: <Award className="h-6 w-6" /> },
    { label: 'Happy Clients', value: '500+', icon: <Users className="h-6 w-6" /> },
    { label: 'Daily Deliveries', value: '50+', icon: <TruckIcon className="h-6 w-6" /> },
    { label: 'Locations Served', value: '20+', icon: <MapPin className="h-6 w-6" /> },
  ];

  const tools = [
    {
      title: 'Price Alerts',
      description: 'Get notified when fuel prices change',
      icon: <Bell className="h-8 w-8" />,
      href: '/alerts',
      badge: 'New',
      color: 'from-amber-500 to-orange-600',
    },
    {
      title: 'Savings Calculator',
      description: 'Calculate potential fuel savings',
      icon: <Calculator className="h-8 w-8" />,
      href: '/calculator',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      title: 'Price History',
      description: 'Track historical price trends',
      icon: <TrendingUp className="h-8 w-8" />,
      href: '/prices/history',
      color: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Live Inventory',
      description: 'Check real-time stock levels',
      icon: <Package className="h-8 w-8" />,
      href: '/inventory',
      badge: 'Live',
      color: 'from-purple-500 to-pink-600',
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      orange: 'bg-orange-100 text-orange-600',
      purple: 'bg-purple-100 text-purple-600',
      pink: 'bg-pink-100 text-pink-600',
      cyan: 'bg-cyan-100 text-cyan-600',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="overflow-hidden">
      {/* Low Stock Alert Banner */}
      <LowStockAlert variant="banner" />

      {/* Hero Section with Parallax Effect */}
      <section className="relative bg-secondary-900 text-white overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1578932750355-5eb30ece487a?w=1920&q=80"
            alt="Fuel tanker"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-secondary-900/90 via-secondary-900/80 to-primary-900/70"></div>
          
          {/* Animated Background Circles */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full animate-fade-in">
              <Zap className="h-4 w-4 text-primary-400" />
              <span className="text-primary-300 text-sm font-semibold">Kenya's Trusted Fuel Distribution Partner</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-slide-up">
              Powering Kenya with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
                Quality Petroleum
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-10 text-neutral-200 max-w-3xl mx-auto animate-slide-up delay-100">
              Reliable fuel supply and transport services for businesses across the nation. Experience excellence in every delivery.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up delay-200">
              <Link
                href="/products"
                className="group relative inline-flex items-center justify-center gap-2 bg-primary-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-600 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-primary-500/50 hover:scale-105"
              >
                View Products
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all duration-300 border-2 border-white/20 hover:border-white/40"
              >
                Get a Quote
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Stats Row */}
            {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <div className="flex items-center justify-center mb-2 text-primary-400">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-neutral-300">{stat.label}</div>
                </div>
              ))}
            </div> */}
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 md:h-24 fill-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* Interactive Tools Section - NEW */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
              <Zap className="h-4 w-4" />
              Smart Tools
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Powerful tools to help you manage fuel costs and stay informed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {tools.map((tool, index) => (
              <Link
                key={tool.title}
                href={tool.href}
                className="group relative bg-white rounded-2xl p-6 border-2 border-neutral-200 hover:border-primary-300 transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                {tool.badge && (
                  <div className="absolute top-4 right-4 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                    {tool.badge}
                  </div>
                )}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${tool.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {tool.icon}
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-2">{tool.title}</h3>
                <p className="text-neutral-600 text-sm mb-4">{tool.description}</p>
                <div className="flex items-center text-primary-600 font-semibold text-sm">
                  Explore <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Price Widget Section with Enhanced Design */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 via-white to-primary-50 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-100 rounded-full blur-3xl opacity-30"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
              <TrendingUp className="h-4 w-4" />
              Live Prices
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
              Today's Fuel Prices
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Official EPRA prices updated monthly. Real-time rates for all major locations.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <PriceWidget location="nairobi" />
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              href="/prices/history"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-neutral-200 rounded-xl font-semibold text-secondary-700 hover:border-primary-300 hover:bg-primary-50 transition-all"
            >
              <BarChart3 className="h-5 w-5" />
              View Price History
            </Link>
            <Link
              href="/alerts"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-all shadow-lg hover:shadow-xl"
            >
              <Bell className="h-5 w-5" />
              Set Price Alerts
            </Link>
          </div>
        </div>
      </section>

      {/* Products Section with Enhanced Cards */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 text-accent-700 rounded-full text-sm font-semibold mb-4">
              <Fuel className="h-4 w-4" />
              Our Products
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
              Premium Petroleum Products
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Quality fuels tailored to meet your specific needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <div
                key={product.name}
                className="group relative bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 border-neutral-200 hover:border-primary-300"
              >
                {/* Product Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  
                  {/* Icon Badge */}
                  <div className="absolute top-4 left-4 w-16 h-16 bg-white rounded-xl flex items-center justify-center text-4xl shadow-lg">
                    {product.icon}
                  </div>

                  {/* Product Name on Image */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {product.name}
                    </h3>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-6">
                  <p className="text-neutral-600 mb-4">{product.description}</p>
                  
                  {/* Specs */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {product.specs.map((spec) => (
                      <span
                        key={spec}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold"
                      >
                        <CheckCircle className="h-3 w-3" />
                        {spec}
                      </span>
                    ))}
                  </div>

                  <Link
                    href="/products"
                    className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors group-hover:gap-2 gap-1"
                  >
                    Learn More 
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 border-4 border-primary-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
            ))}
          </div>

          {/* Inventory Link */}
          <div className="text-center mt-12">
            <Link
              href="/inventory"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all"
            >
              <Package className="h-5 w-5" />
              Check Real-Time Stock Availability
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section with Image */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] lg:h-full min-h-[400px] rounded-2xl overflow-hidden shadow-2xl order-2 lg:order-1">
              <Image
                src="https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=1200&q=80"
                alt="Fuel distribution"
                fill
                className="object-cover"
              />
              {/* Overlay Badge */}
              <div className="absolute top-6 left-6 bg-white rounded-xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Star className="h-6 w-6 text-green-600 fill-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-secondary-900">4.9/5</div>
                    <div className="text-xs text-neutral-600">Customer Rating</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-6">
                <Award className="h-4 w-4" />
                Why Choose Us
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
                Your Trusted Partner in Fuel Distribution
              </h2>
              <p className="text-lg text-neutral-600 mb-8">
                With over a decade of experience in petroleum distribution, we've built our reputation on reliability, quality, and exceptional service. Our commitment to excellence has made us a trusted partner for businesses across Kenya.
              </p>
              <div className="space-y-4">
                <div className="flex items-start group hover:bg-white p-4 rounded-xl transition-all">
                  <div className="flex-shrink-0 w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-primary-500 group-hover:text-white transition-all">
                    <Shield className="h-7 w-7 text-primary-600 group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary-900 mb-1 text-lg">Certified Quality</h4>
                    <p className="text-neutral-600">All products meet international quality standards and undergo rigorous testing</p>
                  </div>
                </div>
                <div className="flex items-start group hover:bg-white p-4 rounded-xl transition-all">
                  <div className="flex-shrink-0 w-14 h-14 bg-accent-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-accent-500 group-hover:text-white transition-all">
                    <TruckIcon className="h-7 w-7 text-accent-600 group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary-900 mb-1 text-lg">Reliable Transport</h4>
                    <p className="text-neutral-600">Modern fleet with GPS tracking ensuring timely and safe deliveries</p>
                  </div>
                </div>
                <div className="flex items-start group hover:bg-white p-4 rounded-xl transition-all">
                  <div className="flex-shrink-0 w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-green-500 group-hover:text-white transition-all">
                    <Clock className="h-7 w-7 text-green-600 group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary-900 mb-1 text-lg">24/7 Availability</h4>
                    <p className="text-neutral-600">Round-the-clock emergency support for your fuel needs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid with Enhanced Design */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
              What Sets Us Apart
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Comprehensive solutions backed by years of industry expertise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group relative bg-white rounded-2xl p-8 border-2 border-neutral-200 hover:border-primary-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${getColorClasses(feature.color)} mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
                
                {/* Decorative Element */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-100 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?w=1920&q=80"
            alt="Contact us"
            fill
            className="object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/95 to-primary-900/95"></div>
        </div>

        {/* Animated Circles */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm font-semibold mb-6">
              <Zap className="h-4 w-4 text-primary-400" />
              Get Started Today
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Ready to Experience Excellence?
            </h2>
            <p className="text-xl mb-10 text-neutral-200">
              Contact us today for competitive prices and reliable service. Our team is ready to handle all your fuel distribution needs with professionalism and care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 bg-white text-secondary-900 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-neutral-100 transition-all duration-300 shadow-2xl hover:scale-105"
              >
                Contact Us Now
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all duration-300 border-2 border-white/20"
              >
                View Products
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 pt-8 border-t border-white/20">
              <p className="text-sm text-neutral-300 mb-4">Trusted by leading businesses across Kenya</p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div className="text-2xl font-bold">500+ Clients</div>
                <div className="w-px h-8 bg-white/30"></div>
                <div className="text-2xl font-bold">10+ Years</div>
                <div className="w-px h-8 bg-white/30"></div>
                <div className="text-2xl font-bold">24/7 Support</div>
              </div>
            </div>
             </div>
        </div>
      </section>
    </div>
  );
}