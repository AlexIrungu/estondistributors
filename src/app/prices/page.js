'use client';

import { useState } from 'react';
import PriceDisplay from '@/components/PriceDisplay';
import PriceTrendSummary from '@/components/charts/PriceTrendSummary';
import { TrendingUp, Info, RefreshCw, History, BarChart3 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getHistoricalPrices } from '@/data/samplePrices';

export default function PricesPage() {
  const [selectedLocation, setSelectedLocation] = useState('nairobi');
  const [selectedFuelType, setSelectedFuelType] = useState('pms');

  // Get historical data for the selected location and fuel type
  const historicalData = getHistoricalPrices(selectedLocation, selectedFuelType, 12);

  const locations = [
    { key: 'nairobi', name: 'Nairobi' },
    { key: 'mombasa', name: 'Mombasa' }
  ];

  const fuelTypes = [
    { key: 'pms', name: 'Super Petrol', icon: '⛽' },
    { key: 'ago', name: 'Diesel', icon: '🚚' },
    { key: 'ik', name: 'Kerosene', icon: '🏠' }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="relative bg-secondary-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=1920&q=80"
            alt="Fuel prices"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-secondary-900/70"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center mb-4 px-4 py-2 bg-primary-500/20 border border-primary-500/30 rounded-full">
              <TrendingUp className="w-4 h-4 mr-2" />
              <span className="text-primary-400 text-sm font-semibold">Updated Monthly</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Current Fuel Prices in Kenya
            </h1>
            <p className="text-xl text-neutral-200 mb-6">
              Official EPRA prices for all major locations. Updated on the 1st of every month.
            </p>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/prices/history"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-white hover:bg-white/20 transition-colors border border-white/20"
              >
                <History className="w-4 h-4" />
                <span>View History & Predictions</span>
              </Link>
              <Link
                href="/calculator"
                className="inline-flex items-center gap-2 bg-primary-500 px-4 py-2 rounded-lg text-white hover:bg-primary-600 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Fuel Calculator</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 md:h-16 fill-neutral-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* Price Display Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <PriceDisplay />

          {/* Price Trend Summary - NEW! */}
          <div className="mt-8">
            {/* Controls for Trend Summary */}
            <div className="mb-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-secondary-900 mb-1">
                  Price Trends & Analytics
                </h2>
                <p className="text-sm text-neutral-600">
                  Historical analysis for {locations.find(l => l.key === selectedLocation)?.name}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {/* Location Selector */}
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-sm"
                >
                  {locations.map((loc) => (
                    <option key={loc.key} value={loc.key}>
                      {loc.name}
                    </option>
                  ))}
                </select>

                {/* Fuel Type Selector */}
                <div className="flex gap-1 bg-neutral-100 p-1 rounded-lg">
                  {fuelTypes.map((fuel) => (
                    <button
                      key={fuel.key}
                      onClick={() => setSelectedFuelType(fuel.key)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        selectedFuelType === fuel.key
                          ? 'bg-white text-primary-600 shadow-sm'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                      title={fuel.name}
                    >
                      <span className="mr-1">{fuel.icon}</span>
                      <span className="hidden sm:inline">{fuel.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Trend Summary Component */}
            <PriceTrendSummary 
              data={historicalData} 
              fuelType={selectedFuelType} 
              location={selectedLocation} 
            />
          </div>
        </div>
      </section>

      {/* Information Cards */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* EPRA Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Info className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-secondary-900 mb-2">About EPRA Prices</h3>
                  <p className="text-sm text-secondary-700">
                    The Energy and Petroleum Regulatory Authority (EPRA) sets maximum retail prices 
                    for petroleum products in Kenya on a monthly basis.
                  </p>
                </div>
              </div>
            </div>

            {/* Update Schedule */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <RefreshCw className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-secondary-900 mb-2">Update Schedule</h3>
                  <p className="text-sm text-secondary-700">
                    Prices are reviewed and updated on the 1st of every month. Check back regularly 
                    for the latest pricing information.
                  </p>
                </div>
              </div>
            </div>

            {/* Price Factors */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                  <TrendingUp className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-secondary-900 mb-2">Price Factors</h3>
                  <p className="text-sm text-secondary-700">
                    Fuel prices are influenced by international crude oil prices, exchange rates, 
                    and local taxes and levies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Analytics CTA */}
      <section className="py-12 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-200">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Side - Content */}
              <div className="p-8 lg:p-12">
                <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                  <History className="w-4 h-4" />
                  <span>Advanced Analytics</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                  Explore Detailed Price History & Predictions
                </h2>
                <p className="text-lg text-neutral-600 mb-6">
                  Analyze 12 months of historical data, view AI-powered 30-day predictions, 
                  and compare fuel types side-by-side with interactive charts.
                </p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-neutral-700">Interactive price history charts with detailed statistics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-neutral-700">30-day price forecasts with confidence intervals</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-neutral-700">Fuel type comparison with crude oil correlation</span>
                  </li>
                </ul>

                <Link
                  href="/prices/history"
                  className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>View Full Analytics Dashboard</span>
                </Link>
              </div>

              {/* Right Side - Visual */}
              <div className="relative bg-gradient-to-br from-primary-500 to-purple-600 p-8 lg:p-12 flex items-center justify-center">
                <div className="relative">
                  {/* Decorative chart illustration */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="space-y-4">
                      <div className="flex items-end gap-2 h-32">
                        <div className="w-8 bg-white/40 rounded-t" style={{ height: '60%' }}></div>
                        <div className="w-8 bg-white/60 rounded-t" style={{ height: '80%' }}></div>
                        <div className="w-8 bg-white/80 rounded-t" style={{ height: '45%' }}></div>
                        <div className="w-8 bg-white/90 rounded-t" style={{ height: '70%' }}></div>
                        <div className="w-8 bg-white rounded-t" style={{ height: '55%' }}></div>
                        <div className="w-8 bg-white/90 rounded-t" style={{ height: '85%' }}></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 h-2 bg-white/40 rounded-full"></div>
                        <div className="flex-1 h-2 bg-white/60 rounded-full"></div>
                        <div className="flex-1 h-2 bg-white/80 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating badges */}
                  <div className="absolute -top-4 -right-4 bg-white rounded-lg px-3 py-2 shadow-xl">
                    <div className="text-xs text-neutral-600 mb-1">Forecast</div>
                    <div className="text-lg font-bold text-primary-600">+2.5%</div>
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-white rounded-lg px-3 py-2 shadow-xl">
                    <div className="text-xs text-neutral-600 mb-1">30 Days</div>
                    <div className="text-lg font-bold text-green-600">Stable</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fuel Types Explanation */}
      <section className="py-12 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8 text-center">
            Understanding Fuel Types
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Super Petrol */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">⛽</div>
              <h3 className="text-xl font-bold text-secondary-900 mb-3">Super Petrol (PMS)</h3>
              <p className="text-neutral-600 mb-4">
                Premium Motor Spirit - High-octane gasoline suitable for most modern vehicles. 
                Provides optimal engine performance and efficiency.
              </p>
              <div className="text-sm text-neutral-500">
                Also known as: Unleaded Petrol, Gasoline
              </div>
            </div>

            {/* Diesel */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-bold text-secondary-900 mb-3">Automotive Gas Oil (AGO)</h3>
              <p className="text-neutral-600 mb-4">
                Commonly known as diesel. Ideal for heavy-duty vehicles, trucks, and industrial 
                equipment. Known for fuel efficiency and torque.
              </p>
              <div className="text-sm text-neutral-500">
                Also known as: Diesel, Gas Oil
              </div>
            </div>

            {/* Kerosene */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-xl font-bold text-secondary-900 mb-3">Illuminating Kerosene (IK)</h3>
              <p className="text-neutral-600 mb-4">
                Multi-purpose fuel used for lighting, heating, and cooking. Popular in rural areas 
                and as an alternative energy source.
              </p>
              <div className="text-sm text-neutral-500">
                Also known as: Paraffin, Lamp Oil
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Need Bulk Fuel Supply?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-primary-100">
            We offer competitive pricing for bulk orders and long-term contracts. 
            Contact us today for a custom quote.
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-neutral-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Request a Quote
          </a>
        </div>
      </section>
    </div>
  );
}