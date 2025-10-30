'use client'
import { Fuel, Droplet, Zap, Shield, Award, Leaf, Clock, Truck, Package, CheckCircle, ArrowRight, MapPin, Users, Wrench } from 'lucide-react';
import { useState } from 'react';

export default function ProductsPage() {
  const [activeService, setActiveService] = useState('reselling');

  const products = [
    {
      name: 'Premium Petrol (PMS)',
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
      fuelType: 'pms',
      color: 'primary',
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
      fuelType: 'pms',
      color: 'accent',
    },
    {
      name: 'Diesel (AGO)',
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
      fuelType: 'ago',
      color: 'secondary',
    },
    {
      name: 'Kerosene (IK)',
      icon: <Leaf className="h-12 w-12" />,
      description: 'Clean-burning illuminating kerosene ideal for lighting, heating, and cooking applications. Refined for safety and efficiency in domestic and commercial use.',
      features: [
        'Low smoke and odor for indoor use',
        'Consistent flame quality',
        'High purity and clean combustion',
        'Safe for cooking and lighting applications',
        'Long storage life without degradation',
        'Economical alternative energy source',
      ],
      applications: ['Domestic Lighting', 'Cooking Stoves', 'Space Heaters', 'Agricultural Equipment', 'Emergency Backup'],
      image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80',
      fuelType: 'ik',
      color: 'green',
    },
  ];

  const services = [
    {
      id: 'reselling',
      title: 'Fuel Reselling Services',
      icon: Fuel,
      description: 'Licensed EPRA distributor supplying petroleum products to businesses and individuals across Kenya',
      color: 'primary',
      features: [
        'Competitive wholesale pricing',
        'Bulk fuel supply contracts',
        'Reliable delivery schedules',
        'Quality assurance & testing',
        'Flexible credit facilities',
        'Volume-based discounts'
      ],
      benefits: [
        '24/7 emergency supply',
        'Real-time inventory tracking',
        'Dedicated account managers',
        'Transparent pricing'
      ]
    },
    {
      id: 'transport',
      title: 'Fuel Transport & Logistics',
      icon: Truck,
      description: 'Professional fuel transportation with modern fleet and comprehensive safety standards',
      color: 'accent',
      features: [
        'Modern tanker fleet',
        'GPS-tracked deliveries',
        'Trained & certified drivers',
        'Full insurance coverage',
        'Emergency response capability',
        'Multi-location delivery'
      ],
      benefits: [
        'ISO certified operations',
        'On-time delivery guarantee',
        'Safety compliance',
        'Route optimization'
      ]
    },
    {
      id: 'storage',
      title: 'Storage & Distribution',
      icon: Package,
      description: 'Secure storage facilities with advanced monitoring and distribution management',
      color: 'secondary',
      features: [
        'Climate-controlled tanks',
        'Automated inventory system',
        'Contamination prevention',
        'Fire safety systems',
        'Regular quality checks',
        'Stock rotation management'
      ],
      benefits: [
        'Strategic depot locations',
        'High capacity storage',
        'Environmental compliance',
        'Real-time monitoring'
      ]
    }
  ];

  const qualityFeatures = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Quality Assured',
      description: 'All products meet international standards and undergo rigorous testing',
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: 'EPRA Licensed',
      description: 'Fully certified and compliant with all regulatory requirements',
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

  const activeServiceData = services.find(s => s.id === activeService);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1628745277861-2ec8da33a3ab?w=1920&q=80"
          alt="Fuel products and services"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-secondary-900/85"></div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
            <CheckCircle className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">EPRA Licensed Distributor</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Premium Fuels & Services
          </h1>
          <p className="text-xl md:text-2xl text-neutral-100 max-w-3xl mx-auto mb-8 leading-relaxed">
            Quality petroleum products and professional distribution services for all your fuel needs
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="#products"
              className="inline-flex items-center gap-2 bg-primary-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-600 transition-all shadow-xl"
            >
              View Products
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#services"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all"
            >
              Our Services
            </a>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-500 mb-2">4</div>
              <div className="text-sm text-neutral-600 font-medium">Fuel Products</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent-500 mb-2">3</div>
              <div className="text-sm text-neutral-600 font-medium">Core Services</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary-500 mb-2">2</div>
              <div className="text-sm text-neutral-600 font-medium">Depot Locations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-sm text-neutral-600 font-medium">Availability</div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-800 mb-4">
              Our Fuel Products
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Quality petroleum products meeting international standards
            </p>
          </div>
          
          <div className="space-y-16">
            {products.map((product, index) => (
              <div
                key={product.name}
                className={`flex flex-col ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } gap-8 items-center bg-neutral-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`}
              >
                {/* Content */}
                <div className="flex-1 p-8 md:p-12">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-${product.color}-100 text-${product.color}-600 rounded-xl mb-6 shadow-md`}>
                    {product.icon}
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-bold text-secondary-800 mb-4">
                    {product.name}
                  </h3>
                  
                  <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="mb-8">
                    <h4 className="text-xl font-semibold text-secondary-700 mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-primary-500 rounded-full"></span>
                      Key Features
                    </h4>
                    <ul className="space-y-3">
                      {product.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-neutral-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-secondary-700 mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-primary-500 rounded-full"></span>
                      Applications
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {product.applications.map((app, i) => (
                        <span
                          key={i}
                          className={`bg-${product.color}-50 border border-${product.color}-200 text-${product.color}-700 px-4 py-2 rounded-full text-sm font-medium`}
                        >
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Image */}
                <div className="flex-1 w-full h-full relative">
                  <div className="relative h-80 md:h-[500px] w-full overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-800 mb-4">
              Our Services
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Comprehensive fuel distribution and logistics solutions
            </p>
          </div>

          {/* Service Selector */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => setActiveService(service.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all ${
                  activeService === service.id
                    ? 'bg-primary-500 text-white shadow-lg scale-105'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 shadow-md'
                }`}
              >
                <service.icon className="w-5 h-5" />
                {service.title}
              </button>
            ))}
          </div>

          {/* Active Service Detail */}
          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="flex items-start gap-4 mb-8">
                <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <activeServiceData.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-secondary-900 mb-3">
                    {activeServiceData.title}
                  </h3>
                  <p className="text-lg text-neutral-600">
                    {activeServiceData.description}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Features */}
                <div>
                  <h4 className="text-xl font-bold text-secondary-900 mb-4">
                    Service Features
                  </h4>
                  <ul className="space-y-3">
                    {activeServiceData.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-neutral-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div>
                  <h4 className="text-xl font-bold text-secondary-900 mb-4">
                    Key Benefits
                  </h4>
                  <div className="space-y-4">
                    {activeServiceData.benefits.map((benefit, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 bg-primary-50 p-4 rounded-xl border border-primary-200"
                      >
                        <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></div>
                        <span className="font-medium text-neutral-800">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-800 mb-4">
              Why Choose Eston Distributors
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Your trusted partner in fuel supply and distribution
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {qualityFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
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

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden bg-secondary-800">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80"
            alt="Contact"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Partner With Us?
          </h2>
          <p className="text-xl text-neutral-200 max-w-3xl mx-auto mb-10 leading-relaxed">
            Get competitive pricing, reliable supply, and professional service for your fuel needs
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="inline-flex items-center gap-2 bg-primary-500 text-white px-10 py-5 rounded-xl text-lg font-semibold hover:bg-primary-600 transition-all shadow-xl">
              Request a Quote
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 px-10 py-5 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all">
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}