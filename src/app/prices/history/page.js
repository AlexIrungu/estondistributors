'use client';

import { useState } from 'react';
import Image from 'next/image';
import { TrendingUp, History, BarChart3, Download } from 'lucide-react';
import PriceHistoryChart from '@/components/charts/PriceHistoryChart';
import PricePredictionChart from '@/components/charts/PricePredictionChart';
import ComparisonChart from '@/components/charts/ComparisonChart';
import { historicalPrices, crudeOilHistory } from '@/data/samplePrices';

export default function PriceHistoryPage() {
  const [selectedLocation, setSelectedLocation] = useState('nairobi');
  const [selectedFuelType, setSelectedFuelType] = useState('pms');
  const [showPredictions, setShowPredictions] = useState(true);

  const locations = [
    { key: 'nairobi', name: 'Nairobi' },
    { key: 'mombasa', name: 'Mombasa' }
  ];

  const fuelTypes = [
    { key: 'pms', name: 'Super Petrol', color: 'red' },
    { key: 'ago', name: 'Diesel', color: 'green' },
    { key: 'ik', name: 'Kerosene', color: 'amber' }
  ];

  const currentLocationData = historicalPrices[selectedLocation];
  const currentFuelData = currentLocationData?.[selectedFuelType];

  // Prepare comparison data
  const comparisonData = {
    pms: currentLocationData?.pms,
    ago: currentLocationData?.ago,
    ik: currentLocationData?.ik
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(currentFuelData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedLocation}_${selectedFuelType}_history.json`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="relative bg-secondary-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=1920&q=80"
            alt="Price history"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-secondary-900/70"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center mb-4">
            <History className="w-8 h-8 mr-3 text-primary-400" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Price History & Predictions
            </h1>
          </div>
          <p className="text-xl text-neutral-200 max-w-3xl">
            Analyze historical fuel price trends and view AI-powered predictions for the next 30 days.
          </p>
        </div>
      </section>

      {/* Controls Section */}
      <section className="bg-white border-b border-neutral-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Location Selector */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-neutral-700">
                Location:
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              >
                {locations.map((loc) => (
                  <option key={loc.key} value={loc.key}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Fuel Type Selector */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-neutral-700">
                Fuel Type:
              </label>
              <div className="flex space-x-2">
                {fuelTypes.map((fuel) => (
                  <button
                    key={fuel.key}
                    onClick={() => setSelectedFuelType(fuel.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedFuelType === fuel.key
                        ? `bg-${fuel.color}-500 text-white`
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {fuel.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowPredictions(!showPredictions)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showPredictions
                    ? 'bg-purple-500 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                <TrendingUp className="w-4 h-4 inline mr-1" />
                Predictions
              </button>
              <button
                onClick={handleExportData}
                className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors"
              >
                <Download className="w-4 h-4 inline mr-1" />
                Export
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Historical Price Chart */}
            <PriceHistoryChart
              data={currentFuelData}
              fuelType={selectedFuelType}
              location={selectedLocation}
              showStats={true}
              height={400}
            />

            {/* Price Prediction Chart */}
            {showPredictions && (
              <PricePredictionChart
                historicalData={currentFuelData}
                fuelType={selectedFuelType}
                location={selectedLocation}
                daysToPredict={30}
                height={400}
              />
            )}

            {/* Comparison Chart */}
            <ComparisonChart
              data={comparisonData}
              location={selectedLocation}
              height={400}
              showCrudeOil={true}
              crudeOilData={crudeOilHistory.brent}
            />
          </div>
        </div>
      </section>

      {/* Insights Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8">
            Key Insights
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Insight 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-secondary-900 mb-2">
                Price Trends
              </h3>
              <p className="text-neutral-700 text-sm">
                Fuel prices have shown moderate volatility over the past 12 months, influenced by global crude oil markets and local currency fluctuations.
              </p>
            </div>

            {/* Insight 2 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-secondary-900 mb-2">
                Seasonal Patterns
              </h3>
              <p className="text-neutral-700 text-sm">
                Historical data shows slight seasonal variations, with prices typically higher during peak travel months and lower during off-peak periods.
              </p>
            </div>

            {/* Insight 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <History className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-secondary-900 mb-2">
                Future Outlook
              </h3>
              <p className="text-neutral-700 text-sm">
                Our predictions suggest stable prices in the near term, but external factors like global oil supply and exchange rates can cause rapid changes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-primary-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Want Price Alerts?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Get notified when prices change for your preferred fuel type and location.
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-neutral-100 transition-colors shadow-lg"
          >
            Subscribe to Alerts
          </a>
        </div>
      </section>
    </div>
  );
}