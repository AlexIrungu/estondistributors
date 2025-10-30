// src/components/alerts/AlertTester.js
'use client';

import { useState } from 'react';
import { Send, Mail, Phone, Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function AlertTester() {
  const [testType, setTestType] = useState('price_alert_email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('Test User');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const testTypes = {
    email: [
      { value: 'price_alert_email', label: 'Price Alert Email', icon: Mail },
      { value: 'verification_email', label: 'Verification Email', icon: Mail },
      { value: 'welcome_email', label: 'Welcome Email', icon: Mail },
    ],
    sms: [
      { value: 'price_alert_sms', label: 'Price Alert SMS', icon: Phone },
      { value: 'verification_sms', label: 'Verification SMS', icon: Phone },
      { value: 'welcome_sms', label: 'Welcome SMS', icon: Phone },
      { value: 'test_sms', label: 'Test SMS', icon: Phone },
    ],
  };

  const handleTest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/alerts/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: testType,
          email,
          phone,
          name,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: 'Network error',
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const isEmailTest = testType.includes('email');
  const isSMSTest = testType.includes('sms');

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Send className="w-6 h-6" />
          Alert Testing Dashboard
        </h2>
        <p className="text-purple-100 text-sm mt-1">
          Test email and SMS alerts (Development only)
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleTest} className="p-6 space-y-6">
        {/* Test Type Selection */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-3">
            Select Test Type
          </label>
          <div className="space-y-2">
            <div className="font-semibold text-sm text-neutral-600 mb-2">Email Tests</div>
            {testTypes.email.map((test) => (
              <label
                key={test.value}
                className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all hover:border-primary-300"
              >
                <input
                  type="radio"
                  name="testType"
                  value={test.value}
                  checked={testType === test.value}
                  onChange={(e) => setTestType(e.target.value)}
                  className="w-4 h-4 text-primary-600"
                />
                <test.icon className="w-5 h-5 text-primary-600" />
                <span className="font-medium">{test.label}</span>
              </label>
            ))}

            <div className="font-semibold text-sm text-neutral-600 mb-2 mt-4">SMS Tests</div>
            {testTypes.sms.map((test) => (
              <label
                key={test.value}
                className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all hover:border-primary-300"
              >
                <input
                  type="radio"
                  name="testType"
                  value={test.value}
                  checked={testType === test.value}
                  onChange={(e) => setTestType(e.target.value)}
                  className="w-4 h-4 text-primary-600"
                />
                <test.icon className="w-5 h-5 text-primary-600" />
                <span className="font-medium">{test.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Recipient Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
            placeholder="John Doe"
          />
        </div>

        {/* Email (for email tests) */}
        {isEmailTest && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={isEmailTest}
              className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
              placeholder="test@example.com"
            />
          </div>
        )}

        {/* Phone (for SMS tests) */}
        {isSMSTest && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required={isSMSTest}
              className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
              placeholder="+254 700 000 000"
            />
            <p className="text-xs text-neutral-500 mt-1">
              Format: 07XX XXX XXX or +254 7XX XXX XXX
            </p>
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div
            className={`p-4 rounded-lg border-2 ${
              result.success
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {result.success ? (
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p
                  className={`font-semibold ${
                    result.success ? 'text-green-900' : 'text-red-900'
                  }`}
                >
                  {result.success ? 'Success!' : 'Failed'}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    result.success ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {result.message}
                </p>
                {result.result && (
                  <pre className="text-xs mt-2 p-2 bg-white/50 rounded overflow-auto">
                    {JSON.stringify(result.result, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-xl flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending Test...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Send Test Alert
            </>
          )}
        </button>
      </form>
    </div>
  );
}