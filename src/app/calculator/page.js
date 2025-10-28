// src/app/calculator/page.js
'use client';

import { useState } from 'react';
import { Calculator, TrendingDown, Percent, Truck, Download, Share2 } from 'lucide-react';
import SavingsCalculator from '@/components/calculators/SavingsCalculator';
import BulkDiscountCalculator from '@/components/calculators/BulkDiscountCalculator';
import DeliveryCostEstimator from '@/components/calculators/DeliveryCostEstimator';

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState('savings');

  const tabs = [
    {
      id: 'savings',
      label: 'Savings Calculator',
      icon: <TrendingDown className="w-5 h-5" />,
      description: 'Compare costs with competitors'
    },
    {
      id: 'bulk',
      label: 'Bulk Discounts',
      icon: <Percent className="w-5 h-5" />,
      description: 'Calculate volume discounts'
    },
    {
      id: 'delivery',
      label: 'Delivery Cost',
      icon: <Truck className="w-5 h-5" />,
      description: 'Estimate delivery fees'
    }
  ];

  const handleExport = () => {
    // Placeholder for export functionality
    alert('Export functionality coming soon!');
  };

  const handleShare = () => {
    // Placeholder for share functionality
    if (navigator.share) {
      navigator.share({
        title: 'Eston Fuel Calculator',
        text: 'Check out these fuel savings calculations',
        url: window.location.href
      }).catch(err => console.log('Error sharing:', err));
    } else {
      alert('Share functionality not supported on this browser');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-accent-50/20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-secondary-900 to-secondary-800 text-white py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Calculator className="w-5 h-5 text-primary-300" />
              <span className="text-sm font-semibold">Interactive Fuel Calculators</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Calculate Your Fuel Savings
            </h1>
            
            <p className="text-xl text-neutral-200 mb-8 max-w-3xl mx-auto">
              Use our free calculators to estimate potential savings, bulk discounts, and delivery costs. 
              Make informed decisions for your fuel purchasing needs.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-primary-300 mb-1">Up to 10%</div>
                <div className="text-sm text-neutral-300">Bulk Discounts</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-accent-300 mb-1">Free</div>
                <div className="text-sm text-neutral-300">CBD Delivery (5000L+)</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-green-300 mb-1">24/7</div>
                <div className="text-sm text-neutral-300">Emergency Service</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-2 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary-500 text-white shadow-lg'
                        : 'bg-white text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activeTab === tab.id
                        ? 'bg-white/20'
                        : 'bg-primary-50'
                    }`}>
                      {tab.icon}
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-sm lg:text-base">{tab.label}</div>
                      <div className={`text-xs ${
                        activeTab === tab.id ? 'text-white/80' : 'text-neutral-500'
                      }`}>
                        {tab.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Calculator Content */}
            <div className="mb-8">
              {activeTab === 'savings' && <SavingsCalculator />}
              {activeTab === 'bulk' && <BulkDiscountCalculator />}
              {activeTab === 'delivery' && <DeliveryCostEstimator />}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleExport}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-neutral-300 text-neutral-700 rounded-lg font-semibold hover:border-neutral-400 hover:bg-neutral-50 transition-all"
              >
                <Download className="w-5 h-5" />
                <span>Export Results</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-neutral-300 text-neutral-700 rounded-lg font-semibold hover:border-neutral-400 hover:bg-neutral-50 transition-all"
              >
                <Share2 className="w-5 h-5" />
                <span>Share Calculator</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                How It Works
              </h2>
              <p className="text-lg text-neutral-600">
                Our calculators use real EPRA prices and industry-standard formulas
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-2">
                  Real-Time Pricing
                </h3>
                <p className="text-neutral-600">
                  All calculations use current EPRA fuel prices updated monthly
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-2">
                  Accurate Estimates
                </h3>
                <p className="text-neutral-600">
                  Industry-standard formulas for bulk discounts and delivery costs
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💰</span>
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-2">
                  Transparent Savings
                </h3>
                <p className="text-neutral-600">
                  See exactly how much you can save with detailed breakdowns
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-accent-500 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Saving?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-primary-50">
            Contact us today to get a personalized quote based on your fuel requirements
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-neutral-100 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Get a Quote
            </a>
            <a
              href="tel:+254722943291"
              className="inline-block bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/20 transition-all border-2 border-white/30"
            >
              Call Us Now
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-secondary-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              <details className="bg-white rounded-xl p-6 border border-neutral-200">
                <summary className="font-bold text-secondary-900 cursor-pointer">
                  How accurate are these calculations?
                </summary>
                <p className="mt-3 text-neutral-600">
                  Our calculators use current EPRA fuel prices and industry-standard formulas. 
                  Actual prices may vary slightly based on specific requirements and market conditions.
                </p>
              </details>

              <details className="bg-white rounded-xl p-6 border border-neutral-200">
                <summary className="font-bold text-secondary-900 cursor-pointer">
                  Do you offer custom pricing for large corporate accounts?
                </summary>
                <p className="mt-3 text-neutral-600">
                  Yes! For orders exceeding 25,000 liters or long-term contracts, we offer customized 
                  pricing. Contact our sales team for a personalized quote.
                </p>
              </details>

              <details className="bg-white rounded-xl p-6 border border-neutral-200">
                <summary className="font-bold text-secondary-900 cursor-pointer">
                  Is delivery really free for CBD locations?
                </summary>
                <p className="mt-3 text-neutral-600">
                  Yes! We offer free delivery for orders of 5,000 liters or more within Nairobi CBD. 
                  Other locations have competitive delivery rates based on distance.
                </p>
              </details>

              <details className="bg-white rounded-xl p-6 border border-neutral-200">
                <summary className="font-bold text-secondary-900 cursor-pointer">
                  Can I schedule regular deliveries?
                </summary>
                <p className="mt-3 text-neutral-600">
                  Absolutely! We offer scheduled delivery services for businesses with regular fuel 
                  requirements. Contact us to set up a delivery schedule that works for you.
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}