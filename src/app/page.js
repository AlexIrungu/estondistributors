// src/app/page.js - OPTIMIZED VERSION
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { 
  Shield, Clock, TruckIcon, Award, Users, MapPin, 
  Zap, Star, TrendingUp, Calculator, Bell, Package,
  ArrowRight, CheckCircle, BarChart3, Fuel
} from 'lucide-react';

// ✅ OPTIMIZATION 1: Lazy load heavy components with dynamic imports
// These components are client-side only since they fetch data
const PriceWidget = dynamic(() => import('@/components/PriceWidget'), {
  loading: () => (
    <div className="bg-white rounded-xl p-8 shadow-lg animate-pulse">
      <div className="h-8 bg-neutral-200 rounded mb-4"></div>
      <div className="h-24 bg-neutral-200 rounded"></div>
    </div>
  )
});

const LowStockAlert = dynamic(() => import('@/components/inventory/LowStockAlert'), {
  loading: () => null
});

// ✅ OPTIMIZATION 2: Extract static data outside component to prevent recreation
const PRODUCTS_DATA = [
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

const FEATURES_DATA = [
  {
    icon: Shield,
    title: 'Quality Assured',
    description: 'All our petroleum products meet international standards',
    color: 'blue',
  },
  {
    icon: Clock,
    title: '24/7 Service',
    description: 'Round-the-clock availability for your convenience',
    color: 'green',
  },
  {
    icon: TruckIcon,
    title: 'Fast Delivery',
    description: 'Prompt and reliable transport services',
    color: 'orange',
  },
  {
    icon: Award,
    title: 'Industry Leaders',
    description: 'Decades of experience in petroleum distribution',
    color: 'purple',
  },
  {
    icon: Users,
    title: 'Expert Team',
    description: 'Professional staff dedicated to your needs',
    color: 'pink',
  },
  {
    icon: MapPin,
    title: 'Wide Coverage',
    description: 'Serving locations across Kenya',
    color: 'cyan',
  },
];

const TOOLS_DATA = [
  {
    title: 'Price Alerts',
    description: 'Get notified when fuel prices change',
    icon: Bell,
    href: '/alerts',
    badge: 'New',
    color: 'from-amber-500 to-orange-600',
  },
  {
    title: 'Savings Calculator',
    description: 'Calculate potential fuel savings',
    icon: Calculator,
    href: '/calculator',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    title: 'Price History',
    description: 'Track historical price trends',
    icon: TrendingUp,
    href: '/prices/history',
    color: 'from-green-500 to-emerald-600',
  },
  {
    title: 'Live Inventory',
    description: 'Check real-time stock levels',
    icon: Package,
    href: '/inventory',
    badge: 'Live',
    color: 'from-purple-500 to-pink-600',
  },
];

const COLOR_CLASSES = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  orange: 'bg-orange-100 text-orange-600',
  purple: 'bg-purple-100 text-purple-600',
  pink: 'bg-pink-100 text-pink-600',
  cyan: 'bg-cyan-100 text-cyan-600',
};

