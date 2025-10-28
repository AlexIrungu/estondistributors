import Link from 'next/link';
import Image from 'next/image';
import { Bell, Mail, Phone, TrendingUp, Clock, Shield, Zap } from 'lucide-react';
import PriceAlertForm from '@/components/alerts/PriceAlertForm';

export default function AlertsPage() {
  const features = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Real-Time Updates',
      description: 'Get notified instantly when prices change',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: '24/7 Monitoring',
      description: 'We track prices around the clock',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'No Spam',
      description: 'Only important price changes',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Customizable',
      description: 'Set your own alert preferences',
    },
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Subscribe',
      description: 'Fill out the form with your preferences',
    },
    {
      step: '2',
      title: 'Verify',
      description: 'Confirm your email address',
    },
    {
      step: '3',
      title: 'Get Alerts',
      description: 'Receive notifications when prices change',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1920&q=80"
            alt="Price alerts background"
            fill
            className="object-cover"
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6">
              <Bell className="w-4 h-4" />
              <span className="text-sm font-semibold">Free Price Alert Service</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Never Miss a Price Change
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Get instant notifications when fuel prices change. Stay informed and make better purchasing decisions.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="#subscribe"
                className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-all duration-300 shadow-xl hover:scale-105"
              >
                <Bell className="w-5 h-5" />
                Subscribe Now
              </a>
              <Link
                href="/prices"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all duration-300"
              >
                View Current Prices
              </Link>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 md:h-16 fill-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Why Subscribe to Price Alerts?
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Stay ahead with our intelligent price monitoring system
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-primary-500 text-white rounded-xl flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Getting started is simple and takes less than 2 minutes
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {howItWorks.map((step, index) => (
                <div
                  key={index}
                  className="text-center relative"
                >
                  {/* Step Number */}
                  <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 relative z-10">
                    {step.step}
                  </div>
                  
                  {/* Connecting Line */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-primary-200 -translate-y-1/2 z-0"></div>
                  )}

                  {/* Content */}
                  <h3 className="text-xl font-bold text-secondary-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-neutral-600">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Form Section */}
      <section id="subscribe" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Subscribe to Price Alerts
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Fill out the form below to start receiving price change notifications
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <PriceAlertForm />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Everything you need to know about our price alert service
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "How often will I receive alerts?",
                answer: "You'll only receive alerts when prices change significantly based on your threshold settings. We don't send daily updates unless there's an actual price change."
              },
              {
                question: "Is this service really free?",
                answer: "Yes! Our price alert service is completely free. We believe in helping our customers make informed decisions without any cost."
              },
              {
                question: "Can I change my alert preferences later?",
                answer: "Absolutely! You can update your fuel types, locations, and alert thresholds at any time by contacting our support team."
              },
              {
                question: "How quickly will I get notified after a price change?",
                answer: "Our system sends notifications within minutes of detecting a price change. Email alerts are instant, and SMS alerts may take slightly longer depending on network conditions."
              },
              {
                question: "What areas do you cover?",
                answer: "Currently we cover major regions including Nairobi and Mombasa. We're continuously expanding our coverage to serve more locations across Kenya."
              }
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200"
              >
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-neutral-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Stay Informed?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of smart customers who never miss a price change
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="#subscribe"
              className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-all duration-300 shadow-xl hover:scale-105"
            >
              <Bell className="w-5 h-5" />
              Subscribe Now
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all duration-300"
            >
              <Mail className="w-5 h-5" />
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}