// src/components/dashboard/QuickOrderForm.js
'use client';

import { useState, useEffect } from 'react';
import { Package, Calendar, MapPin, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { getCurrentPrices } from '@/lib/priceService';
import { calculateBulkDiscount } from '@/lib/utils/discountCalculations';
import { calculateDeliveryCost } from '@/lib/utils/deliveryCalculations';

export default function QuickOrderForm({ onOrderCreated }) {
  const [prices, setPrices] = useState([]);
  const [formData, setFormData] = useState({
    fuelType: 'pms',
    quantity: 1000,
    deliveryAddress: '',
    deliveryDate: '',
  });
  const [orderSummary, setOrderSummary] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadPrices();
    // Set minimum delivery date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setFormData(prev => ({
      ...prev,
      deliveryDate: tomorrow.toISOString().split('T')[0]
    }));
  }, []);

  useEffect(() => {
    calculateOrderSummary();
  }, [formData, prices]);

  const loadPrices = async () => {
    const data = await getCurrentPrices();
    setPrices(data);
  };

  const calculateOrderSummary = () => {
    if (!prices.length || !formData.quantity) return;

    const selectedFuel = prices.find(p => p.id === formData.fuelType);
    if (!selectedFuel) return;

    const subtotal = formData.quantity * selectedFuel.price;
    const discount = calculateBulkDiscount(formData.quantity);
    const discountAmount = subtotal * (discount / 100);
    const deliveryCost = calculateDeliveryCost(formData.quantity, 'nairobi');
    const total = subtotal - discountAmount + deliveryCost;

    setOrderSummary({
      fuelTypeName: selectedFuel.name,
      pricePerLiter: selectedFuel.price,
      subtotal,
      discount,
      discountAmount,
      deliveryCost,
      total
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.deliveryAddress.trim()) {
      setStatus('error');
      setMessage('Please enter a delivery address');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const orderData = {
        ...formData,
        fuelTypeName: orderSummary.fuelTypeName,
        pricePerLiter: orderSummary.pricePerLiter,
        deliveryCost: orderSummary.deliveryCost,
        bulkDiscount: orderSummary.discount,
        bulkDiscountAmount: orderSummary.discountAmount,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Order placed successfully!');
        
        // Reset form
        setFormData(prev => ({
          ...prev,
          quantity: 1000,
          deliveryAddress: '',
        }));

        // Notify parent to refresh data
        if (onOrderCreated) {
          setTimeout(() => onOrderCreated(), 1000);
        }

        // Reset success message after 3 seconds
        setTimeout(() => {
          setStatus('idle');
          setMessage('');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to place order');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
      <div className="bg-gradient-to-r from-primary-500 to-blue-600 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Quick Order</h2>
            <p className="text-blue-100">Place a new fuel order</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Status Messages */}
        {status === 'success' && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-900">Success!</p>
              <p className="text-green-700 text-sm">{message}</p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <p className="text-red-700 text-sm">{message}</p>
          </div>
        )}

        {/* Fuel Type */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Fuel Type
          </label>
          <select
            value={formData.fuelType}
            onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
            className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
          >
            {prices.map(fuel => (
              <option key={fuel.id} value={fuel.id}>
                {fuel.name} - KES {fuel.price.toFixed(2)}/L
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Quantity (Liters)
          </label>
          <input
            type="number"
            min="100"
            step="100"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
          />
        </div>

        {/* Delivery Address */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Delivery Address
          </label>
          <textarea
            value={formData.deliveryAddress}
            onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
            rows="3"
            className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none"
            placeholder="Enter complete delivery address"
          />
        </div>

        {/* Delivery Date */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Delivery Date
          </label>
          <input
            type="date"
            value={formData.deliveryDate}
            onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
            min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
            className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
          />
        </div>

        {/* Order Summary */}
        {orderSummary && (
          <div className="bg-neutral-50 rounded-xl p-4 space-y-2">
            <h3 className="font-semibold text-secondary-900 mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-medium">KES {orderSummary.subtotal.toLocaleString()}</span>
              </div>
              {orderSummary.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Bulk Discount ({orderSummary.discount}%)</span>
                  <span className="font-medium">-KES {orderSummary.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-neutral-600">Delivery Cost</span>
                <span className="font-medium">KES {orderSummary.deliveryCost.toLocaleString()}</span>
              </div>
              <div className="border-t border-neutral-300 pt-2 flex justify-between text-lg">
                <span className="font-bold text-secondary-900">Total</span>
                <span className="font-bold text-primary-600">
                  KES {orderSummary.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Placing Order...
            </>
          ) : (
            <>
              <Package className="w-5 h-5" />
              Place Order
            </>
          )}
        </button>
      </form>
    </div>
  );
}