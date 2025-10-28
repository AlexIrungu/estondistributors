'use client';

import { useState } from 'react';
import { Bell, Mail, Phone, Check, AlertCircle, Loader2 } from 'lucide-react';

export default function PriceAlertForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    fuelTypes: ['pms'],
    locations: ['nairobi'],
    alertTypes: ['price_increase', 'significant_change'],
    threshold: 5,
    emailEnabled: true,
    smsEnabled: false,
  });

  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/alerts/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Subscription successful! Check your email.');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          fuelTypes: ['pms'],
          locations: ['nairobi'],
          alertTypes: ['price_increase', 'significant_change'],
          threshold: 5,
          emailEnabled: true,
          smsEnabled: false,
        });
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleMultiSelect = (name, value) => {
    setFormData(prev => {
      const current = prev[name];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      
      // Ensure at least one is selected
      return {
        ...prev,
        [name]: updated.length > 0 ? updated : current,
      };
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-blue-600 p-8 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold">Price Alert Subscription</h2>
        </div>
        <p className="text-blue-100 text-lg">
          Get notified instantly when fuel prices change
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {/* Status Messages */}
        {status === 'success' && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-start gap-3">
            <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-900">Success!</p>
              <p className="text-green-700 text-sm mt-1">{message}</p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-red-700 text-sm mt-1">{message}</p>
            </div>
          </div>
        )}

        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-secondary-900 flex items-center gap-2">
            <span className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 text-sm font-bold">
              1
            </span>
            Personal Information
          </h3>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              Phone Number (Optional for SMS)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
              placeholder="+254 700 000 000"
            />
            <p className="text-xs text-neutral-500 mt-1">
              Format: 07XX XXX XXX or +254 7XX XXX XXX
            </p>
          </div>
        </div>

        {/* Fuel Types */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-secondary-900 flex items-center gap-2">
            <span className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 text-sm font-bold">
              2
            </span>
            Select Fuel Types
          </h3>

          <div className="grid md:grid-cols-3 gap-3">
            {[
              { value: 'pms', label: 'Super Petrol' },
              { value: 'ago', label: 'Diesel' },
              { value: 'ik', label: 'Kerosene' },
            ].map(fuel => (
              <button
                key={fuel.value}
                type="button"
                onClick={() => handleMultiSelect('fuelTypes', fuel.value)}
                className={`p-4 border-2 rounded-lg font-medium transition-all ${
                  formData.fuelTypes.includes(fuel.value)
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-neutral-300 hover:border-neutral-400'
                }`}
              >
                {fuel.label}
              </button>
            ))}
          </div>
        </div>

        {/* Locations */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-secondary-900 flex items-center gap-2">
            <span className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 text-sm font-bold">
              3
            </span>
            Select Locations
          </h3>

          <div className="grid md:grid-cols-2 gap-3">
            {[
              { value: 'nairobi', label: 'Nairobi' },
              { value: 'mombasa', label: 'Mombasa' },
            ].map(location => (
              <button
                key={location.value}
                type="button"
                onClick={() => handleMultiSelect('locations', location.value)}
                className={`p-4 border-2 rounded-lg font-medium transition-all ${
                  formData.locations.includes(location.value)
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-neutral-300 hover:border-neutral-400'
                }`}
              >
                {location.label}
              </button>
            ))}
          </div>
        </div>

        {/* Alert Types */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-secondary-900 flex items-center gap-2">
            <span className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 text-sm font-bold">
              4
            </span>
            Alert Preferences
          </h3>

          <div className="space-y-3">
            {[
              { value: 'price_increase', label: 'Price Increases', desc: 'When prices go up' },
              { value: 'price_decrease', label: 'Price Decreases', desc: 'When prices go down' },
              { value: 'significant_change', label: 'Significant Changes', desc: 'Changes over 10%' },
            ].map(alert => (
              <label
                key={alert.value}
                className="flex items-center gap-3 p-4 border-2 border-neutral-300 rounded-lg hover:border-primary-300 cursor-pointer transition-all"
              >
                <input
                  type="checkbox"
                  checked={formData.alertTypes.includes(alert.value)}
                  onChange={() => handleMultiSelect('alertTypes', alert.value)}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-200"
                />
                <div>
                  <div className="font-semibold text-neutral-900">{alert.label}</div>
                  <div className="text-sm text-neutral-600">{alert.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Threshold */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-secondary-900 flex items-center gap-2">
            <span className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 text-sm font-bold">
              5
            </span>
            Alert Threshold
          </h3>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              Minimum price change to trigger alert: <strong>{formData.threshold}%</strong>
            </label>
            <input
              type="range"
              name="threshold"
              min="1"
              max="20"
              value={formData.threshold}
              onChange={handleChange}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
            <div className="flex justify-between text-xs text-neutral-500 mt-1">
              <span>1%</span>
              <span>10%</span>
              <span>20%</span>
            </div>
          </div>
        </div>

        {/* Notification Methods */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-secondary-900 flex items-center gap-2">
            <span className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 text-sm font-bold">
              6
            </span>
            Notification Method
          </h3>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 border-2 border-neutral-300 rounded-lg hover:border-primary-300 cursor-pointer transition-all">
              <input
                type="checkbox"
                name="emailEnabled"
                checked={formData.emailEnabled}
                onChange={handleChange}
                className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-200"
              />
              <Mail className="w-5 h-5 text-primary-600" />
              <div>
                <div className="font-semibold text-neutral-900">Email Alerts</div>
                <div className="text-sm text-neutral-600">Receive detailed email notifications</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border-2 border-neutral-300 rounded-lg hover:border-primary-300 cursor-pointer transition-all">
              <input
                type="checkbox"
                name="smsEnabled"
                checked={formData.smsEnabled}
                onChange={handleChange}
                className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-200"
              />
              <Phone className="w-5 h-5 text-primary-600" />
              <div>
                <div className="font-semibold text-neutral-900">SMS Alerts</div>
                <div className="text-sm text-neutral-600">Instant text message notifications</div>
              </div>
            </label>
          </div>

          {formData.smsEnabled && !formData.phone && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-3 text-sm text-amber-800">
              ⚠️ Please add your phone number above to receive SMS alerts
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-primary-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-600 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-xl flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Subscribing...
              </>
            ) : (
              <>
                <Bell className="w-5 h-5" />
                Subscribe to Alerts
              </>
            )}
          </button>

          <p className="text-xs text-neutral-500 text-center mt-3">
            By subscribing, you agree to receive price notifications. You can unsubscribe anytime.
          </p>
        </div>
      </form>
    </div>
  );
}