// src/app/alerts/test/page.js
import AlertTester from '@/components/alerts/AlertTester';
import { Shield } from 'lucide-react';

export default function AlertTestPage() {
  // In production, you should add authentication here
  // to prevent unauthorized access to this testing page

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Warning Banner */}
        <div className="bg-amber-100 border-2 border-amber-300 rounded-xl p-4 mb-6 flex items-start gap-3">
          <Shield className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900">Development Mode Only</p>
            <p className="text-sm text-amber-700 mt-1">
              This testing page is only available in development mode and will be automatically disabled in production.
            </p>
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-secondary-900 mb-2">
            Alert System Testing
          </h1>
          <p className="text-lg text-neutral-600">
            Test your email and SMS alert configurations before going live
          </p>
        </div>

        {/* Tester Component */}
        <AlertTester />

        {/* Setup Instructions */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-neutral-200 p-6">
          <h3 className="text-xl font-bold text-secondary-900 mb-4">
            Setup Checklist
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary-600">1</span>
              </div>
              <div>
                <p className="font-medium text-neutral-900">Set up Resend API Key</p>
                <p className="text-sm text-neutral-600">Add RESEND_API_KEY to your .env.local file</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary-600">2</span>
              </div>
              <div>
                <p className="font-medium text-neutral-900">Configure Africa's Talking</p>
                <p className="text-sm text-neutral-600">Add AFRICASTALKING_USERNAME and AFRICASTALKING_API_KEY</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary-600">3</span>
              </div>
              <div>
                <p className="font-medium text-neutral-900">Set sender information</p>
                <p className="text-sm text-neutral-600">Configure ALERT_FROM_EMAIL and ALERT_FROM_PHONE</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary-600">4</span>
              </div>
              <div>
                <p className="font-medium text-neutral-900">Install dependencies</p>
                <p className="text-sm text-neutral-600">
                  <code className="bg-neutral-100 px-2 py-1 rounded text-xs">npm install africastalking resend</code>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* API Documentation */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-neutral-200 p-6">
          <h3 className="text-xl font-bold text-secondary-900 mb-4">
            API Usage
          </h3>
          <div className="bg-neutral-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-green-400 text-sm">
{`# Test Price Alert Email
curl -X POST http://localhost:3000/api/alerts/test \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "price_alert_email",
    "email": "test@example.com",
    "name": "John Doe"
  }'

# Test Price Alert SMS
curl -X POST http://localhost:3000/api/alerts/test \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "price_alert_sms",
    "phone": "+254700000000",
    "name": "John Doe"
  }'`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}