import { useState, useEffect } from 'react';
import { MapPin, Truck, Clock, Check } from 'lucide-react';

export default function DeliveryCostEstimator() {
  const [formData, setFormData] = useState({
    deliveryZone: '',
    orderVolume: '',
    urgency: 'standard'
  });

  const [results, setResults] = useState(null);

  // Delivery zones for Nairobi and surrounding areas
  const deliveryZones = [
    {
      id: 'nairobi-cbd',
      name: 'Nairobi CBD',
      baseCost: 0,
      description: 'Within city center',
      areas: 'City Center, Westlands, Kilimani, Upper Hill',
      deliveryTime: '2-4 hours',
      color: 'primary'
    },
    {
      id: 'nairobi-inner',
      name: 'Nairobi Inner Suburbs',
      baseCost: 2000,
      description: 'Within 10km radius',
      areas: 'Karen, Lavington, Parklands, South C, Donholm',
      deliveryTime: '4-6 hours',
      color: 'accent'
    },
    {
      id: 'nairobi-outer',
      name: 'Nairobi Outer Suburbs',
      baseCost: 3500,
      description: '10-25km radius',
      areas: 'Ruiru, Ngong, Rongai, Kitengela, Ruaka',
      deliveryTime: '6-8 hours',
      color: 'amber'
    },
    {
      id: 'kiambu-county',
      name: 'Kiambu County',
      baseCost: 5000,
      description: 'Beyond 25km',
      areas: 'Thika, Kikuyu, Limuru, Kiambu Town',
      deliveryTime: '8-12 hours',
      color: 'orange'
    },
    {
      id: 'regional',
      name: 'Regional Delivery',
      baseCost: 8000,
      description: 'Other counties',
      areas: 'Nakuru, Mombasa, Kisumu, Eldoret, etc.',
      deliveryTime: '1-2 days',
      color: 'red'
    }
  ];

  const urgencyOptions = [
    { value: 'standard', label: 'Standard Delivery', multiplier: 1, description: 'Normal business hours' },
    { value: 'express', label: 'Express Delivery', multiplier: 1.5, description: 'Priority service' },
    { value: 'emergency', label: 'Emergency 24/7', multiplier: 2, description: 'Immediate response' }
  ];

  // Volume-based delivery discounts
  const getVolumeDiscount = (volume) => {
    if (volume >= 25000) return 0.30; // 30% off
    if (volume >= 10000) return 0.20; // 20% off
    if (volume >= 5000) return 0.10;  // 10% off
    return 0;
  };

  useEffect(() => {
    if (formData.deliveryZone && formData.orderVolume) {
      calculateDeliveryCost();
    }
  }, [formData]);

  const calculateDeliveryCost = () => {
    const zone = deliveryZones.find(z => z.id === formData.deliveryZone);
    const urgency = urgencyOptions.find(u => u.value === formData.urgency);
    const volume = parseFloat(formData.orderVolume);

    if (!zone || !volume) {
      setResults(null);
      return;
    }

    // Base delivery cost
    let deliveryCost = zone.baseCost;

    // Apply urgency multiplier
    deliveryCost *= urgency.multiplier;

    // Calculate volume discount
    const volumeDiscountPercent = getVolumeDiscount(volume);
    const volumeDiscount = deliveryCost * volumeDiscountPercent;
    const finalDeliveryCost = Math.max(0, deliveryCost - volumeDiscount);

    // Free delivery for CBD orders over 5000L
    const isFreeDelivery = zone.id === 'nairobi-cbd' && volume >= 5000;

    setResults({
      zone,
      urgency,
      volume,
      baseDeliveryCost: zone.baseCost,
      urgencyMultiplier: urgency.multiplier,
      urgencyCost: deliveryCost,
      volumeDiscountPercent,
      volumeDiscount,
      finalDeliveryCost: isFreeDelivery ? 0 : finalDeliveryCost,
      isFreeDelivery,
      deliveryTime: zone.deliveryTime
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
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getZoneColorClasses = (color) => {
    const colors = {
      primary: 'bg-primary-50 border-primary-200 text-primary-700',
      accent: 'bg-accent-50 border-accent-200 text-accent-700',
      amber: 'bg-amber-50 border-amber-200 text-amber-700',
      orange: 'bg-orange-50 border-orange-200 text-orange-700',
      red: 'bg-red-50 border-red-200 text-red-700'
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <Truck className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-secondary-900">Delivery Cost Estimator</h3>
          <p className="text-sm text-neutral-600">Calculate delivery fees for your location</p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-5 mb-8">
        {/* Delivery Zone */}
        <div>
          <label className="block text-sm font-semibold text-secondary-900 mb-3">
            Select Delivery Zone
          </label>
          <div className="space-y-2">
            {deliveryZones.map(zone => (
              <button
                key={zone.id}
                onClick={() => setFormData(prev => ({ ...prev, deliveryZone: zone.id }))}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  formData.deliveryZone === zone.id
                    ? getZoneColorClasses(zone.color) + ' border-opacity-100'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4" />
                      <span className="font-bold">{zone.name}</span>
                      {zone.baseCost === 0 && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                          FREE
                        </span>
                      )}
                    </div>
                    <p className="text-xs opacity-75 mb-1">{zone.areas}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {zone.deliveryTime}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    {zone.baseCost === 0 ? (
                      <span className="text-sm font-bold text-green-600">FREE*</span>
                    ) : (
                      <span className="text-sm font-bold">{formatCurrency(zone.baseCost)}</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-neutral-500 mt-2">
            * Free delivery for CBD orders of 5,000L or more
          </p>
        </div>

        {/* Order Volume */}
        <div>
          <label className="block text-sm font-semibold text-secondary-900 mb-2">
            Order Volume (Liters)
          </label>
          <input
            type="number"
            name="orderVolume"
            value={formData.orderVolume}
            onChange={handleInputChange}
            placeholder="Enter volume (e.g., 5000)"
            min="1"
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
          />
          <p className="text-xs text-neutral-500 mt-1">
            Higher volumes may qualify for delivery discounts
          </p>
        </div>

        {/* Urgency Level */}
        <div>
          <label className="block text-sm font-semibold text-secondary-900 mb-2">
            Delivery Urgency
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {urgencyOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setFormData(prev => ({ ...prev, urgency: option.value }))}
                className={`p-3 rounded-lg border-2 transition-all ${
                  formData.urgency === option.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-300 bg-white hover:border-neutral-400'
                }`}
              >
                <div className="font-semibold text-sm mb-1">{option.label}</div>
                <div className="text-xs text-neutral-600">{option.description}</div>
                {option.multiplier > 1 && (
                  <div className="text-xs text-amber-600 font-semibold mt-1">
                    +{((option.multiplier - 1) * 100)}% fee
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-4">
          <div className="h-px bg-neutral-200"></div>

          {results.isFreeDelivery ? (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-700" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-green-800">Free Delivery!</h4>
                  <p className="text-sm text-green-700">CBD orders over 5,000L qualify</p>
                </div>
              </div>
              <div className="text-4xl font-bold text-green-700 mb-2">
                {formatCurrency(0)}
              </div>
              <p className="text-sm text-green-700">
                Estimated delivery: {results.deliveryTime}
              </p>
            </div>
          ) : (
            <>
              {/* Cost Breakdown */}
              <div className="bg-neutral-50 rounded-xl p-5 border border-neutral-200 space-y-3">
                <h4 className="font-bold text-secondary-900 mb-3">Cost Breakdown</h4>
                
                <div className="flex justify-between items-center text-sm pb-2 border-b border-neutral-200">
                  <span className="text-neutral-700">Base Delivery ({results.zone.name}):</span>
                  <span className="font-semibold">{formatCurrency(results.baseDeliveryCost)}</span>
                </div>

                {results.urgencyMultiplier > 1 && (
                  <div className="flex justify-between items-center text-sm pb-2 border-b border-neutral-200">
                    <span className="text-neutral-700">{results.urgency.label} Fee:</span>
                    <span className="font-semibold text-amber-600">
                      +{formatCurrency(results.urgencyCost - results.baseDeliveryCost)}
                    </span>
                  </div>
                )}

                {results.volumeDiscountPercent > 0 && (
                  <div className="flex justify-between items-center text-sm pb-2 border-b border-neutral-200">
                    <span className="text-neutral-700">
                      Volume Discount ({(results.volumeDiscountPercent * 100).toFixed(0)}%):
                    </span>
                    <span className="font-semibold text-green-600">
                      -{formatCurrency(results.volumeDiscount)}
                    </span>
                  </div>
                )}
              </div>

              {/* Final Cost */}
              <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6 border-2 border-primary-200">
                <div className="flex items-baseline justify-between mb-3">
                  <span className="text-lg font-semibold text-secondary-900">Total Delivery Cost</span>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary-600">
                      {formatCurrency(results.finalDeliveryCost)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Clock className="w-4 h-4" />
                  <span>Estimated delivery: {results.deliveryTime}</span>
                </div>
              </div>
            </>
          )}

          {/* Additional Info */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h5 className="font-bold text-blue-900 mb-2 text-sm">Delivery Benefits:</h5>
            <ul className="space-y-1.5 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">✓</span>
                <span>Professional drivers and modern fleet</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">✓</span>
                <span>Real-time delivery tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">✓</span>
                <span>Insurance coverage on all deliveries</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">✓</span>
                <span>24/7 emergency delivery available</span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="flex gap-3 pt-4">
            <button className="flex-1 bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-all hover:shadow-lg">
              Schedule Delivery
            </button>
            <button className="px-6 py-3 border-2 border-neutral-300 text-neutral-700 rounded-lg font-semibold hover:border-neutral-400 hover:bg-neutral-50 transition-all">
              Get Quote
            </button>
          </div>
        </div>
      )}

      {!results && (
        <div className="text-center py-8 text-neutral-500">
          <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Select your location and volume to estimate delivery costs</p>
        </div>
      )}
    </div>
  );
}