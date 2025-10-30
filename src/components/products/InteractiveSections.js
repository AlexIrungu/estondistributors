'use client';
import { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Droplets, Calendar, Calculator, BarChart3, MapPin, Bell } from 'lucide-react';
import Link from 'next/link';

// 1. Interactive Price Comparison Chart
export function PriceComparisonSection() {
  const [timeRange, setTimeRange] = useState('30days');
  
  const priceData = {
    '7days': { pms: 184.52, ago: 171.47, ik: 154.78, change: { pms: 0.5, ago: -0.3, ik: 0.2 } },
    '30days': { pms: 183.20, ago: 170.10, ik: 153.50, change: { pms: 1.8, ago: -1.2, ik: 0.8 } },
    '90days': { pms: 181.40, ago: 169.20, ik: 152.40, change: { pms: 3.2, ago: -0.8, ik: 1.5 } }
  };

  const data = priceData[timeRange];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-3">Price Trends & Analysis</h2>
          <p className="text-neutral-600">Track fuel price movements and make informed decisions</p>
        </div>

        {/* Time Range Selector */}
        <div className="flex justify-center gap-2 mb-8">
          {[
            { key: '7days', label: '7 Days' },
            { key: '30days', label: '30 Days' },
            { key: '90days', label: '90 Days' }
          ].map((range) => (
            <button
              key={range.key}
              onClick={() => setTimeRange(range.key)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                timeRange === range.key
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Price Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { name: 'Super Petrol', key: 'pms', color: 'blue', icon: '⛽' },
            { name: 'Diesel', key: 'ago', color: 'orange', icon: '🚚' },
            { name: 'Kerosene', key: 'ik', color: 'green', icon: '🏠' }
          ].map((fuel) => {
            const change = data.change[fuel.key];
            const isIncrease = change > 0;

            return (
              <div key={fuel.key} className="bg-white rounded-2xl p-6 shadow-xl border border-neutral-200 hover:shadow-2xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{fuel.icon}</span>
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                    isIncrease ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {isIncrease ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {Math.abs(change).toFixed(1)}%
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{fuel.name}</h3>
                <p className="text-4xl font-bold text-secondary-900 mb-1">
                  KES {data[fuel.key].toFixed(2)}
                </p>
                <p className="text-sm text-neutral-600">Average price</p>
              </div>
            );
          })}
        </div>

        {/* Price Alert CTA */}
        <div className="mt-8 text-center">
          <Link
            href="/alerts"
            className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-xl font-semibold text-primary-600 hover:bg-primary-50 transition-all shadow-lg"
          >
            <Bell className="w-5 h-5" />
            Set Price Alerts
          </Link>
        </div>
      </div>
    </section>
  );
}

// 2. Interactive Savings Calculator
export function SavingsCalculatorWidget() {
  const [volume, setVolume] = useState(5000);
  const [frequency, setFrequency] = useState('monthly');
  
  const bulkDiscount = volume >= 10000 ? 5 : volume >= 5000 ? 3 : volume >= 2000 ? 2 : 0;
  const currentPrice = 184.52;
  const discountedPrice = currentPrice * (1 - bulkDiscount / 100);
  const savings = (currentPrice - discountedPrice) * volume;
  const annualSavings = frequency === 'monthly' ? savings * 12 : frequency === 'weekly' ? savings * 52 : savings;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-8 md:p-12 shadow-2xl text-white">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Calculator className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Bulk Order Savings Calculator</h2>
              <p className="text-primary-100">Calculate your potential savings with bulk orders</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-3">Order Volume (Liters)</label>
                <input
                  type="range"
                  min="100"
                  max="50000"
                  step="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                />
                <div className="flex justify-between mt-2 text-sm">
                  <span>100L</span>
                  <span className="font-bold text-xl">{volume.toLocaleString()}L</span>
                  <span>50,000L</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3">Order Frequency</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 border-2 border-white/30 rounded-xl text-white font-semibold focus:outline-none focus:border-white/50 backdrop-blur-sm"
                >
                  <option value="once" className="text-neutral-900">One-time</option>
                  <option value="weekly" className="text-neutral-900">Weekly</option>
                  <option value="monthly" className="text-neutral-900">Monthly</option>
                </select>
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold mb-4">Your Savings</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-primary-100 mb-1">Bulk Discount</p>
                  <p className="text-3xl font-bold">{bulkDiscount}%</p>
                </div>

                <div className="border-t border-white/20 pt-4">
                  <p className="text-sm text-primary-100 mb-1">Per Order Savings</p>
                  <p className="text-3xl font-bold">KES {savings.toFixed(0).toLocaleString()}</p>
                </div>

                {frequency !== 'once' && (
                  <div className="border-t border-white/20 pt-4">
                    <p className="text-sm text-primary-100 mb-1">Annual Savings</p>
                    <p className="text-3xl font-bold text-yellow-300">
                      KES {annualSavings.toFixed(0).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              <Link
                href="/contact"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-all"
              >
                Get This Discount
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 3. Interactive Delivery Zone Selector
export function DeliveryZoneSelector() {
  const [selectedZone, setSelectedZone] = useState('nairobi-cbd');

  const zones = [
    { id: 'nairobi-cbd', name: 'Nairobi CBD', cost: 0, time: '2-4 hours', areas: ['Downtown', 'Westlands', 'Parklands'] },
    { id: 'nairobi-inner', name: 'Nairobi Inner', cost: 500, time: '4-6 hours', areas: ['Karen', 'Lavington', 'Kileleshwa'] },
    { id: 'nairobi-outer', name: 'Nairobi Outer', cost: 1500, time: '6-12 hours', areas: ['Kahawa', 'Ruiru', 'Ngong'] },
    { id: 'kiambu', name: 'Kiambu County', cost: 2500, time: '12-24 hours', areas: ['Thika', 'Kikuyu', 'Limuru'] }
  ];

  const zone = zones.find(z => z.id === selectedZone);

  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-3">Check Delivery to Your Area</h2>
          <p className="text-neutral-600">Select your zone to see delivery times and costs</p>
        </div>

        {/* Zone Buttons */}
        <div className="grid md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-8">
          {zones.map((z) => (
            <button
              key={z.id}
              onClick={() => setSelectedZone(z.id)}
              className={`p-4 rounded-xl font-semibold transition-all ${
                selectedZone === z.id
                  ? 'bg-primary-500 text-white shadow-xl scale-105'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100 shadow-md'
              }`}
            >
              <MapPin className="w-5 h-5 mx-auto mb-2" />
              <p className="text-sm">{z.name}</p>
            </button>
          ))}
        </div>

        {/* Zone Details */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-xl border border-neutral-200">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <DollarSign className="w-8 h-8 text-primary-500 mx-auto mb-2" />
              <p className="text-sm text-neutral-600 mb-1">Delivery Cost</p>
              <p className="text-2xl font-bold text-secondary-900">
                {zone.cost === 0 ? 'FREE' : `KES ${zone.cost.toLocaleString()}`}
              </p>
            </div>
            <div className="text-center">
              <Calendar className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <p className="text-sm text-neutral-600 mb-1">Delivery Time</p>
              <p className="text-2xl font-bold text-secondary-900">{zone.time}</p>
            </div>
            <div className="text-center">
              <Droplets className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-neutral-600 mb-1">Min. Order</p>
              <p className="text-2xl font-bold text-secondary-900">100L</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 mb-3">Coverage Areas:</h4>
            <div className="flex flex-wrap gap-2">
              {zone.areas.map((area, i) => (
                <span key={i} className="bg-primary-50 border border-primary-200 text-primary-700 px-3 py-1.5 rounded-full text-sm">
                  {area}
                </span>
              ))}
            </div>
          </div>

          <Link
            href="/delivery-zones"
            className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-all"
          >
            View Full Coverage Map
          </Link>
        </div>
      </div>
    </section>
  );
}

// 4. Product Comparison Table (Interactive)
export function ProductComparisonTable() {
  const [showAll, setShowAll] = useState(false);

  const features = [
    { name: 'Octane/Cetane Rating', pms: '91-95', ago: '50+', ik: 'N/A' },
    { name: 'Sulfur Content', pms: '< 50 ppm', ago: '< 50 ppm', ik: '< 0.2%' },
    { name: 'Best For', pms: 'Cars & Motorcycles', ago: 'Trucks & Heavy Machinery', ik: 'Heating & Cooking' },
    { name: 'Fuel Efficiency', pms: 'High', ago: 'Very High', ik: 'Medium' },
    { name: 'Cold Weather', pms: 'Good', ago: 'Excellent (-20°C)', ik: 'Good' },
    { name: 'Storage Life', pms: '6 months', ago: '12 months', ik: '24+ months' }
  ];

  const displayFeatures = showAll ? features : features.slice(0, 3);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-3">Compare Our Products</h2>
          <p className="text-neutral-600">Find the right fuel for your needs</p>
        </div>

        <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-neutral-200 shadow-xl">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Feature</th>
                <th className="px-6 py-4 text-center font-semibold">Super Petrol</th>
                <th className="px-6 py-4 text-center font-semibold">Diesel</th>
                <th className="px-6 py-4 text-center font-semibold">Kerosene</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {displayFeatures.map((feature, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-neutral-50' : 'bg-white'}>
                  <td className="px-6 py-4 font-medium text-neutral-900">{feature.name}</td>
                  <td className="px-6 py-4 text-center text-neutral-700">{feature.pms}</td>
                  <td className="px-6 py-4 text-center text-neutral-700">{feature.ago}</td>
                  <td className="px-6 py-4 text-center text-neutral-700">{feature.ik}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {!showAll && (
            <div className="bg-neutral-50 p-4 text-center border-t border-neutral-200">
              <button
                onClick={() => setShowAll(true)}
                className="text-primary-600 font-semibold hover:text-primary-700 inline-flex items-center gap-2"
              >
                Show All Features
                <TrendingDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}