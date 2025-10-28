import { TruckIcon, Clock, Shield, MapPin, CheckCircle, Users, Gauge, Package } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function TransportPage() {
  const services = [
    {
      icon: <TruckIcon className="h-12 w-12" />,
      title: 'Bulk Fuel Delivery',
      description: 'Reliable delivery of petroleum products in any quantity to your location with our modern fleet',
      features: [
        'Modern fleet of fuel tankers (5,000 - 40,000 liters)',
        'GPS-tracked vehicles for real-time monitoring',
        'Certified and experienced drivers',
        'Safe handling procedures and protocols',
        'Flexible scheduling options',
        'Detailed delivery documentation',
      ],
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80',
    },
    {
      icon: <Clock className="h-12 w-12" />,
      title: '24/7 Emergency Service',
      description: 'Round-the-clock availability for urgent fuel delivery needs ensuring your operations never stop',
      features: [
        'Quick response time under 2 hours',
        'Dedicated emergency hotline',
        'Same-day delivery available',
        'Priority scheduling for urgent orders',
        'Night and weekend deliveries',
        'Backup supply arrangements',
      ],
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
    },
    {
      icon: <Shield className="h-12 w-12" />,
      title: 'Safe & Secure Transport',
      description: 'Industry-leading safety standards and compliance for fuel transportation across all routes',
      features: [
        'Fully licensed and comprehensively insured',
        'Regular vehicle maintenance and inspections',
        'Full safety compliance with regulations',
        'Hazmat certified drivers and equipment',
        'Advanced safety monitoring systems',
        'Environmental protection measures',
      ],
      image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&q=80',
    },
  ];

  const coverage = [
    { name: 'Nairobi & Surrounding Areas', available: true },
    { name: 'Central Kenya', available: true },
    { name: 'Rift Valley Region', available: true },
    { name: 'Western Kenya', available: true },
    { name: 'Coast Region', available: true },
    { name: 'Eastern Kenya', available: true },
  ];

  const stats = [
    { value: '50+', label: 'Delivery Vehicles', icon: <TruckIcon className="h-6 w-6" /> },
    { value: '1000+', label: 'Monthly Deliveries', icon: <Package className="h-6 w-6" /> },
    { value: '98%', label: 'On-Time Rate', icon: <CheckCircle className="h-6 w-6" /> },
    { value: '150+', label: 'Trained Drivers', icon: <Users className="h-6 w-6" /> },
  ];

  const benefits = [
    {
      icon: <Gauge className="h-8 w-8" />,
      title: 'Competitive Pricing',
      description: 'Volume discounts and transparent pricing with no hidden fees',
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: 'Flexible Scheduling',
      description: 'Delivery times that work with your operational schedule',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Fully Insured',
      description: 'Complete insurance coverage for peace of mind',
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: 'Quality Guarantee',
      description: 'Assured product quality from storage to delivery',
    },
  ];

  return (
    <div>
      {/* Hero Section with Image */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1920&q=80"
          alt="Fuel transport services"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-accent-900/90 via-accent-800/80 to-accent-900/70"></div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Transport & Logistics
          </h1>
          <p className="text-xl md:text-2xl text-neutral-100 max-w-3xl mx-auto mb-8 leading-relaxed">
            Professional fuel delivery services ensuring your operations never run dry
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-600 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Request Delivery
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <a
              href="tel:+254XXXXXXXXX"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all duration-300"
            >
              <Clock className="h-5 w-5" />
              24/7 Hotline
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-accent-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-accent-600 text-white rounded-xl mb-3">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-bold text-primary-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-neutral-200 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-800 mb-4">
              Our Transport Services
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Comprehensive logistics solutions for all your fuel delivery needs
            </p>
          </div>

          <div className="space-y-16">
            {services.map((service, index) => (
              <div
                key={service.title}
                className={`flex flex-col ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } gap-8 items-center bg-neutral-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden`}
              >
                {/* Content Section */}
                <div className="flex-1 p-8 md:p-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-100 text-accent-600 rounded-xl mb-6 shadow-md">
                    {service.icon}
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-bold text-secondary-800 mb-4">
                    {service.title}
                  </h3>
                  
                  <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="mb-6">
                    <h4 className="text-xl font-semibold text-secondary-700 mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-accent-500 rounded-full"></span>
                      Service Features
                    </h4>
                    <ul className="space-y-3">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 group">
                          <span className="flex-shrink-0 w-5 h-5 bg-accent-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5 group-hover:scale-110 transition-transform">
                            ✓
                          </span>
                          <span className="text-neutral-700 leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Image Section */}
                <div className="flex-1 w-full h-full relative">
                  <div className="relative h-80 md:h-[500px] w-full overflow-hidden group">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-accent-900/30 to-transparent"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-800 mb-4">
              Why Choose Our Transport Services
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Industry-leading service with customer satisfaction at the core
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-accent-100 text-accent-600 rounded-xl flex items-center justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-secondary-800 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-neutral-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-800 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-neutral-600">
              Simple, streamlined process to get your fuel delivered
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { 
                step: '1', 
                title: 'Request Quote', 
                desc: 'Contact us with your fuel requirements and delivery location',
                icon: <Package className="h-6 w-6" />
              },
              { 
                step: '2', 
                title: 'Confirm Order', 
                desc: 'Review pricing, terms, and approve the quotation',
                icon: <CheckCircle className="h-6 w-6" />
              },
              { 
                step: '3', 
                title: 'Schedule Delivery', 
                desc: 'Choose your preferred delivery date and time slot',
                icon: <Clock className="h-6 w-6" />
              },
              { 
                step: '4', 
                title: 'Receive Fuel', 
                desc: 'Our certified team delivers safely to your location',
                icon: <TruckIcon className="h-6 w-6" />
              },
            ].map((item, index) => (
              <div key={item.step} className="relative">
                <div className="bg-neutral-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="flex items-center justify-center w-16 h-16 bg-primary-500 text-white rounded-xl text-2xl font-bold mb-4 mx-auto shadow-lg">
                    {item.step}
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 bg-accent-100 text-accent-600 rounded-lg mx-auto mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-800 mb-3 text-center">
                    {item.title}
                  </h3>
                  <p className="text-neutral-600 text-center leading-relaxed">{item.desc}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-primary-200"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Area */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-100 text-accent-600 rounded-2xl mb-6 shadow-md">
                <MapPin className="h-10 w-10" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-secondary-800 mb-4">
                Coverage Area
              </h2>
              <p className="text-lg text-neutral-600">
                We deliver across Kenya to serve your business needs wherever you are
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {coverage.map((area) => (
                <div
                  key={area.name}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <span className="font-semibold text-secondary-800 group-hover:text-accent-600 transition-colors">
                      {area.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-primary-50 border-2 border-primary-200 rounded-2xl p-8 text-center">
              <p className="text-secondary-800 text-lg font-medium mb-2">
                Don't see your area listed?
              </p>
              <p className="text-neutral-600 mb-4">
                Contact us to discuss custom delivery options and expanded coverage areas
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
              >
                Get in Touch
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Showcase Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80"
                alt="Modern fuel delivery fleet"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-secondary-800 mb-6">
                Modern Fleet & Equipment
              </h2>
              <p className="text-lg text-neutral-700 mb-6 leading-relaxed">
                Our state-of-the-art fleet of tankers and specialized equipment ensures safe, efficient, and reliable fuel delivery to your location. Every vehicle is maintained to the highest standards and equipped with advanced safety systems.
              </p>
              <p className="text-lg text-neutral-700 mb-8 leading-relaxed">
                With real-time GPS tracking, you can monitor your delivery from dispatch to arrival, giving you complete visibility and peace of mind throughout the process.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-accent-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    ✓
                  </span>
                  <span className="text-neutral-700">Fleet capacity ranging from 5,000 to 40,000 liters</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-accent-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    ✓
                  </span>
                  <span className="text-neutral-700">Real-time GPS tracking and route optimization</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-accent-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    ✓
                  </span>
                  <span className="text-neutral-700">Regular maintenance and safety inspections</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-accent-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    ✓
                  </span>
                  <span className="text-neutral-700">Hazmat certified drivers with extensive training</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1920&q=80"
          alt="Contact us for delivery"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-secondary-900/85"></div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Schedule a Delivery?
          </h2>
          <p className="text-xl text-neutral-200 max-w-3xl mx-auto mb-10 leading-relaxed">
            Get in touch with our logistics team for competitive pricing, flexible scheduling, and reliable service that keeps your operations running smoothly
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary-500 text-white px-10 py-5 rounded-xl text-lg font-semibold hover:bg-primary-600 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Request a Quote
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <a
              href="tel:+254XXXXXXXXX"
              className="inline-flex items-center gap-2 bg-accent-500 text-white px-10 py-5 rounded-xl text-lg font-semibold hover:bg-accent-600 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              <Clock className="h-5 w-5" />
              Call 24/7 Hotline
            </a>
          </div>
        </div>
      </section>

      {/* SVG Wave Divider */}
      <div className="bg-white">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="#f97316"/>
        </svg>
      </div>
    </div>
  );
}