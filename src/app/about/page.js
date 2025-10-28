import { Target, Eye, Award, Users } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: <Award className="h-10 w-10" />,
      title: 'Quality',
      description: 'We ensure all our products meet the highest industry standards',
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: 'Customer Focus',
      description: 'Your satisfaction is our top priority',
    },
    {
      icon: <Target className="h-10 w-10" />,
      title: 'Reliability',
      description: 'Consistent delivery and service you can count on',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-secondary-700 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-xl text-neutral-200 max-w-3xl">
            Leading petroleum distributor and transport service provider in Kenya
          </p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-800 mb-6">
              Who We Are
            </h2>
            <div className="prose prose-lg text-neutral-700 space-y-4">
              <p>
                Eston Distributors is a leading supplier of petroleum products and transport services 
                in Kenya. With years of experience in the industry, we have built a reputation for 
                reliability, quality, and exceptional customer service.
              </p>
              <p>
                We specialize in the distribution of petrol, super petrol, and diesel to businesses 
                and organizations across the country. Our comprehensive transport services ensure 
                timely and safe delivery of fuel products to your location.
              </p>
              <p>
                Our commitment to excellence has made us the preferred partner for companies seeking 
                consistent, high-quality fuel supply and dependable logistics solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-md">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-6">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-secondary-800 mb-4">Our Mission</h3>
              <p className="text-neutral-700">
                To provide reliable, high-quality petroleum products and transport services 
                that power businesses and communities across Kenya, while maintaining the 
                highest standards of safety and environmental responsibility.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary-100 text-secondary-600 rounded-full mb-6">
                <Eye className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-secondary-800 mb-4">Our Vision</h3>
              <p className="text-neutral-700">
                To be the most trusted and efficient petroleum distributor in East Africa, 
                recognized for our commitment to quality, innovation, and sustainable business 
                practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-800 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-neutral-50 rounded-xl p-8 text-center hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-secondary-800 mb-3">
                  {value.title}
                </h3>
                <p className="text-neutral-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-500 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">10+</div>
              <div className="text-lg">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-lg">Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-lg">Service Available</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">100%</div>
              <div className="text-lg">Quality Guaranteed</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}