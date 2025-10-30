// src/components/dashboard/QuickOrderForm.js
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Package, Calendar, MapPin, Loader2, CheckCircle, 
  AlertCircle, Info, TruckIcon, Tag, ArrowRight, X, Mail 
} from 'lucide-react';
import { getCurrentPrices } from '@/lib/priceService';
import { calculateBulkDiscount } from '@/lib/utils/discountCalculations';
import { calculateDeliveryCost } from '@/lib/utils/deliveryCalculations';

export default function QuickOrderForm({ onOrderCreated }) {
  const { data: session } = useSession();
  const [prices, setPrices] = useState([]);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [formData, setFormData] = useState({
    fuelType: 'pms',
    quantity: 1000,
    deliveryAddress: '',
    deliveryDate: '',
    deliveryZone: 'nairobi-cbd',
    urgency: 'standard',
    notes: ''
  });
  const [orderSummary, setOrderSummary] = useState(null);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [showFullForm, setShowFullForm] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadPrices();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setFormData(prev => ({
      ...prev,
      deliveryDate: tomorrow.toISOString().split('T')[0]
    }));
  }, []);

  useEffect(() => {
    if (prices.length > 0) {
      calculateOrderSummary();
    }
  }, [formData, prices]);

  const loadPrices = async () => {
    try {
      setLoadingPrices(true);
      const data = await getCurrentPrices();
      
      if (Array.isArray(data)) {
        setPrices(data);
      } else if (data && Array.isArray(data.prices)) {
        setPrices(data.prices);
      } else {
        console.error('Invalid prices data:', data);
        setPrices([]);
      }
    } catch (error) {
      console.error('Error loading prices:', error);
      setPrices([]);
    } finally {
      setLoadingPrices(false);
    }
  };

  const calculateOrderSummary = () => {
    if (!prices.length || !formData.quantity) return;

    const selectedFuel = prices.find(p => p.id === formData.fuelType);
    if (!selectedFuel) return;

    try {
      const subtotal = formData.quantity * selectedFuel.price;
      
      const discountResult = calculateBulkDiscount(selectedFuel.price, formData.quantity);
      const discount = discountResult.discountPercentage || 0;
      const discountAmount = discountResult.totalSavings || 0;
      
      const deliveryCalc = calculateDeliveryCost(
        formData.deliveryZone,
        formData.quantity,
        formData.urgency
      );
      
      const total = subtotal - discountAmount + deliveryCalc.finalDeliveryCost;

      setOrderSummary({
        fuelTypeName: selectedFuel.name,
        pricePerLiter: selectedFuel.price,
        subtotal,
        discount,
        discountAmount,
        deliveryCost: deliveryCalc.finalDeliveryCost,
        deliveryDetails: deliveryCalc,
        total
      });
    } catch (error) {
      console.error('Error calculating order summary:', error);
      const subtotal = formData.quantity * selectedFuel.price;
      const discount = calculateBulkDiscount(formData.quantity);
      const discountAmount = subtotal * (discount / 100);
      const fallbackDeliveryCost = 2000;
      
      setOrderSummary({
        fuelTypeName: selectedFuel.name,
        pricePerLiter: selectedFuel.price,
        subtotal,
        discount,
        discountAmount,
        deliveryCost: fallbackDeliveryCost,
        total: subtotal - discountAmount + fallbackDeliveryCost
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery address is required';
    } else if (formData.deliveryAddress.trim().length < 10) {
      newErrors.deliveryAddress = 'Please enter a complete address';
    }

    if (!formData.deliveryDate) {
      newErrors.deliveryDate = 'Delivery date is required';
    }

    if (formData.quantity < 100) {
      newErrors.quantity = 'Minimum order is 100 liters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setStatus('error');
      setMessage('Please fix the errors below');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      // Step 1: Save order to database
      const orderData = {
        fuelType: formData.fuelType,
        fuelTypeName: orderSummary.fuelTypeName,
        quantity: formData.quantity,
        pricePerLiter: orderSummary.pricePerLiter,
        subtotal: orderSummary.subtotal,
        totalCost: orderSummary.total,
        deliveryAddress: formData.deliveryAddress,
        deliveryZone: formData.deliveryZone || 'Zone A',
        deliveryCost: orderSummary.deliveryCost,
        deliveryDate: formData.deliveryDate,
        deliveryTime: 'morning',
        bulkDiscount: orderSummary.discount || 0,
        bulkDiscountAmount: orderSummary.discountAmount || 0,
        specialInstructions: formData.notes,
      };

      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const orderResult = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderResult.error || 'Failed to place order');
      }

      // Step 2: Send email notifications (don't block on failure)
      try {
        await fetch('/api/orders/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order: {
              ...orderData,
              id: orderResult.order?.id || orderResult.order?._id,
              status: orderResult.order?.status || 'pending',
              createdAt: orderResult.order?.createdAt || new Date().toISOString(),
            },
            customerEmail: session?.user?.email,
            customerName: session?.user?.name,
          }),
        });
        
        setStatus('success');
        setMessage(`Order #${orderResult.order?.id || 'NEW'} placed successfully! Confirmation email sent.`);
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
        // Still show success since order was saved
        setStatus('success');
        setMessage(`Order #${orderResult.order?.id || 'NEW'} placed successfully! (Email notification pending)`);
      }

      // Reset form
      setFormData(prev => ({
        ...prev,
        quantity: 1000,
        deliveryAddress: '',
        notes: ''
      }));
      setErrors({});

      // Notify parent to refresh data
      if (onOrderCreated) {
        setTimeout(() => onOrderCreated(), 1000);
      }

      // Reset success message after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);

    } catch (error) {
      console.error('Order submission error:', error);
      setStatus('error');
      setMessage(error.message || 'Network error. Please try again.');
    }
  };

  const getFuelIcon = (fuelType) => {
    const icons = {
      pms: '⛽',
      ago: '🚚',
      ik: '🔥'
    };
    return icons[fuelType] || '⛽';
  };

  // Loading state
  if (loadingPrices) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="bg-primary-500 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Quick Order</h2>
              <p className="text-primary-100">Place a new fuel order</p>
            </div>
          </div>
        </div>
        <div className="p-12 text-center">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin mx-auto mb-3" />
          <p className="text-neutral-600">Loading current prices...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!prices || prices.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="bg-primary-500 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Quick Order</h2>
              <p className="text-primary-100">Place a new fuel order</p>
            </div>
          </div>
        </div>
        <div className="p-12 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-neutral-900 font-semibold mb-2">Unable to load prices</p>
          <p className="text-neutral-600 text-sm mb-4">Please check your connection and try again</p>
          <button
            onClick={loadPrices}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Loader2 className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
      {/* Header */}
      <div className="bg-primary-500 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Quick Order</h2>
              <p className="text-primary-100">Place a new fuel order in minutes</p>
            </div>
          </div>
          {!showFullForm && (
            <button
              onClick={() => setShowFullForm(true)}
              className="text-white hover:text-primary-100 transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Status Messages */}
        {status === 'success' && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-green-900 flex items-center gap-2">
                Order Placed Successfully!
                <Mail className="w-4 h-4" />
              </p>
              <p className="text-green-700 text-sm mt-1">{message}</p>
            </div>
            <button
              onClick={() => setStatus('idle')}
              className="text-green-600 hover:text-green-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-red-700 text-sm mt-1">{message}</p>
            </div>
            <button
              onClick={() => setStatus('idle')}
              className="text-red-600 hover:text-red-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Fuel Type Selection - Visual Cards */}
        <div>
          <label className="block text-sm font-semibold text-secondary-900 mb-3">
            Select Fuel Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {prices.map(fuel => (
              <button
                key={fuel.id}
                type="button"
                onClick={() => setFormData({ ...formData, fuelType: fuel.id })}
                className={`relative p-4 border-2 rounded-xl text-left transition-all hover:shadow-md ${
                  formData.fuelType === fuel.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-200 hover:border-primary-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-3xl">{getFuelIcon(fuel.id)}</span>
                  {formData.fuelType === fuel.id && (
                    <CheckCircle className="w-5 h-5 text-primary-500" />
                  )}
                </div>
                <p className="font-semibold text-secondary-900 text-sm mb-1">{fuel.name}</p>
                <p className="text-primary-600 font-bold">
                  KES {fuel.price.toFixed(2)}<span className="text-xs text-neutral-600">/L</span>
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Quantity Slider with Presets */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-secondary-900">
              Quantity (Liters)
            </label>
            <span className="text-2xl font-bold text-primary-600">
              {formData.quantity.toLocaleString()}L
            </span>
          </div>
          
          {/* Quick Presets */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[500, 1000, 2000, 5000].map(qty => (
              <button
                key={qty}
                type="button"
                onClick={() => setFormData({ ...formData, quantity: qty })}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  formData.quantity === qty
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {qty.toLocaleString()}L
              </button>
            ))}
          </div>

          <input
            type="range"
            min="100"
            max="10000"
            step="100"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
            className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
          />
          
          <div className="flex items-center gap-2 mt-2">
            <input
              type="number"
              min="100"
              step="100"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
              className={`flex-1 px-4 py-2 border-2 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none ${
                errors.quantity ? 'border-red-500' : 'border-neutral-300'
              }`}
            />
            <span className="text-sm text-neutral-600">liters</span>
          </div>
          {errors.quantity && (
            <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.quantity}
            </p>
          )}
        </div>

        {/* Bulk Discount Info */}
        {orderSummary && orderSummary.discount > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
            <Tag className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-900 text-sm">
                Bulk Discount Applied! 🎉
              </p>
              <p className="text-green-700 text-xs mt-1">
                You're saving {orderSummary.discount}% (KES {orderSummary.discountAmount.toLocaleString()}) on this order
              </p>
            </div>
          </div>
        )}

        {/* Delivery Address */}
        <div>
          <label className="block text-sm font-semibold text-secondary-900 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Delivery Address
          </label>
          <textarea
            value={formData.deliveryAddress}
            onChange={(e) => {
              setFormData({ ...formData, deliveryAddress: e.target.value });
              setErrors({ ...errors, deliveryAddress: '' });
            }}
            rows="3"
            className={`w-full px-4 py-3 border-2 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none ${
              errors.deliveryAddress ? 'border-red-500' : 'border-neutral-300'
            }`}
            placeholder="Enter complete delivery address (building, street, area, city)"
          />
          {errors.deliveryAddress && (
            <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.deliveryAddress}
            </p>
          )}
        </div>

        {/* Delivery Date */}
        <div>
          <label className="block text-sm font-semibold text-secondary-900 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Preferred Delivery Date
          </label>
          <input
            type="date"
            value={formData.deliveryDate}
            onChange={(e) => {
              setFormData({ ...formData, deliveryDate: e.target.value });
              setErrors({ ...errors, deliveryDate: '' });
            }}
            min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none ${
              errors.deliveryDate ? 'border-red-500' : 'border-neutral-300'
            }`}
          />
          {errors.deliveryDate && (
            <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.deliveryDate}
            </p>
          )}
          <p className="text-xs text-neutral-600 mt-1 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Delivery available within 24-48 hours from order date
          </p>
        </div>

        {/* Additional Notes (Optional) */}
        <div>
          <label className="block text-sm font-semibold text-secondary-900 mb-2">
            Additional Notes <span className="text-neutral-500 font-normal">(Optional)</span>
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows="2"
            className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none"
            placeholder="Any special instructions for delivery..."
          />
        </div>

        {/* Order Summary Card */}
        {orderSummary && (
          <div className="bg-neutral-50 border-2 border-neutral-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <TruckIcon className="w-5 h-5 text-primary-500" />
              <h3 className="font-bold text-secondary-900">Order Summary</h3>
            </div>
            
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">
                  {orderSummary.fuelTypeName} ({formData.quantity.toLocaleString()}L)
                </span>
                <span className="font-medium">KES {orderSummary.subtotal.toLocaleString()}</span>
              </div>
              
              {orderSummary.discount > 0 && (
                <div className="flex justify-between items-center text-green-600">
                  <span className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    Bulk Discount ({orderSummary.discount}%)
                  </span>
                  <span className="font-medium">-KES {orderSummary.discountAmount.toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-neutral-600 flex items-center gap-1">
                  <TruckIcon className="w-4 h-4" />
                  Delivery Cost
                  {orderSummary.deliveryDetails?.isFreeDelivery && (
                    <span className="text-green-600 text-xs font-semibold ml-1">FREE</span>
                  )}
                </span>
                <span className="font-medium">
                  {orderSummary.deliveryDetails?.isFreeDelivery ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    `KES ${orderSummary.deliveryCost.toLocaleString()}`
                  )}
                </span>
              </div>
              
              <div className="border-t-2 border-neutral-300 pt-3 flex justify-between items-center">
                <span className="font-bold text-secondary-900 text-base">Total Amount</span>
                <span className="font-bold text-primary-600 text-2xl">
                  KES {orderSummary.total.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2 mt-4">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800">
                Price includes all taxes. You'll receive email confirmation with order tracking number. Payment on delivery.
              </p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-primary-500 text-white py-4 rounded-xl font-bold hover:bg-primary-600 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:shadow-none text-lg"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing Order...
            </>
          ) : (
            <>
              <Package className="w-5 h-5" />
              Place Order - KES {orderSummary?.total.toLocaleString() || 0}
            </>
          )}
        </button>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-6 pt-4 border-t border-neutral-200">
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Quality Assured</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <Mail className="w-4 h-4 text-blue-500" />
            <span>Email Confirmation</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <TruckIcon className="w-4 h-4 text-orange-500" />
            <span>Fast Delivery</span>
          </div>
        </div>
      </form>
    </div>
  );
}