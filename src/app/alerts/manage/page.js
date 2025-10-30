// src/app/alerts/manage/page.js
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import AlertPreferences from '@/components/alerts/AlertPreferences';

function ManageContent() {
  const searchParams = useSearchParams();
  const [subscriptionId, setSubscriptionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const id = searchParams.get('id');
    const email = searchParams.get('email');

    if (id) {
      setSubscriptionId(id);
      setLoading(false);
    } else if (email) {
      // Look up subscription by email
      fetchSubscriptionByEmail(email);
    } else {
      setError('No subscription ID or email provided');
      setLoading(false);
    }
  }, [searchParams]);

  const fetchSubscriptionByEmail = async (email) => {
    try {
      const response = await fetch(`/api/alerts/subscribe?email=${email}`);
      const data = await response.json();

      if (response.ok && data.exists) {
        setSubscriptionId(data.subscription.id);
      } else {
        setError('Subscription not found');
      }
    } catch (err) {
      setError('Failed to load subscription');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading your preferences...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">
            Error Loading Preferences
          </h2>
          <p className="text-neutral-600 mb-6">{error}</p>
          <a
            href="/alerts"
            className="inline-block bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
          >
            Back to Alerts
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Manage Alert Preferences
          </h1>
          <p className="text-neutral-600">
            Update your notification settings and alert preferences
          </p>
        </div>

        <AlertPreferences subscriptionId={subscriptionId} />
      </div>
    </div>
  );
}

export default function ManageAlertsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
      </div>
    }>
      <ManageContent />
    </Suspense>
  );
}