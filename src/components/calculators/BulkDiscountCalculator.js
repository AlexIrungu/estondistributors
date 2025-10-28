import { useState, useEffect } from 'react';
import { Percent, Package, TrendingUp, Zap } from 'lucide-react';

export default function BulkDiscountCalculator() {
  const [formData, setFormData] = useState({
    fuelType: 'pms',
    orderVolume: ''
  });

  const [results, setResults] = useState(null);

  // Base prices from EPRA
  const basePrices = {
    pms: 184.52,
    ago: 171.47,
    ik: 154.78
  };

  const fuelTypes = [
    { value: 'pms', label: 'Super Petrol (PMS)', icon: '⛽' },
    { value: 'ago', label: 'Diesel (AGO)', icon: '🚚' },
    { value: 'ik', label: 'Kerosene (IK)', icon: '🔥' }
  ];

  // Bulk discount tiers - Kenya industry standard
  const discountTiers = [
    { min: 0, max: 999, discount: 0, name: 'Standard', color: 'neutral' },
    { min: 1000, max: 4999, discount: 2.5, name: 'Bronze', color: 'amber' },
    { min: 5000, max: 9999, discount: 5, name: 'Silver', color: 'neutral' },
    { min: 10000, max: 24999, discount: 7.5, name: 'Gold', color: 'yellow' },
    { min: 25000, max: Infinity, discount: 10, name: 'Platinum', color: 'primary' }
  ];

  useEffect(() => {
    if (formData.orderVolume) {
      calculateDiscount();
    }
  }, [formData]);

  const calculateDiscount = () => {
    const volume = parseFloat(formData.orderVolume);
    
    if (!volume || volume <= 0) {
      setResults(null);
      return;
    }

    const basePrice = basePrices[formData.fuelType];
    const tier = discountTiers.find(t => volume >= t.min && volume <= t.max);
    
    const discountAmount = basePrice * (tier.discount / 100);
    const discountedPrice = basePrice - discountAmount;
    const totalBaseCost = basePrice * volume;
    const totalDiscountedCost = discountedPrice * volume;
    const totalSavings = totalBaseCost - totalDiscountedCost;

    // Calculate next tier info
    const currentTierIndex = discountTiers.indexOf(tier);
    const nextTier = currentTierIndex < discountTiers.length - 1 
      ? discountTiers[currentTierIndex + 1] 
      : null;
    
    const volumeToNextTier = nextTier ? nextTier.min - volume : 0;

    setResults({
      basePrice,
      discountedPrice,
      discountPercentage: tier.discount,
      tierName: tier.name,
      tierColor: tier.color,
      totalBaseCost,
      totalDiscountedCost,
      totalSavings,
      volume,
      nextTier,
      volumeToNextTier
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
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getTierColorClasses = (color) => {
    const colors = {
      neutral: 'bg-neutral-100 border-neutral-300 text-neutral-700',
      amber: 'bg-amber-100 border-amber-300 text-amber-800',
      yellow: 'bg-yellow-100 border-yellow-300 text-yellow-800',
      primary: 'bg-primary-100 border-primary-300 text-primary-800'
    };
    return colors[color] || colors.neutral;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
          <Percent className="w-6 h-6 text-accent-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-secondary-900">Bulk Discount Calculator</h3>
          <p className="text-sm text-neutral-600">Unlock savings with larger orders</p>
        </div>
      </div>

      {/* Discount Tiers Overview */}
      <div className="mb-8 bg-gradient-to-br from-neutral-50 to-primary-50 rounded-xl p-4 border border-neutral-200">
        <h4 className="text-sm font-bold text-secondary-900 mb-3">Our Discount Tiers</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {discountTiers.map((tier) => (
            <div
              key={tier.name}
              className={`p-3 rounded-lg border-2 text-center ${getTierColorClasses(tier.color)}`}
            >
              <div className="text-xs font-semibold mb-1">{tier.name}</div>
              <div className="text-xl font-bold">{tier.discount}%</div>
              <div className="text-xs mt-1 opacity-75">
                {tier.min.toLocaleString()}L+
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4 mb-8">
        {/* Fuel Type */}
        <div>
          <label className="block text-sm font-semibold text-secondary-900 mb-2">
            Select Fuel Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {fuelTypes.map(type => (
              <button
                key={type.value}
                onClick={() => setFormData(prev => ({ ...prev, fuelType: type.value }))}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.fuelType === type.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-300 bg-white hover:border-neutral-400'
                }`}
              >
                <div className="text-2xl mb-1">{type.icon}</div>
                <div className="font-semibold text-sm text-secondary-900">{type.label}</div>
                <div className="text-xs text-neutral-600 mt-1">
                  KES {basePrices[type.value].toFixed(2)}/L
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Order Volume */}
        <div>
          <label className="block text-sm font-semibold text-secondary-900 mb-2">
            Order Volume (Liters)
          </label>
          <div className="relative">
            <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="number"
              name="orderVolume"
              value={formData.orderVolume}
              onChange={handleInputChange}
              placeholder="Enter volume (e.g., 5000)"
              min="1"
              className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-lg"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-4">
          <div className="h-px bg-neutral-200"></div>

          {/* Current Tier Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 ${getTierColorClasses(results.tierColor)}`}>
            <Zap className="w-4 h-4" />
            <span className="font-bold">{results.tierName} Tier</span>
            <span className="font-bold text-lg">{results.discountPercentage}% OFF</span>
          </div>

          {/* Pricing Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Standard Price */}
            <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
              <div className="text-sm text-neutral-600 mb-2">Standard Price</div>
              <div className="text-2xl font-bold text-neutral-700 line-through opacity-60">
                {formatCurrency(results.basePrice)}
              </div>
              <div className="text-xs text-neutral-500 mt-1">per liter</div>
            </div>

            {/* Your Price */}
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-lg p-4 border-2 border-primary-200">
              <div className="text-sm text-primary-700 font-semibold mb-2">Your Discounted Price</div>
              <div className="text-3xl font-bold text-primary-600">
                {formatCurrency(results.discountedPrice)}
              </div>
              <div className="text-xs text-primary-600 font-semibold mt-1">
                per liter • Save {formatCurrency(results.basePrice - results.discountedPrice)}/L
              </div>
            </div>
          </div>

          {/* Total Cost Comparison */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
            <h4 className="font-bold text-green-800 mb-4 text-lg">Order Summary</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-green-200">
                <span className="text-neutral-700">Volume:</span>
                <span className="font-bold text-lg">{results.volume.toLocaleString()} L</span>
              </div>
              
              <div className="flex justify-between items-center pb-3 border-b border-green-200">
                <span className="text-neutral-700">Without Discount:</span>
                <span className="font-semibold text-neutral-600 line-through">
                  {formatCurrency(results.totalBaseCost)}
                </span>
              </div>
              
              <div className="flex justify-between items-center pb-3 border-b border-green-200">
                <span className="text-neutral-700">With {results.discountPercentage}% Discount:</span>
                <span className="font-bold text-xl text-green-700">
                  {formatCurrency(results.totalDiscountedCost)}
                </span>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-green-800">Total Savings:</span>
                <span className="font-bold text-2xl text-green-700">
                  {formatCurrency(results.totalSavings)}
                </span>
              </div>
            </div>
          </div>

          {/* Next Tier Incentive */}
          {results.nextTier && (
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="font-bold text-amber-900 mb-1">Unlock Higher Savings!</h5>
                  <p className="text-sm text-amber-800">
                    Order <span className="font-bold">{results.volumeToNextTier.toLocaleString()} more liters</span> to reach 
                    <span className="font-bold"> {results.nextTier.name} tier</span> and get 
                    <span className="font-bold"> {results.nextTier.discount}% discount</span>
                  </p>
                  <p className="text-xs text-amber-700 mt-2">
                    Extra savings: {formatCurrency((results.nextTier.discount - results.discountPercentage) * results.basePrice * results.volume / 100)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex gap-3 pt-4">
            <button className="flex-1 bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-all hover:shadow-lg">
              Place Order
            </button>
            <button className="px-6 py-3 border-2 border-neutral-300 text-neutral-700 rounded-lg font-semibold hover:border-neutral-400 hover:bg-neutral-50 transition-all">
              Get Quote
            </button>
          </div>
        </div>
      )}

      {!results && (
        <div className="text-center py-8 text-neutral-500">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Enter your order volume to calculate bulk discounts</p>
        </div>
      )}
    </div>
  );
}