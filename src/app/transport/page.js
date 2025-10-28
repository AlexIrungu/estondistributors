import { TruckIcon, Clock, Shield, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function TransportPage() {
  const services = [
    {
      icon: <TruckIcon className="h-12 w-12" />,
      title: 'Bulk Fuel Delivery',
      description: 'Reliable delivery of petroleum products in any quantity to your location',
      features: [
        'Modern fleet of fuel tankers',
        'GPS-tracked vehicles',
        'Certified drivers',
        'Safe handling procedures',
      ],
    },
    {
      icon: <Clock className="h-12 w-12" />,
      title: '24/7 Emergency Service',
      description: 'Round-the-clock availability for urgent fuel delivery needs',
      features: [
        'Quick response time',
        'Emergency hotline',
        'Same-day delivery',
        'Priority scheduling',
      ],
    },
    {
      icon: <Shield className="h-12 w-12" />,
      title: 'Safe & Secure Transport',
      description: 'Industry-leading safety standards for fuel transportation',
      features: [
        'Licensed and insured',
        'Regular vehicle maintenance',
        'Safety compliance',
        'Hazmat certified',
      ],
    },
  ];

  const coverage = [
    'Nairobi & Surrounding Areas',
    'Central Kenya',
    'Rift Valley Region',
    'Western Kenya',
    'Coast Region',
    'Eastern Kenya',
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-accent-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Transport Services</h1>
          <p className="text-xl text-neutral-100 max-w-3xl">
            Professional fuel delivery services ensuring your operations never run dry
          </p>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-800 mb-4">
              Our Transport Services
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Comprehensive logistics solutions for all your fuel delivery needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-neutral-50 rounded-xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-100 text-accent-600 rounded-full mb-6">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-secondary-800 mb-4">
                  {service.title}
                </h3>
                <p className="text-neutral-700 mb-6">{service.description}</p>

                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="text-accent-500 mt-1">✓</span>
                      <span className="text-neutral-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-800 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-neutral-600">
              Simple process to get your fuel delivered
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { step: '1', title: 'Request Quote', desc: 'Contact us with your requirements' },
              { step: '2', title: 'Confirm Order', desc: 'Review and approve the quotation' },
              { step: '3', title: 'Schedule Delivery', desc: 'Choose your preferred delivery time' },
              { step: '4', title: 'Receive Fuel', desc: 'Our team delivers to your location' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 text-white rounded-full text-2xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-secondary-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-neutral-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Area */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-100 text-accent-600 rounded-full mb-4">
                <MapPin className="h-8 w-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-800 mb-4">
                Coverage Area
              </h2>
              <p className="text-lg text-neutral-600">
                We deliver across Kenya to serve your business needs
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {coverage.map((area) => (
                <div
                  key={area}
                  className="bg-neutral-50 rounded-lg p-4 text-center font-medium text-neutral-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                >
                  {area}
                </div>
              ))}
            </div>

            <p className="text-center text-neutral-600 mt-8">
              Don't see your area? Contact us to discuss custom delivery options.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Schedule a Delivery?
          </h2>
          <p className="text-xl mb-8 text-neutral-200 max-w-2xl mx-auto">
            Get in touch with our team for competitive pricing and reliable service
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block bg-primary-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-600 transition-colors"
            >
              Request a Quote
            </Link>
            <a
              href="tel:+254XXXXXXXXX"
              className="inline-block bg-accent-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-accent-600 transition-colors"
            >
              Call Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}