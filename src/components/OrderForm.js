// src/components/OrderForm.js
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const orderInquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  fuelType: z.string().min(1, 'Please select a fuel type'),
  quantity: z.string().min(1, 'Please enter quantity'),
  deliveryLocation: z.string().min(5, 'Please enter delivery location'),
  preferredDate: z.string().optional(),
  message: z.string().optional(),
});

const fuelTypes = [
  { value: 'Diesel (AGO)', label: 'Diesel (AGO)' },
  { value: 'Petrol (PMS)', label: 'Petrol (PMS)' },
  { value: 'Super Petrol', label: 'Super Petrol' },
  { value: 'Kerosene (IK)', label: 'Kerosene (IK)' },
  { value: 'Aviation Fuel', label: 'Aviation Fuel (Jet A1)' },
];

export default function OrderForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(orderInquirySchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/order-inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        reset();
        
        // Auto-hide success message after 7 seconds
        setTimeout(() => {
          setSubmitStatus(null);
        }, 7000);
      } else {
        throw new Error(result.error || 'Failed to send order inquiry');
      }
    } catch (error) {
      console.error('Order form error:', error);
      setSubmitStatus('error');
      
      // Auto-hide error message after 7 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 7000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" id="order-inquiry-form">
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
          Full Name *
        </label>
        <input
          {...register('name')}
          type="text"
          id="name"
          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
          placeholder="John Doe"
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
          Email Address *
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
          placeholder="john@example.com"
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Phone Field */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
          Phone Number *
        </label>
        <input
          {...register('phone')}
          type="tel"
          id="phone"
          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
          placeholder="+254 XXX XXX XXX"
          disabled={isSubmitting}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      {/* Fuel Type Selection */}
      <div>
        <label htmlFor="fuelType" className="block text-sm font-medium text-neutral-700 mb-2">
          Fuel Type *
        </label>
        <select
          {...register('fuelType')}
          id="fuelType"
          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
          disabled={isSubmitting}
        >
          <option value="">Select fuel type...</option>
          {fuelTypes.map((fuel) => (
            <option key={fuel.value} value={fuel.value}>
              {fuel.label}
            </option>
          ))}
        </select>
        {errors.fuelType && (
          <p className="mt-1 text-sm text-red-600">{errors.fuelType.message}</p>
        )}
      </div>

      {/* Quantity Field */}
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-neutral-700 mb-2">
          Quantity (Liters) *
        </label>
        <input
          {...register('quantity')}
          type="number"
          id="quantity"
          min="100"
          step="100"
          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
          placeholder="e.g., 1000"
          disabled={isSubmitting}
        />
        {errors.quantity && (
          <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
        )}
        <p className="mt-1 text-xs text-neutral-600">
          💡 Minimum order: 100 liters. Bulk orders qualify for special discounts.
        </p>
      </div>

      {/* Delivery Location */}
      <div>
        <label htmlFor="deliveryLocation" className="block text-sm font-medium text-neutral-700 mb-2">
          Delivery Location *
        </label>
        <textarea
          {...register('deliveryLocation')}
          id="deliveryLocation"
          rows={3}
          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
          placeholder="Enter complete delivery address (building, street, area, city)"
          disabled={isSubmitting}
        />
        {errors.deliveryLocation && (
          <p className="mt-1 text-sm text-red-600">{errors.deliveryLocation.message}</p>
        )}
      </div>

      {/* Preferred Date */}
      <div>
        <label htmlFor="preferredDate" className="block text-sm font-medium text-neutral-700 mb-2">
          Preferred Delivery Date <span className="text-neutral-500">(Optional)</span>
        </label>
        <input
          {...register('preferredDate')}
          type="date"
          id="preferredDate"
          min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
          disabled={isSubmitting}
        />
        {errors.preferredDate && (
          <p className="mt-1 text-sm text-red-600">{errors.preferredDate.message}</p>
        )}
        <p className="mt-1 text-xs text-neutral-600">
          📅 We typically deliver within 24-48 hours from order confirmation
        </p>
      </div>

      {/* Additional Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
          Additional Requirements <span className="text-neutral-500">(Optional)</span>
        </label>
        <textarea
          {...register('message')}
          id="message"
          rows={4}
          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
          placeholder="Any special instructions or requirements..."
          disabled={isSubmitting}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-600 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending Inquiry...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Request Quote
          </>
        )}
      </button>

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg flex items-start gap-3 animate-fade-in">
          <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-semibold">Inquiry sent successfully!</p>
            <p className="text-sm mt-1">Thank you for your interest. Our team will contact you within 2-4 hours with a detailed quote.</p>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg flex items-start gap-3 animate-fade-in">
          <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-semibold">Failed to send inquiry</p>
            <p className="text-sm mt-1">Please try again or contact us directly at estonkd@gmail.com</p>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">What happens next?</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Our sales team reviews your inquiry</li>
            <li>You receive a detailed quote via email</li>
            <li>We call to discuss delivery logistics</li>
            <li>Order confirmed and scheduled for delivery</li>
          </ul>
        </div>
      </div>
    </form>
  );
}