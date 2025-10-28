import { useState, useEffect } from 'react';
import { TrendingDown, DollarSign, Droplets, Calendar, Info } from 'lucide-react';

export default function SavingsCalculator() {
  const [formData, setFormData] = useState({
    currentSupplier: '',
    monthlyVolume: '',
    currentPrice: '',
    fuelType: 'pms'
  });

  const [results, setResults] = useState(null);

  // Current prices from your data structure
  const currentPrices = {
    pms: 184.52,
    ago: 171.47,
    ik: 154.78
  };

  const fuelTypes = [
    { value: 'pms', label: 'Super Petrol (PMS)', price: currentPrices.pms },
    { value: 'ago', label: 'Diesel (AGO)', price: currentPrices.ago },
    { value: 'ik', label: 'Kerosene (IK)', price: currentPrices.ik }
  ];

  // Calculate savings whenever inputs change
  useEffect(() => {
    if (formData.monthlyVolume && formData.currentPrice) {
      calculateSavings();
    }
  }, [formData]);

  const calculateSavings = () => {
    const volume = parseFloat(formData.monthlyVolume);
    const currentPrice = parseFloat(formData.currentPrice);
    const ourPrice = currentPrices[formData.fuelType];

    if (!volume || !currentPrice) {
      setResults(null);
      return;
    }

    const currentMonthlyCost = volume * currentPrice;
    const ourMonthlyCost = volume * ourPrice;
    const monthlySavings = currentMonthlyCost - ourMonthlyCost;
    const yearlySavings = monthlySavings * 12;
    const savingsPercentage = ((monthlySavings / currentMonthlyCost) * 100).toFixed(2);

    setResults({
      currentMonthlyCost,
      ourMonthlyCost,
      monthlySavings,
      yearlySavings,
      savingsPercentage,
      ourPrice
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
          <TrendingDown className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-secondary-900">Fuel Savings Calculator</h3>
          <p className="text-sm text-neutral-600">Compare your current costs with Eston rates</p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4 mb-8">
        {/* Fuel Type */}
        <div>
          <label className="block text-sm font-semibold text-secondary-900 mb-2">
            Fuel Type
          </label>
          <select
            name="fuelType"
            value={formData.fuelType}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
          >
            {fuelTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label} - KES {type.price.toFixed(2)}/L
              </option>
            ))}
          </select>
        </div>

        {/* Current Supplier */}
        <div>
          <label className="block text-sm font-semibold text-secondary-900 mb-2">
            Current Supplier (Optional)
          </label>
          <input
            type="text"
            name="currentSupplier"
            value={formData.currentSupplier}
            onChange={handleInputChange}
            placeholder="e.g., Shell, Total, etc."
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
          />
        </div>

        {/* Monthly Volume */}
        <div>
          <label className="block text-sm font-semibold text-secondary-900 mb-2">
            Monthly Volume (Liters)
          </label>
          <div className="relative">
            <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="number"
              name="monthlyVolume"
              value={formData.monthlyVolume}
              onChange={handleInputChange}
              placeholder="5000"
              min="1"
              className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
          </div>
          <p className="mt-1 text-xs text-neutral-500">Enter your average monthly fuel consumption</p>
        </div>

        {/* Current Price */}
        <div>
          <label className="block text-sm font-semibold text-secondary-900 mb-2">
            Your Current Price per Liter (KES)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="number"
              name="currentPrice"
              value={formData.currentPrice}
              onChange={handleInputChange}
              placeholder="190.00"
              step="0.01"
              min="0"
              className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
          </div>
          <p className="mt-1 text-xs text-neutral-500">What you currently pay per liter</p>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-4">
          <div className="h-px bg-neutral-200"></div>
          
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6 border border-primary-100">
            <h4 className="text-lg font-bold text-secondary-900 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary-600" />
              Your Savings Breakdown
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Current Cost */}
              <div className="bg-white rounded-lg p-4 border border-neutral-200">
                <div className="text-sm text-neutral-600 mb-1">Current Monthly Cost</div>
                <div className="text-2xl font-bold text-neutral-700">
                  {formatCurrency(results.currentMonthlyCost)}
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  @ KES {formData.currentPrice}/L
                </div>
              </div>

              {/* Our Cost */}
              <div className="bg-white rounded-lg p-4 border border-primary-200">
                <div className="text-sm text-neutral-600 mb-1">Eston Monthly Cost</div>
                <div className="text-2xl font-bold text-primary-600">
                  {formatCurrency(results.ourMonthlyCost)}
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  @ KES {results.ourPrice.toFixed(2)}/L
                </div>
              </div>
            </div>

            {/* Monthly Savings */}
            <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-5 border-2 border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-green-800">Monthly Savings</span>
                <span className="px-3 py-1 bg-green-200 text-green-800 text-xs font-bold rounded-full">
                  {results.savingsPercentage}% OFF
                </span>
              </div>
              <div className="text-3xl font-bold text-green-700">
                {formatCurrency(results.monthlySavings)}
              </div>
            </div>

            {/* Yearly Projection */}
            <div className="mt-4 bg-white rounded-lg p-5 border border-neutral-200">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-accent-500" />
                <span className="text-sm font-semibold text-secondary-900">Annual Savings Projection</span>
              </div>
              <div className="text-3xl font-bold text-accent-600">
                {formatCurrency(results.yearlySavings)}
              </div>
              <div className="text-xs text-neutral-600 mt-2">
                Based on consistent monthly volume
              </div>
            </div>
          </div>

          {/* Additional Benefits */}
          <div className="bg-secondary-50 rounded-lg p-4 border border-secondary-100">
            <h5 className="font-bold text-secondary-900 mb-3 text-sm">Additional Benefits:</h5>
            <ul className="space-y-2 text-sm text-neutral-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Bulk order discounts available for larger volumes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Free delivery within Nairobi CBD</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>24/7 emergency fuel supply</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Flexible payment terms for corporate clients</span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="flex gap-3 pt-4">
            <button className="flex-1 bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-all hover:shadow-lg">
              Request Quote
            </button>
            <button className="px-6 py-3 border-2 border-neutral-300 text-neutral-700 rounded-lg font-semibold hover:border-neutral-400 hover:bg-neutral-50 transition-all">
              Share Results
            </button>
          </div>
        </div>
      )}

      {!results && (
        <div className="text-center py-8 text-neutral-500">
          <Droplets className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Fill in the details above to see your potential savings</p>
        </div>
      )}
    </div>
  );
}