// ✅ OPTIMIZATION 3: Extract reusable components
function SectionBadge({ icon: Icon, text, className = '' }) {
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${className}`}>
      <Icon className="h-4 w-4" />
      {text}
    </div>
  );
}

function SectionHeader({ badge, title, description, badgeClassName }) {
  return (
    <div className="text-center mb-12">
      {badge && <SectionBadge {...badge} className={badgeClassName} />}
      <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}

// ✅ OPTIMIZATION 4: Memoized sub-components
function HeroSection() {
  return (
    <section className="relative bg-secondary-900 text-white overflow-hidden min-h-[90vh] flex items-center">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1578932750355-5eb30ece487a?w=1920&q=80"
          alt="Fuel tanker"
          fill
          className="object-cover opacity-30"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-secondary-900/70"></div>
        
        {/* Animated Background Circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <SectionBadge 
            icon={Zap} 
            text="Kenya's Trusted Fuel Distribution Partner"
            className="mb-6 bg-white/10 backdrop-blur-md border border-white/20 text-primary-300"
          />

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-slide-up">
            Powering Kenya with
            <span className="block text-primary-400">Quality Petroleum</span>
          </h1>

          <p className="text-xl md:text-2xl mb-10 text-neutral-200 max-w-3xl mx-auto animate-slide-up delay-100">
            Reliable fuel supply and transport services for businesses across the nation. 
            Experience excellence in every delivery.
          </p>

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
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-16 md:h-24 fill-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
    </section>
  );
}

function ToolsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={{ icon: Zap, text: 'Smart Tools' }}
          badgeClassName="bg-primary-100 text-primary-700 mb-4"
          title="Everything You Need in One Place"
          description="Powerful tools to help you manage fuel costs and stay informed"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOOLS_DATA.map((tool) => {
            const Icon = tool.icon;
            return (
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
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-2">{tool.title}</h3>
                <p className="text-neutral-600 text-sm mb-4">{tool.description}</p>
                <div className="flex items-center text-primary-600 font-semibold text-sm">
                  Explore <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PriceSection() {
  return (
    <section className="py-20 bg-neutral-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-100 rounded-full blur-3xl opacity-30"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge={{ icon: TrendingUp, text: 'Live Prices' }}
          badgeClassName="bg-green-100 text-green-700 mb-4"
          title="Today's Fuel Prices"
          description="Official EPRA prices updated monthly. Real-time rates for all major locations."
        />
        
        <div className="max-w-2xl mx-auto">
          <PriceWidget location="nairobi" />
        </div>

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
  );
}

function ProductsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={{ icon: Fuel, text: 'Our Products' }}
          badgeClassName="bg-accent-100 text-accent-700 mb-4"
          title="Premium Petroleum Products"
          description="Quality fuels tailored to meet your specific needs"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRODUCTS_DATA.map((product) => (
            <div
              key={product.name}
              className="group relative bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 border-neutral-200 hover:border-primary-300"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                
                <div className="absolute top-4 left-4 w-16 h-16 bg-white rounded-xl flex items-center justify-center text-4xl shadow-lg">
                  {product.icon}
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {product.name}
                  </h3>
                </div>
              </div>

              <div className="p-6">
                <p className="text-neutral-600 mb-4">{product.description}</p>
                
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

              <div className="absolute inset-0 border-4 border-primary-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/inventory"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all"
          >
            <Package className="h-5 w-5" />
            Check Real-Time Stock Availability
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function WhyChooseUsSection() {
  return (
    <section className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-[500px] lg:h-full min-h-[400px] rounded-2xl overflow-hidden shadow-2xl order-2 lg:order-1">
            <Image
              src="https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=1200&q=80"
              alt="Fuel distribution"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
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
            <SectionBadge 
              icon={Award} 
              text="Why Choose Us"
              className="bg-primary-100 text-primary-700 mb-6"
            />
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
              Your Trusted Partner in Fuel Distribution
            </h2>
            <p className="text-lg text-neutral-600 mb-8">
              With over a decade of experience in petroleum distribution, we've built our reputation on reliability, quality, and exceptional service.
            </p>
            <div className="space-y-4">
              {[
                { icon: Shield, title: 'Certified Quality', desc: 'All products meet international quality standards and undergo rigorous testing', color: 'primary' },
                { icon: TruckIcon, title: 'Reliable Transport', desc: 'Modern fleet with GPS tracking ensuring timely and safe deliveries', color: 'accent' },
                { icon: Clock, title: '24/7 Availability', desc: 'Round-the-clock emergency support for your fuel needs', color: 'green' }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start group hover:bg-white p-4 rounded-xl transition-all">
                    <div className={`flex-shrink-0 w-14 h-14 bg-${item.color}-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-${item.color}-500 group-hover:text-white transition-all`}>
                      <Icon className={`h-7 w-7 text-${item.color}-600 group-hover:text-white`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-secondary-900 mb-1 text-lg">{item.title}</h4>
                      <p className="text-neutral-600">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="What Sets Us Apart"
          description="Comprehensive solutions backed by years of industry expertise"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES_DATA.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative bg-white rounded-2xl p-8 border-2 border-neutral-200 hover:border-primary-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${COLOR_CLASSES[feature.color]} mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
                
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-100 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative py-24 bg-secondary-900 text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?w=1920&q=80"
          alt="Contact us"
          fill
          className="object-cover opacity-10"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-secondary-900/95"></div>
      </div>

      <div className="absolute top-10 right-10 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <SectionBadge 
            icon={Zap} 
            text="Get Started Today"
            className="bg-white/10 backdrop-blur-md border border-white/20 text-primary-400 mb-6"
          />
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Experience Excellence?
          </h2>
          <p className="text-xl mb-10 text-neutral-200">
            Contact us today for competitive prices and reliable service. Our team is ready to handle all your fuel distribution needs.
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
  );
}

// ✅ OPTIMIZATION 5: Main component with sections split
export default function Home() {
  return (
    <div className="overflow-hidden">
      <LowStockAlert variant="banner" />
      <HeroSection />
      <ToolsSection />
      <PriceSection />
      <ProductsSection />
      <WhyChooseUsSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
}