import Image from 'next/image';
import { Target, Eye, Award, Users, Shield, TrendingUp, Heart, Zap } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: <Award className="h-10 w-10" />,
      title: 'Quality Excellence',
      description: 'We ensure all our products meet the highest industry standards and exceed expectations',
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: 'Customer Focus',
      description: 'Your satisfaction drives every decision we make and service we provide',
    },
    {
      icon: <Target className="h-10 w-10" />,
      title: 'Reliability',
      description: 'Consistent delivery and service you can count on, every single time',
    },
    {
      icon: <Shield className="h-10 w-10" />,
      title: 'Integrity',
      description: 'Transparent operations and honest relationships built on trust',
    },
    {
      icon: <TrendingUp className="h-10 w-10" />,
      title: 'Innovation',
      description: 'Continuously improving our services through modern solutions',
    },
    {
      icon: <Heart className="h-10 w-10" />,
      title: 'Community Care',
      description: 'Supporting the communities we serve with responsible practices',
    },
  ];

 

  const milestones = [
    {
      year: '2014',
      title: 'Company Founded',
      description: 'Started operations with a vision to transform fuel distribution in Kenya',
    },
    {
      year: '2017',
      title: 'Fleet Expansion',
      description: 'Doubled our transport capacity to serve more clients nationwide',
    },
    {
      year: '2020',
      title: 'Quality Certification',
      description: 'Achieved international quality standards certification',
    },
    {
      year: '2024',
      title: 'Industry Leader',
      description: 'Recognized as one of the top petroleum distributors in East Africa',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-secondary-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
            alt="About Eston Distributors"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-secondary-900/70"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-4xl">
            <div className="inline-block mb-4 px-4 py-2 bg-primary-500/20 border border-primary-500/30 rounded-full">
              <span className="text-primary-400 text-sm font-semibold">Our Story</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Powering Kenya's Growth Since 2014
            </h1>
            <p className="text-xl md:text-2xl text-neutral-200 leading-relaxed">
              Leading petroleum distributor and transport service provider committed to excellence
            </p>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 md:h-16 fill-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* Company Overview with Image */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-secondary-900 mb-6">
                Who We Are
              </h2>
              <div className="space-y-4 text-lg text-neutral-700">
                <p>
                  Eston Distributors is a leading supplier of petroleum products and transport services 
                  in Kenya. With over a decade of experience in the industry, we have built a reputation for 
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
              <div className="mt-8 flex items-center space-x-4">
                <div className="flex-shrink-0 w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Zap className="h-8 w-8 text-primary-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary-900">10,000+</div>
                  <div className="text-neutral-600">Successful Deliveries</div>
                </div>
              </div>
            </div>

            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=1200&q=80"
                alt="Eston team"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="group bg-white rounded-2xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border border-neutral-200">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-50 text-primary-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="h-10 w-10" />
              </div>
              <h3 className="text-3xl font-bold text-secondary-900 mb-4">Our Mission</h3>
              <p className="text-lg text-neutral-700 leading-relaxed">
                To provide reliable, high-quality petroleum products and transport services 
                that power businesses and communities across Kenya, while maintaining the 
                highest standards of safety and environmental responsibility.
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border border-neutral-200">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary-50 text-secondary-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <Eye className="h-10 w-10" />
              </div>
              <h3 className="text-3xl font-bold text-secondary-900 mb-4">Our Vision</h3>
              <p className="text-lg text-neutral-700 leading-relaxed">
                To be the most trusted and efficient petroleum distributor in East Africa, 
                recognized for our commitment to quality, innovation, and sustainable business 
                practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-secondary-900 mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              A decade of growth, innovation, and service excellence
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.year}
                  className="relative bg-neutral-50 rounded-2xl p-8 border-l-4 border-primary-500 hover:shadow-lg transition-all duration-300"
                >
                  <div className="absolute -left-6 top-8 w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {index + 1}
                  </div>
                  <div className="text-primary-600 font-bold text-2xl mb-2">{milestone.year}</div>
                  <h4 className="text-xl font-bold text-secondary-900 mb-2">{milestone.title}</h4>
                  <p className="text-neutral-600">{milestone.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-secondary-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              The principles that guide everything we do and every decision we make
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-neutral-200 group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 text-primary-600 rounded-xl mb-6 group-hover:scale-110 group-hover:bg-primary-100 transition-all duration-300">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-secondary-900 mb-6">
              Meet Our Team
            </h2>
            <p className="text-lg text-neutral-700 mb-12">
              Our dedicated professionals work tirelessly to ensure your fuel needs are met with 
              precision and care. With combined decades of industry experience, our team brings 
              expertise, reliability, and a customer-first approach to every delivery.
            </p>
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=80"
                alt="Our professional team"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}