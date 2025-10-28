import ContactForm from '@/components/ContactForm';
import { Phone, Mail, MapPin, Clock, MessageSquare, Headphones, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ContactPage() {
  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: 'Phone',
      details: ['+254 XXX XXX XXX', '+254 YYY YYY YYY'],
      action: 'tel:+254XXXXXXXXX',
      actionText: 'Call Now',
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Email',
      details: ['info@eston.co.ke', 'sales@eston.co.ke'],
      action: 'mailto:info@eston.co.ke',
      actionText: 'Send Email',
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Address',
      details: ['Nairobi, Kenya', 'P.O. Box XXXXX-00100'],
      action: '#map',
      actionText: 'View Map',
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Business Hours',
      details: ['Mon - Fri: 8:00 AM - 6:00 PM', 'Sat: 9:00 AM - 2:00 PM', 'Emergency: 24/7 Available'],
      action: null,
      actionText: null,
    },
  ];

  const quickLinks = [
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: 'General Inquiries',
      description: 'Questions about our products or services',
      email: 'info@eston.co.ke',
    },
    {
      icon: <Phone className="h-8 w-8" />,
      title: 'Sales & Quotes',
      description: 'Request pricing for bulk orders',
      email: 'sales@eston.co.ke',
    },
    {
      icon: <Headphones className="h-8 w-8" />,
      title: 'Customer Support',
      description: 'Help with existing orders',
      email: 'support@eston.co.ke',
    },
  ];

  const reasons = [
    'Quick response within 24 hours',
    'Dedicated account managers',
    'Flexible payment terms',
    'Competitive bulk pricing',
  ];

  return (
    <div>
      {/* Hero Section with Image */}
      <section className="relative h-[450px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&q=80"
          alt="Contact us"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/90 via-secondary-800/85 to-secondary-900/90"></div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Get in Touch
          </h1>
          <p className="text-xl md:text-2xl text-neutral-100 max-w-3xl mx-auto leading-relaxed">
            We're here to help with quotes, inquiries, and support
          </p>
        </div>
      </section>

      {/* Quick Contact Links */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-800 mb-4">
              How Can We Help?
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Choose the department that best matches your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href={`mailto:${link.email}`}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                  {link.icon}
                </div>
                <h3 className="text-xl font-semibold text-secondary-800 mb-3 group-hover:text-primary-600 transition-colors">
                  {link.title}
                </h3>
                <p className="text-neutral-600 mb-4">
                  {link.description}
                </p>
                <div className="text-primary-600 font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                  {link.email}
                  <ChevronRight className="h-4 w-4" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <h2 className="text-4xl font-bold text-secondary-800 mb-4">
                  Send Us a Message
                </h2>
                <p className="text-lg text-neutral-600 leading-relaxed">
                  Fill out the form below and our team will get back to you within 24 hours. For urgent matters, please call our hotline.
                </p>
              </div>

              {/* Why Choose Us */}
              <div className="bg-primary-50 border-2 border-primary-200 rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-secondary-800 mb-4">
                  Why partner with us?
                </h3>
                <ul className="space-y-3">
                  {reasons.map((reason, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-5 h-5 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                        ✓
                      </span>
                      <span className="text-neutral-700">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <ContactForm />
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-4xl font-bold text-secondary-800 mb-4">
                Contact Information
              </h2>
              <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                Reach out to us through any of the following channels. We're always happy to hear from you.
              </p>

              <div className="space-y-4 mb-8">
                {contactInfo.map((info) => (
                  <div
                    key={info.title}
                    className="bg-neutral-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-14 h-14 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors">
                        {info.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-secondary-800 mb-3">
                          {info.title}
                        </h3>
                        {info.details.map((detail, index) => (
                          <p key={index} className="text-neutral-700 mb-1">
                            {detail}
                          </p>
                        ))}
                        {info.action && (
                          <a
                            href={info.action}
                            className="inline-flex items-center gap-2 text-primary-600 font-medium mt-3 hover:gap-3 transition-all"
                          >
                            {info.actionText}
                            <ChevronRight className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Section */}
              <div id="map" className="rounded-2xl overflow-hidden shadow-xl">
                <div className="relative h-80 bg-neutral-200">
                  {/* You can replace this with an actual Google Maps embed */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <MapPin className="h-16 w-16 text-primary-500 mb-4" />
                    <p className="text-xl font-semibold text-secondary-800 mb-2">
                      Our Location
                    </p>
                    <p className="text-neutral-600 mb-4">
                      Visit us at our office in Nairobi
                    </p>
                    <button className="bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors">
                      Open in Maps
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Image Section */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
                alt="Our office"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-secondary-800 mb-6">
                Visit Our Office
              </h2>
              <p className="text-lg text-neutral-700 mb-6 leading-relaxed">
                Our modern facilities are equipped to handle all your fuel supply needs. Whether you're looking to establish a supply contract or need information about our services, our team is ready to assist you.
              </p>
              <p className="text-lg text-neutral-700 mb-8 leading-relaxed">
                Schedule a visit to see our operations firsthand and discuss how we can meet your specific requirements.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a
                  href="tel:+254XXXXXXXXX"
                  className="inline-flex items-center gap-2 bg-primary-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-600 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Phone className="h-5 w-5" />
                  Call to Schedule
                </a>
                <Link
                  href="#contact-form"
                  className="inline-flex items-center gap-2 bg-white border-2 border-primary-500 text-primary-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-50 transition-all duration-300"
                >
                  Send Message
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact Banner */}
      <section className="relative py-16 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=1920&q=80"
          alt="24/7 Emergency service"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-accent-600/90"></div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md text-white rounded-2xl mb-6">
              <Phone className="h-10 w-10" />
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Need Emergency Fuel Delivery?
            </h3>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Our 24/7 emergency hotline is always available for urgent fuel delivery needs. Quick response guaranteed.
            </p>
            <a
              href="tel:+254722943291"
              className="inline-flex items-center gap-3 bg-white text-accent-600 px-10 py-5 rounded-xl text-xl font-bold hover:bg-neutral-100 hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              <Phone className="h-6 w-6" />
              +254 XXX XXX XXX
            </a>
            <p className="text-white/80 mt-4 text-sm">
              Available 24 hours a day, 7 days a week
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Teaser Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-800 mb-4">
            Have Questions?
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-8">
            Check out our frequently asked questions or reach out directly to our team
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-primary-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-600 transition-colors"
            >
              View Our Products
              <ChevronRight className="h-5 w-5" />
            </Link>
            <Link
              href="/transport"
              className="inline-flex items-center gap-2 bg-white border-2 border-secondary-300 text-secondary-700 px-8 py-4 rounded-xl font-semibold hover:bg-neutral-50 transition-colors"
            >
              Transport Services
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* SVG Wave Divider */}
      <div className="bg-white">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="#05699b"/>
        </svg>
      </div>
    </div>
  );
}