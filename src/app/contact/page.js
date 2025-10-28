import ContactForm from '@/components/ContactForm';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: 'Phone',
      details: ['+254 XXX XXX XXX', '+254 YYY YYY YYY'],
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Email',
      details: ['info@eston.co.ke', 'sales@eston.co.ke'],
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Address',
      details: ['Nairobi, Kenya', 'P.O. Box XXXXX-00100'],
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Business Hours',
      details: ['Mon - Fri: 8:00 AM - 6:00 PM', 'Sat: 9:00 AM - 2:00 PM'],
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-secondary-700 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-neutral-200 max-w-3xl">
            Get in touch with us for quotes, inquiries, or support
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">
                Send Us a Message
              </h2>
              <p className="text-neutral-600 mb-8">
                Fill out the form below and our team will get back to you within 24 hours.
              </p>
              <ContactForm />
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">
                Get In Touch
              </h2>
              <p className="text-neutral-600 mb-8">
                Reach out to us through any of the following channels:
              </p>

              <div className="space-y-6">
                {contactInfo.map((info) => (
                  <div
                    key={info.title}
                    className="bg-neutral-50 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-secondary-800 mb-2">
                          {info.title}
                        </h3>
                        {info.details.map((detail, index) => (
                          <p key={index} className="text-neutral-700">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Placeholder */}
              <div className="mt-8 bg-neutral-200 rounded-lg h-64 flex items-center justify-center">
                <p className="text-neutral-600">Map Location (Coming Soon)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-12 bg-accent-500 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-3">Emergency Fuel Delivery?</h3>
          <p className="text-lg mb-4">Call our 24/7 hotline for urgent orders</p>
          <a
            href="tel:+254XXXXXXXXX"
            className="inline-block bg-white text-accent-600 px-8 py-3 rounded-lg font-semibold hover:bg-neutral-100 transition-colors"
          >
            +254 XXX XXX XXX
          </a>
        </div>
      </section>
    </div>
  );
}