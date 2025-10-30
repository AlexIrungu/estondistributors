'use client';
import { Fuel, Droplet, Zap, Leaf, Shield, Award, Clock, Truck, Package, CheckCircle, ArrowRight, TrendingUp, BarChart3, Calculator, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import PriceWidget from '@/components/PriceWidget';
import InventoryStatus from '@/components/inventory/InventoryStatus';
import OrderForm from '@/components/OrderForm';
import { 
  PriceComparisonSection,
  SavingsCalculatorWidget,
  DeliveryZoneSelector,
  ProductComparisonTable 
} from '@/components/products/InteractiveSections';

export default function ProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState('pms');
  const [showCalculator, setShowCalculator] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const products = {
    pms: {
      id: 'pms',
      name: 'Premium Petrol (PMS)',
      shortName: 'Super Petrol',
      icon: <Fuel className="h-8 w-8" />,
      description: 'Premium quality unleaded petrol suitable for all gasoline engines',
      features: [
        'Octane rating: 91-95',
        'Ultra-low sulfur content',
        'Enhanced cleaning additives',
        'Reduces carbon deposits',
        'Meets Euro 5 standards',
        'Consistent quality'
      ],
      applications: ['Passenger Cars', 'Motorcycles', 'Small Generators', 'Light Commercial Vehicles'],
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600'
    },
    ago: {
      id: 'ago',
      name: 'Diesel (AGO)',
      shortName: 'Diesel',
      icon: <Droplet className="h-8 w-8" />,
      description: 'Reliable diesel fuel for heavy-duty vehicles and industrial equipment',
      features: [
        'Ultra-low sulfur diesel (ULSD)',
        'High cetane number',
        'Superior lubricity',
        'Cold weather performance',
        'Reduced emissions',
        'Extended engine life'
      ],
      applications: ['Heavy Trucks', 'Buses', 'Construction Equipment', 'Industrial Generators', 'Marine Vessels'],
      color: 'orange',
      gradient: 'from-orange-500 to-orange-600'
    },
    ik: {
      id: 'ik',
      name: 'Kerosene (IK)',
      shortName: 'Kerosene',
      icon: <Leaf className="h-8 w-8" />,
      description: 'Clean-burning illuminating kerosene for lighting, heating, and cooking',
      features: [
        'Low smoke and odor',
        'Consistent flame quality',
        'High purity',
        'Safe for indoor use',
        'Long storage life',
        'Economical energy source'
      ],
      applications: ['Domestic Lighting', 'Cooking Stoves', 'Space Heaters', 'Agricultural Equipment'],
      color: 'green',
      gradient: 'from-green-500 to-green-600'
    }
  };

  const selected = products[selectedProduct];

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-6 text-white relative">
              <button
                onClick={() => setShowOrderModal(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Request a Quote</h2>
                  <p className="text-primary-100">Get competitive pricing for bulk fuel orders</p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <OrderForm />
            </div>
          </div>
        </div>
      )}

      {/* Compact Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzMiAyIDIgNHYxYzAgMS0xIDItMiAycy0yLTEtMi0ydi0xem0wLTEwYzAtMiAyLTQgMi00czIgMiAyIDR2MWMwIDEtMSAyLTIgMnMtMi0xLTItMnYtMXoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Quality Fuel Products
          </h1>
          <p className="text-lg text-neutral-200 max-w-2xl mx-auto">
            Choose from our range of premium petroleum products
          </p>
        </div>
      </section>

      {/* Interactive Product Selector + Live Pricing */}
      <section className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {/* Product Cards - Compact */}
          {Object.values(products).map((product) => (
            <button
              key={product.id}
              onClick={() => setSelectedProduct(product.id)}
              className={`relative bg-white rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-2xl ${
                selectedProduct === product.id
                  ? 'border-primary-500 shadow-xl scale-105'
                  : 'border-neutral-200 hover:border-primary-300'
              }`}
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${product.gradient} text-white flex items-center justify-center mb-4`}>
                {product.icon}
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-2">{product.shortName}</h3>
              <p className="text-sm text-neutral-600">{product.description}</p>
              
              {selectedProduct === product.id && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Selected Product Details + Real-time Price */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {/* Product Details */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selected.gradient} text-white flex items-center justify-center`}>
                {selected.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-secondary-900">{selected.name}</h2>
                <p className="text-neutral-600">{selected.description}</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Features */}
              <div>
                <h3 className="text-lg font-bold text-secondary-900 mb-3 flex items-center gap-2">
                  <span className={`w-1 h-6 rounded-full bg-gradient-to-b ${selected.gradient}`}></span>
                  Key Features
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {selected.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-neutral-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Applications */}
              <div>
                <h3 className="text-lg font-bold text-secondary-900 mb-3 flex items-center gap-2">
                  <span className={`w-1 h-6 rounded-full bg-gradient-to-b ${selected.gradient}`}></span>
                  Applications
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selected.applications.map((app, i) => (
                    <span
                      key={i}
                      className={`bg-${selected.color}-50 border border-${selected.color}-200 text-${selected.color}-700 px-3 py-1.5 rounded-full text-xs font-medium`}
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Live Price Widget */}
          <div className="space-y-6">
            <PriceWidget location="nairobi" compact={false} />
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/calculator"
                className="flex items-center justify-center gap-2 bg-primary-500 text-white px-6 py-4 rounded-xl font-semibold hover:bg-primary-600 transition-all shadow-lg hover:shadow-xl"
              >
                <Calculator className="w-5 h-5" />
                Calculator
              </Link>
              <button
                onClick={() => setShowOrderModal(true)}
                className="flex items-center justify-center gap-2 bg-secondary-500 text-white px-6 py-4 rounded-xl font-semibold hover:bg-secondary-600 transition-all shadow-lg hover:shadow-xl"
              >
                <Package className="w-5 h-5" />
                Order Now
              </button>
            </div>
          </div>
        </div>

        {/* Live Inventory Status - Interactive */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-secondary-900">Super Petrol Stock</h3>
              <Fuel className="w-5 h-5 text-blue-500" />
            </div>
            <InventoryStatus locationId="nairobi" fuelType="pms" variant="compact" />
          </div>
          
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-secondary-900">Diesel Stock</h3>
              <Droplet className="w-5 h-5 text-orange-500" />
            </div>
            <InventoryStatus locationId="nairobi" fuelType="ago" variant="compact" />
          </div>
          
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-secondary-900">Kerosene Stock</h3>
              <Leaf className="w-5 h-5 text-green-500" />
            </div>
            <InventoryStatus locationId="nairobi" fuelType="ik" variant="compact" />
          </div>
        </div>
      </section>

      {/* Services Section - Compact Cards */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-3">Our Services</h2>
            <p className="text-neutral-600">Complete fuel distribution solutions</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-neutral-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <Fuel className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-3">Fuel Reselling</h3>
              <p className="text-neutral-600 mb-4">Licensed EPRA distributor with competitive wholesale pricing and flexible credit terms</p>
              <Link href="/contact" className="text-primary-600 font-semibold hover:text-primary-700 inline-flex items-center gap-1">
                Learn More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-neutral-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Truck className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-3">Transport & Logistics</h3>
              <p className="text-neutral-600 mb-4">Modern fleet with GPS tracking and certified drivers for safe, timely delivery</p>
              <Link href="/transport" className="text-primary-600 font-semibold hover:text-primary-700 inline-flex items-center gap-1">
                Learn More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-neutral-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Package className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-3">Storage & Distribution</h3>
              <p className="text-neutral-600 mb-4">Climate-controlled facilities with advanced monitoring and safety systems</p>
              <Link href="/contact" className="text-primary-600 font-semibold hover:text-primary-700 inline-flex items-center gap-1">
                Learn More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Features - Compact Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-3">Why Choose Us</h2>
            <p className="text-neutral-600">Your trusted fuel distribution partner</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Quality Assured', desc: 'International standards' },
              { icon: Award, title: 'EPRA Licensed', desc: 'Fully certified' },
              { icon: Leaf, title: 'Eco-Friendly', desc: 'Low sulfur content' },
              { icon: Clock, title: '24/7 Available', desc: 'Reliable supply' }
            ].map((feature, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-bold text-secondary-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-neutral-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 overflow-hidden bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzMiAyIDIgNHYxYzAgMS0xIDItMiAycy0yLTEtMi0ydi0xem0wLTEwYzAtMiAyLTQgMi00czIgMiAyIDR2MWMwIDEtMSAyLTIgMnMtMi0xLTItMnYtMXoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-neutral-200 max-w-2xl mx-auto mb-8">
            Get competitive pricing and reliable supply for your fuel needs
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setShowOrderModal(true)}
              className="inline-flex items-center gap-2 bg-primary-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-600 transition-all shadow-xl"
            >
              Request Quote
              <ArrowRight className="w-5 h-5" />
            </button>
            <Link
              href="/prices"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
      <PriceComparisonSection />
      <SavingsCalculatorWidget />
      <DeliveryZoneSelector />
      <ProductComparisonTable />

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}