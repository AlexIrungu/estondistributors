import { MapPin, TruckIcon, Clock, DollarSign, Package, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import DeliveryZoneMap from '@/components/maps/DeliveryZoneMap';
import { DELIVERY_ZONES, URGENCY_LEVELS, VOLUME_DISCOUNTS } from '@/data/deliveryZones';

export const metadata = {
  title: 'Delivery Zones & Coverage | Eston Distributors',
  description: 'Check our delivery zones, costs, and coverage areas across Kenya. Fast and reliable fuel delivery to your location.',
};

export default function DeliveryZonesPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-sm font-semibold mb-6">
              <MapPin className="h-4 w-4" />
              Nationwide Coverage
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Delivery Zones & Coverage
            </h1>
            <p className="text-xl md:text-2xl text-neutral-100 max-w-3xl mx-auto">
              Professional fuel delivery across Kenya. Find your zone, check delivery costs, and schedule your delivery.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <DeliveryZoneMap />
        </div>
      </section>

      {/* Nairobi Zones Detail */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              Nairobi & Surrounding Areas
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Fast delivery within Nairobi with same-day service available
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(DELIVERY_ZONES.nairobi).map(([key, zone]) => {
              const colors = {
                'nairobi-cbd': 'from-green-500 to-emerald-600',
                'nairobi-inner': 'from-blue-500 to-cyan-600',
                'nairobi-outer': 'from-amber-500 to-orange-600',
              };
              
              return (
                <div
                  key={zone.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-neutral-200 hover:border-primary-300 overflow-hidden"
                >
                  <div className={`bg-gradient-to-br ${colors[zone.id]} text-white p-6`}>
                    <TruckIcon className="h-10 w-10 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">{zone.name}</h3>
                    <p className="text-white/90 text-sm">{zone.radius}</p>
                  </div>

                  <div className="p-6">
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-600">Base Cost:</span>
                        <span className="text-xl font-bold text-secondary-900">
                          {zone.baseCost === 0 ? (
                            <span className="text-green-600">FREE</span>
                          ) : (
                            `KES ${zone.baseCost.toLocaleString()}`
                          )}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-600 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Delivery Time:
                        </span>
                        <span className="font-semibold text-secondary-900">{zone.estimatedTime}</span>
                      </div>

                      {zone.freeDeliveryThreshold && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-800 font-medium">
                            Free delivery on orders over {zone.freeDeliveryThreshold.toLocaleString()}L
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-neutral-700 mb-2">Areas Covered:</p>
                      <div className="flex flex-wrap gap-2">
                        {zone.areas.slice(0, 6).map((area) => (
                          <span
                            key={area}
                            className="text-xs px-2 py-1 bg-neutral-100 text-neutral-700 rounded-full"
                          >
                            {area}
                          </span>
                        ))}
                        {zone.areas.length > 6 && (
                          <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-full font-semibold">
                            +{zone.areas.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Regional Coverage */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              Regional Coverage
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              We deliver across Kenya to major towns and cities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(DELIVERY_ZONES.regional).map(([key, region]) => (
              <div
                key={region.id}
                className="bg-white rounded-xl shadow-lg p-6 border-2 border-neutral-200 hover:border-primary-300 hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-secondary-900">{region.name}</h3>
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary-600" />
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Base Cost:</span>
                    <span className="font-bold text-secondary-900">KES {region.baseCost.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Delivery Time:</span>
                    <span className="font-semibold text-secondary-900">{region.estimatedTime}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-neutral-700 mb-2">Major Towns:</p>
                  <div className="flex flex-wrap gap-2">
                    {region.majorTowns.slice(0, 4).map((town) => (
                      <span
                        key={town}
                        className="text-xs px-2 py-1 bg-primary-50 text-primary-700 rounded-full font-medium"
                      >
                        {town}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Urgency Levels */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              Delivery Urgency Levels
            </h2>
            <p className="text-lg text-neutral-600">
              Choose the delivery speed that fits your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {Object.entries(URGENCY_LEVELS).map(([key, level]) => {
              const colors = {
                standard: 'from-blue-500 to-cyan-600',
                express: 'from-amber-500 to-orange-600',
                emergency: 'from-red-500 to-rose-600',
              };

              return (
                <div
                  key={key}
                  className="bg-white rounded-xl shadow-lg border-2 border-neutral-200 hover:border-primary-300 hover:shadow-xl transition-all overflow-hidden"
                >
                  <div className={`bg-gradient-to-br ${colors[key]} text-white p-6 text-center`}>
                    <div className="text-4xl font-bold mb-2">{level.multiplier}x</div>
                    <h3 className="text-xl font-bold">{level.name}</h3>
                  </div>

                  <div className="p-6">
                    <p className="text-neutral-700 mb-4">{level.description}</p>
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <Clock className="h-4 w-4" />
                      <span>{level.availability}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Volume Discounts */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
              <Package className="h-4 w-4" />
              Volume Discounts
            </div>
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              Save More with Bulk Orders
            </h2>
            <p className="text-lg text-neutral-600">
              Automatic discounts applied based on order volume
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {VOLUME_DISCOUNTS.map((discount, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 border-2 border-neutral-200 hover:border-green-300 hover:shadow-xl transition-all text-center"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {discount.discount === 0 ? '0%' : `${(discount.discount * 100).toFixed(0)}%`}
                </div>
                <div className="text-sm font-semibold text-neutral-700 mb-3">
                  {discount.label}
                </div>
                <div className="text-xs text-neutral-600">
                  {discount.maxVolume === Infinity 
                    ? `${discount.minVolume.toLocaleString()}L+`
                    : `${discount.minVolume.toLocaleString()} - ${discount.maxVolume.toLocaleString()}L`
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              How Delivery Works
            </h2>
            <p className="text-lg text-neutral-600">
              Simple, transparent, and reliable delivery process
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '1',
                title: 'Check Your Zone',
                desc: 'Use our map to find your delivery zone and get instant pricing',
                icon: <MapPin className="h-6 w-6" />
              },
              {
                step: '2',
                title: 'Place Order',
                desc: 'Contact us or place an order online with your requirements',
                icon: <Package className="h-6 w-6" />
              },
              {
                step: '3',
                title: 'Schedule Delivery',
                desc: 'Choose your preferred delivery date and urgency level',
                icon: <Clock className="h-6 w-6" />
              },
              {
                step: '4',
                title: 'Receive Fuel',
                desc: 'Our team delivers safely to your location on time',
                icon: <CheckCircle className="h-6 w-6" />
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                  {item.step}
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="text-primary-600">{item.icon}</div>
                </div>
                <h3 className="text-lg font-bold text-secondary-900 mb-2">{item.title}</h3>
                <p className="text-neutral-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Schedule Your Delivery?
          </h2>
          <p className="text-xl text-neutral-200 max-w-2xl mx-auto mb-10">
            Contact us now to get a quote and schedule your fuel delivery
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-secondary-900 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-neutral-100 transition-all shadow-xl hover:scale-105"
            >
              Get a Quote
              <span>→</span>
            </Link>
            <Link
              href="/transport"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all border-2 border-white/20"
            >
              View Transport Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}