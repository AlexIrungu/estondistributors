'use client';

import { useState, useEffect } from 'react';
import { Settings, Mail, Phone, Pause, Play, Trash2, Check, AlertCircle, Loader2 } from 'lucide-react';

export default function AlertPreferences({ subscriptionId }) {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (subscriptionId) {
      loadSubscription();
    }
  }, [subscriptionId]);

  const loadSubscription = async () => {
    try {
      const response = await fetch(`/api/alerts?id=${subscriptionId}`);
      const data = await response.json();
      
      if (response.ok) {
        setSubscription(data);
      } else {
        setStatus('error');
        setMessage('Subscription not found');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to load subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updates) => {
    setSaving(true);
    setStatus('idle');

    try {
      const response = await fetch('/api/alerts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: subscriptionId,
          ...updates,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubscription(data.subscription);
        setStatus('success');
        setMessage('Preferences updated successfully');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to update preferences');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePause = () => {
    handleUpdate({ action: 'pause' });
  };

  const handleResume = () => {
    handleUpdate({ action: 'resume' });
  };

  const handleUnsubscribe = async () => {
    if (!confirm('Are you sure you want to unsubscribe from price alerts?')) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/alerts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: subscriptionId,
          action: 'unsubscribe',
        }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Successfully unsubscribed from alerts');
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        setStatus('error');
        setMessage('Failed to unsubscribe');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handlePreferenceChange = (key, value) => {
    setSubscription(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value,
      }
    }));
  };

  const handleMultiSelectChange = (key, value) => {
    setSubscription(prev => {
      const current = prev.preferences[key];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      
      return {
        ...prev,
        preferences: {
          ...prev.preferences,
          [key]: updated.length > 0 ? updated : current,
        }
      };
    });
  };

  const savePreferences = () => {
    handleUpdate({ preferences: subscription.preferences });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary-500 mx-auto mb-4" />
        <p className="text-neutral-600">Loading subscription...</p>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-neutral-600">Subscription not found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-blue-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Alert Preferences</h2>
              <p className="text-blue-100 text-sm">{subscription.email}</p>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
            subscription.status === 'active' ? 'bg-green-100 text-green-700' :
            subscription.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
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

        {/* Subscription Info */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-neutral-50 rounded-xl p-4">
            <p className="text-sm text-neutral-600 mb-1">Alerts Received</p>
            <p className="text-2xl font-bold text-secondary-900">{subscription.alertCount}</p>
          </div>
          <div className="bg-neutral-50 rounded-xl p-4">
            <p className="text-sm text-neutral-600 mb-1">Last Alert</p>
            <p className="text-sm font-semibold text-secondary-900">
              {subscription.lastAlertSent 
                ? new Date(subscription.lastAlertSent).toLocaleDateString()
                : 'Never'}
            </p>
          </div>
          <div className="bg-neutral-50 rounded-xl p-4">
            <p className="text-sm text-neutral-600 mb-1">Member Since</p>
            <p className="text-sm font-semibold text-secondary-900">
              {new Date(subscription.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Fuel Types */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-secondary-900">Fuel Types</h3>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { value: 'pms', label: 'Super Petrol' },
              { value: 'ago', label: 'Diesel' },
              { value: 'ik', label: 'Kerosene' },
            ].map(fuel => (
              <button
                key={fuel.value}
                type="button"
                onClick={() => handleMultiSelectChange('fuelTypes', fuel.value)}
                className={`p-3 border-2 rounded-lg font-medium transition-all ${
                  subscription.preferences.fuelTypes.includes(fuel.value)
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
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-secondary-900">Locations</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { value: 'nairobi', label: 'Nairobi' },
              { value: 'mombasa', label: 'Mombasa' },
            ].map(location => (
              <button
                key={location.value}
                type="button"
                onClick={() => handleMultiSelectChange('locations', location.value)}
                className={`p-3 border-2 rounded-lg font-medium transition-all ${
                  subscription.preferences.locations.includes(location.value)
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
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-secondary-900">Alert Types</h3>
          <div className="space-y-2">
            {[
              { value: 'price_increase', label: 'Price Increases' },
              { value: 'price_decrease', label: 'Price Decreases' },
              { value: 'significant_change', label: 'Significant Changes (10%+)' },
            ].map(alert => (
              <label
                key={alert.value}
                className="flex items-center gap-3 p-3 border-2 border-neutral-300 rounded-lg hover:border-primary-300 cursor-pointer transition-all"
              >
                <input
                  type="checkbox"
                  checked={subscription.preferences.alertTypes.includes(alert.value)}
                  onChange={() => handleMultiSelectChange('alertTypes', alert.value)}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-200"
                />
                <span className="font-medium text-neutral-900">{alert.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Threshold */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-secondary-900">
            Alert Threshold: {subscription.preferences.threshold}%
          </h3>
          <input
            type="range"
            min="1"
            max="20"
            value={subscription.preferences.threshold}
            onChange={(e) => handlePreferenceChange('threshold', parseInt(e.target.value))}
            className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
          />
          <div className="flex justify-between text-xs text-neutral-500">
            <span>1%</span>
            <span>10%</span>
            <span>20%</span>
          </div>
        </div>

        {/* Notification Methods */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-secondary-900">Notification Methods</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 border-2 border-neutral-300 rounded-lg hover:border-primary-300 cursor-pointer transition-all">
              <input
                type="checkbox"
                checked={subscription.preferences.emailEnabled}
                onChange={(e) => handlePreferenceChange('emailEnabled', e.target.checked)}
                className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-200"
              />
              <Mail className="w-5 h-5 text-primary-600" />
              <span className="font-medium text-neutral-900">Email Alerts</span>
            </label>

            <label className="flex items-center gap-3 p-3 border-2 border-neutral-300 rounded-lg hover:border-primary-300 cursor-pointer transition-all">
              <input
                type="checkbox"
                checked={subscription.preferences.smsEnabled}
                onChange={(e) => handlePreferenceChange('smsEnabled', e.target.checked)}
                className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-200"
              />
              <Phone className="w-5 h-5 text-primary-600" />
              <span className="font-medium text-neutral-900">SMS Alerts</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-neutral-200">
          <button
            onClick={savePreferences}
            disabled={saving}
            className="flex-1 min-w-[200px] bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                Save Preferences
              </>
            )}
          </button>

          {subscription.status === 'active' ? (
            <button
              onClick={handlePause}
              disabled={saving}
              className="px-6 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 disabled:bg-neutral-300 transition-all flex items-center gap-2"
            >
              <Pause className="w-5 h-5" />
              Pause Alerts
            </button>
          ) : subscription.status === 'paused' ? (
            <button
              onClick={handleResume}
              disabled={saving}
              className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 disabled:bg-neutral-300 transition-all flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Resume Alerts
            </button>
          ) : null}

          <button
            onClick={handleUnsubscribe}
            disabled={saving}
            className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 disabled:bg-neutral-300 transition-all flex items-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Unsubscribe
          </button>
        </div>
      </div>
    </div>
  );
}