'use client'
import { Truck, Clock, Shield, MapPin, CheckCircle, Users, Gauge, Package, Award, Phone, ArrowRight, Navigation, Zap, AlertCircle, TruckIcon, DollarSign, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';


export default function TransportPage() {
  const [selectedFleet, setSelectedFleet] = useState('medium');
  const [selectedZone, setSelectedZone] = useState('nairobi-cbd');
  const [deliveryVolume, setDeliveryVolume] = useState(10000);
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);


  // Fleet specifications - your 4 truck types
  const fleetTypes = [
    {
      id: 'small',
      name: 'Small Tanker',
      capacity: 5000,
      capacityLabel: '5,000L',
      wheels: '12-wheel',
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80',
      specs: {
        length: '7.5m',
        width: '2.5m',
        weight: '12 tons',
      },
      features: [
        'Perfect for urban deliveries',
        'Easy maneuverability in tight spaces',
        'Quick loading and unloading',
        'Ideal for residential areas'
      ],
      bestFor: ['Small businesses', 'Residential estates', 'Urban locations', 'Emergency deliveries'],
      deliveryTime: '1-2 hours within Nairobi',
    },
    {
      id: 'medium',
      name: 'Medium Tanker',
      capacity: 10000,
      capacityLabel: '10,000L',
      wheels: '12-wheel',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
      specs: {
        length: '9m',
        width: '2.5m',
        weight: '18 tons',
      },
      features: [
        'Balanced capacity and mobility',
        'Cost-effective for medium orders',
        'Suitable for most locations',
        'GPS tracking enabled'
      ],
      bestFor: ['Medium businesses', 'Construction sites', 'Factories', 'Regular supply contracts'],
      deliveryTime: '2-4 hours within Nairobi',
    },
    {
      id: 'large',
      name: 'Large Tanker',
      capacity: 20000,
      capacityLabel: '20,000L',
      wheels: '24-wheel',
      image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&q=80',
      specs: {
        length: '12m',
        width: '2.5m',
        weight: '30 tons',
      },
      features: [
        'High-capacity bulk delivery',
        'Reduced delivery frequency',
        'Cost savings on large orders',
        'Industrial-grade equipment'
      ],
      bestFor: ['Large corporations', 'Industrial plants', 'Mining operations', 'Bulk contracts'],
      deliveryTime: '4-6 hours within Nairobi',
    },
    {
      id: 'xlarge',
      name: 'Extra Large Tanker',
      capacity: 40000,
      capacityLabel: '40,000L',
      wheels: '24-wheel',
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80',
      specs: {
        length: '15m',
        width: '2.5m',
        weight: '45 tons',
      },
      features: [
        'Maximum capacity delivery',
        'Best value for bulk orders',
        'Specialized handling',
        'Priority scheduling'
      ],
      bestFor: ['Major corporations', 'Power plants', 'Large-scale operations', 'Long-term contracts'],
      deliveryTime: '6-8 hours depending on location',
    },
  ];

  const deliveryZones = [
    { id: 'nairobi-cbd', name: 'Nairobi CBD', cost: 'FREE', time: '1-2 hours', color: 'green', baseCost: 0 },
    { id: 'nairobi-inner', name: 'Inner Nairobi', cost: 'KES 2,000', time: '2-4 hours', color: 'blue', baseCost: 2000 },
    { id: 'nairobi-outer', name: 'Outer Nairobi', cost: 'KES 5,000', time: '4-6 hours', color: 'amber', baseCost: 5000 },
    { id: 'kiambu', name: 'Kiambu County', cost: 'KES 8,000', time: '4-6 hours', color: 'red', baseCost: 8000 },
    { id: 'regional', name: 'Regional', cost: 'Contact Us', time: '1-2 days', color: 'purple', baseCost: 0 },
  ];

  const safetyFeatures = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'ISO Certified',
      description: 'All operations meet ISO 9001:2015 quality standards',
      badge: 'ISO 9001:2015'
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: 'EPRA Licensed',
      description: 'Fully licensed by Energy and Petroleum Regulatory Authority',
      badge: 'EPRA Licensed'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Trained Drivers',
      description: 'All drivers have hazmat and defensive driving certification',
      badge: 'Hazmat Certified'
    },
    {
      icon: <Gauge className="h-8 w-8" />,
      title: 'GPS Tracking',
      description: 'Real-time vehicle tracking for all deliveries',
      badge: 'Live Tracking'
    },
  ];

  const stats = [
    { value: '4', label: 'Fleet Types', icon: <Truck className="h-6 w-6" /> },
    { value: '50+', label: 'Delivery Vehicles', icon: <Package className="h-6 w-6" /> },
    { value: '98%', label: 'On-Time Rate', icon: <CheckCircle className="h-6 w-6" /> },
    { value: '24/7', label: 'Availability', icon: <Clock className="h-6 w-6" /> },
  ];

  const selectedFleetData = fleetTypes.find(f => f.id === selectedFleet);
  const selectedZoneData = deliveryZones.find(z => z.id === selectedZone);

  // Calculate estimated cost
  const calculateEstimatedCost = () => {
    const zone = selectedZoneData;
    if (zone.id === 'regional') return 'Contact us for quote';
    if (zone.baseCost === 0 && deliveryVolume >= 5000) return 'FREE';
    
    let cost = zone.baseCost;
    // Volume discount
    if (deliveryVolume >= 20000) cost *= 0.85;
    else if (deliveryVolume >= 10000) cost *= 0.9;
    else if (deliveryVolume >= 5000) cost *= 0.95;
    
    return `KES ${Math.round(cost).toLocaleString()}`;
  };

  const steps = [
    { 
      step: '1', 
      title: 'Request Quote', 
      desc: 'Tell us your fuel type, volume, and delivery location',
      detailedDesc: 'Contact us via phone, email, or our online form. Our team responds within 30 minutes with a customized quote.',
      icon: <Package className="h-6 w-6" />,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      borderColor: 'border-blue-500'
    },
    { 
      step: '2', 
      title: 'Choose Fleet', 
      desc: 'Select the right tanker size for your needs',
      detailedDesc: 'We recommend the optimal tanker based on your volume. Choose from 5,000L to 40,000L capacity vehicles.',
      icon: <Truck className="h-6 w-6" />,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      borderColor: 'border-purple-500'
    },
    { 
      step: '3', 
      title: 'Track Delivery', 
      desc: 'Monitor your delivery in real-time with GPS',
      detailedDesc: 'Receive live tracking links via SMS and email. Watch your delivery approach in real-time with ETA updates.',
      icon: <Navigation className="h-6 w-6" />,
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50',
      borderColor: 'border-amber-500'
    },
    { 
      step: '4', 
      title: 'Receive Fuel', 
      desc: 'Safe delivery to your location with documentation',
      detailedDesc: 'Our certified drivers deliver safely to your site. Receive delivery notes, invoices, and quality certificates.',
      icon: <CheckCircle className="h-6 w-6" />,
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      borderColor: 'border-green-500'
    },
  ];

  // Auto-advance steps
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, steps.length]);

  const handleStepClick = (index) => {
    setActiveStep(index);
    setIsAutoPlaying(false);
    
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1920&q=80"
          alt="Fuel transport services"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-accent-900/85"></div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
            <CheckCircle className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">ISO Certified Fleet</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Professional Fuel Transport
          </h1>
          <p className="text-xl md:text-2xl text-neutral-100 max-w-3xl mx-auto mb-8 leading-relaxed">
            Safe, reliable fuel delivery with modern fleet and GPS tracking
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="inline-flex items-center gap-2 bg-primary-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-600 hover:scale-105 transition-all shadow-xl">
              Request Delivery
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all">
              <Phone className="h-5 w-5" />
              24/7 Hotline
            </button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-secondary-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="text-primary-400">{stat.icon}</div>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </div>
                <div className="text-sm text-neutral-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Fleet Selector */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-800 mb-4">
              Our Fleet
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Choose the right tanker size for your delivery needs
            </p>
          </div>

          {/* Fleet Type Selector */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {fleetTypes.map((fleet) => (
              <button
                key={fleet.id}
                onClick={() => setSelectedFleet(fleet.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  selectedFleet === fleet.id
                    ? 'bg-accent-500 text-white shadow-lg scale-105'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 shadow-md border-2 border-neutral-200'
                }`}
              >
                <div className="text-sm">{fleet.name}</div>
                <div className="text-lg font-bold">{fleet.capacityLabel}</div>
              </button>
            ))}
          </div>

          {/* Selected Fleet Details */}
          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl border-2 border-neutral-200 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image */}
              <div className="relative h-[400px] overflow-hidden group">
                <img
                  src={selectedFleetData.image}
                  alt={selectedFleetData.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-accent-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
                  {selectedFleetData.capacityLabel}
                </div>
              </div>

              {/* Details */}
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-16 h-16 bg-accent-100 rounded-xl flex items-center justify-center">
                    <Truck className="h-8 w-8 text-accent-600" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-secondary-900">{selectedFleetData.name}</h3>
                    <p className="text-accent-600 font-semibold">{selectedFleetData.wheels} Configuration</p>
                  </div>
                </div>

                {/* Specifications */}
                <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-neutral-50 rounded-xl">
                  <div className="text-center">
                    <div className="text-sm text-neutral-600">Length</div>
                    <div className="text-lg font-bold text-secondary-900">{selectedFleetData.specs.length}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-neutral-600">Width</div>
                    <div className="text-lg font-bold text-secondary-900">{selectedFleetData.specs.width}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-neutral-600">Weight</div>
                    <div className="text-lg font-bold text-secondary-900">{selectedFleetData.specs.weight}</div>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-secondary-900 mb-3">Key Features</h4>
                  <ul className="space-y-2">
                    {selectedFleetData.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-neutral-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Best For */}
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-secondary-900 mb-3">Best For</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedFleetData.bestFor.map((use, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-accent-50 border border-accent-200 text-accent-700 rounded-full text-sm font-medium"
                      >
                        {use}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Delivery Time */}
                <div className="flex items-center gap-2 p-4 bg-primary-50 border border-primary-200 rounded-xl">
                  <Clock className="h-5 w-5 text-primary-600" />
                  <div>
                    <div className="text-sm text-neutral-600">Typical Delivery Time</div>
                    <div className="font-semibold text-secondary-900">{selectedFleetData.deliveryTime}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Cost Calculator */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-800 mb-4">
              Calculate Delivery Cost
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Get instant pricing based on your location and order volume
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Zone Selector */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-secondary-900 mb-4">
                Select Your Delivery Zone
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {deliveryZones.map((zone) => {
                  const colorMap = {
                    green: 'border-green-500 bg-green-50 hover:bg-green-100',
                    blue: 'border-blue-500 bg-blue-50 hover:bg-blue-100',
                    amber: 'border-amber-500 bg-amber-50 hover:bg-amber-100',
                    red: 'border-red-500 bg-red-50 hover:bg-red-100',
                    purple: 'border-purple-500 bg-purple-50 hover:bg-purple-100',
                  };
                  const activeColorMap = {
                    green: 'bg-green-500 text-white',
                    blue: 'bg-blue-500 text-white',
                    amber: 'bg-amber-500 text-white',
                    red: 'bg-red-500 text-white',
                    purple: 'bg-purple-500 text-white',
                  };

                  return (
                    <button
                      key={zone.id}
                      onClick={() => setSelectedZone(zone.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedZone === zone.id
                          ? activeColorMap[zone.color]
                          : `${colorMap[zone.color]} border-2`
                      }`}
                    >
                      <MapPin className={`h-6 w-6 mx-auto mb-2 ${selectedZone === zone.id ? 'text-white' : ''}`} />
                      <div className={`text-sm font-semibold ${selectedZone === zone.id ? 'text-white' : 'text-neutral-800'}`}>
                        {zone.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Volume Input */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-secondary-900 mb-4">
                Order Volume (Liters)
              </label>
              <div className="relative">
                <input
                  type="range"
                  min="1000"
                  max="40000"
                  step="1000"
                  value={deliveryVolume}
                  onChange={(e) => setDeliveryVolume(Number(e.target.value))}
                  className="w-full h-3 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-neutral-600 mt-2">
                  <span>1,000L</span>
                  <span className="text-2xl font-bold text-accent-600">{deliveryVolume.toLocaleString()}L</span>
                  <span>40,000L</span>
                </div>
              </div>
            </div>

            {/* Cost Summary */}
            <div className="bg-neutral-50 rounded-2xl shadow-lg border-2 border-neutral-200 p-8">
              <div className="grid md:grid-cols-4 gap-6 mb-6">
                <div className="text-center p-6 bg-white rounded-xl shadow-md">
                  <MapPin className="h-8 w-8 text-primary-600 mx-auto mb-3" />
                  <div className="text-sm text-neutral-600 mb-1">Selected Zone</div>
                  <div className="text-xl font-bold text-secondary-900">{selectedZoneData.name}</div>
                </div>
                <div className="text-center p-6 bg-white rounded-xl shadow-md">
                  <Package className="h-8 w-8 text-accent-600 mx-auto mb-3" />
                  <div className="text-sm text-neutral-600 mb-1">Order Volume</div>
                  <div className="text-xl font-bold text-secondary-900">{deliveryVolume.toLocaleString()}L</div>
                </div>
                <div className="text-center p-6 bg-white rounded-xl shadow-md">
                  <Clock className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <div className="text-sm text-neutral-600 mb-1">Delivery Time</div>
                  <div className="text-xl font-bold text-secondary-900">{selectedZoneData.time}</div>
                </div>
                <div className="text-center p-6 bg-accent-500 rounded-xl shadow-md text-white">
                  <DollarSign className="h-8 w-8 mx-auto mb-3" />
                  <div className="text-sm mb-1">Estimated Cost</div>
                  <div className="text-2xl font-bold">{calculateEstimatedCost()}</div>
                </div>
              </div>

              <div className="text-center">
                <Link href="/delivery-zones">
                <button className="inline-flex items-center gap-2 bg-primary-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-600 hover:scale-105 transition-all shadow-lg">
                  View Full Delivery Zone Map
                  <Navigation className="h-5 w-5" />
                </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-Time Tracking Preview */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 rounded-full px-4 py-2 mb-6">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-semibold">Live Tracking</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-secondary-800 mb-6">
                  Track Your Delivery in Real-Time
                </h2>
                <p className="text-lg text-neutral-700 mb-6 leading-relaxed">
                  Every vehicle is equipped with GPS tracking. Monitor your delivery from dispatch to arrival with live updates and estimated arrival times.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-secondary-900">Live Location Updates</div>
                      <div className="text-neutral-600 text-sm">See exactly where your delivery is at any moment</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-secondary-900">ETA Notifications</div>
                      <div className="text-neutral-600 text-sm">Get SMS and email updates on arrival times</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-secondary-900">Driver Contact</div>
                      <div className="text-neutral-600 text-sm">Direct line to your delivery driver</div>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Tracking Demo */}
              <div className="bg-white rounded-2xl shadow-2xl border-2 border-neutral-200 p-6">
                <div className="bg-secondary-800 text-white rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold">Delivery #DN-2024-1234</div>
                    <div className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold">
                      In Transit
                    </div>
                  </div>
                  <div className="text-2xl font-bold">Medium Tanker - 10,000L</div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-secondary-900">Departed Depot</div>
                      <div className="text-sm text-neutral-600">10:30 AM - Nairobi Depot</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white animate-pulse">
                      <Navigation className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-secondary-900">En Route</div>
                      <div className="text-sm text-neutral-600">Current: Thika Road, 15km away</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-neutral-50 border-2 border-neutral-200 rounded-xl opacity-50">
                    <div className="w-12 h-12 bg-neutral-300 rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-neutral-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-neutral-700">Arriving Soon</div>
                      <div className="text-sm text-neutral-500">ETA: 11:45 AM</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-primary-50 border border-primary-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-700">Driver Contact:</span>
                    <button className="inline-flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-600">
                      <Phone className="h-4 w-4" />
                      Call Driver
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Compliance */}
      <section className="py-20 bg-secondary-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Safety First</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Safety & Compliance
            </h2>
            <p className="text-xl text-neutral-200 max-w-2xl mx-auto">
              Industry-leading safety standards and certifications
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {safetyFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
              >
                <div className="w-16 h-16 bg-primary-500 rounded-xl flex items-center justify-center mb-4 text-white">
                  {feature.icon}
                </div>
                <div className="inline-flex items-center px-3 py-1 bg-green-500/20 border border-green-400/30 text-green-300 rounded-full text-xs font-semibold mb-3">
                  {feature.badge}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-neutral-300 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary-800 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-neutral-600 mb-4">
            Simple, transparent delivery process from order to arrival
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-neutral-500">
            <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-green-500 animate-pulse' : 'bg-neutral-300'}`}></div>
            <span>{isAutoPlaying ? 'Auto-playing' : 'Paused'}</span>
          </div>
        </div>

        {/* Desktop View - Timeline */}
        <div className="hidden md:block max-w-6xl mx-auto mb-16">
          {/* Progress Line */}
          <div className="relative mb-12">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-neutral-200 -translate-y-1/2"></div>
            <div 
              className="absolute top-1/2 left-0 h-1 bg-primary-500 -translate-y-1/2 transition-all duration-500 ease-out"
              style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
            ></div>
            
            {/* Step Indicators */}
            <div className="relative flex justify-between">
              {steps.map((item, index) => (
                <button
                  key={item.step}
                  onClick={() => handleStepClick(index)}
                  className={`relative z-10 flex flex-col items-center group transition-all ${
                    index === activeStep ? 'scale-110' : 'scale-100'
                  }`}
                >
                  {/* Circle */}
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-300 ${
                      index <= activeStep
                        ? `${item.color} text-white shadow-lg`
                        : 'bg-white border-4 border-neutral-200 text-neutral-400'
                    }`}
                  >
                    {index <= activeStep ? (
                      <span>{item.step}</span>
                    ) : (
                      <span>{item.step}</span>
                    )}
                  </div>
                  
                  {/* Label */}
                  <div className="absolute top-20 text-center w-32">
                    <div className={`text-sm font-semibold transition-colors ${
                      index === activeStep ? 'text-secondary-900' : 'text-neutral-600'
                    }`}>
                      {item.title}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Step Details */}
          <div className="bg-neutral-50 rounded-2xl shadow-xl border-2 border-neutral-200 overflow-hidden">
            <div className={`h-2 ${steps[activeStep].color} transition-all duration-300`}></div>
            <div className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className={`inline-flex items-center justify-center w-20 h-20 ${steps[activeStep].lightColor} rounded-2xl mb-6`}>
                    <div className={`${steps[activeStep].color} text-white p-4 rounded-xl`}>
                      {steps[activeStep].icon}
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-secondary-900 mb-4">
                    Step {steps[activeStep].step}: {steps[activeStep].title}
                  </h3>
                  <p className="text-lg text-neutral-700 mb-4">
                    {steps[activeStep].desc}
                  </p>
                  <p className="text-neutral-600 leading-relaxed">
                    {steps[activeStep].detailedDesc}
                  </p>
                </div>
                
                {/* Visual Representation */}
                <div className={`relative h-64 ${steps[activeStep].lightColor} rounded-xl flex items-center justify-center`}>
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-32 h-32 ${steps[activeStep].color} text-white rounded-full mb-4 animate-pulse`}>
                      {steps[activeStep].icon}
                    </div>
                    <div className="text-2xl font-bold text-secondary-900">
                      {steps[activeStep].title}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View - Cards */}
        <div className="md:hidden space-y-6">
          {steps.map((item, index) => (
            <div
              key={item.step}
              onClick={() => handleStepClick(index)}
              className={`bg-neutral-50 rounded-2xl p-6 border-2 transition-all ${
                index === activeStep
                  ? `${item.borderColor} shadow-xl scale-105`
                  : 'border-neutral-200 shadow-md'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-12 h-12 ${item.color} text-white rounded-xl flex items-center justify-center text-xl font-bold`}>
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-secondary-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-neutral-700 text-sm mb-3">
                    {item.desc}
                  </p>
                  {index === activeStep && (
                    <div className={`${item.lightColor} p-4 rounded-lg mt-4 border ${item.borderColor}`}>
                      <p className="text-sm text-neutral-700">
                        {item.detailedDesc}
                      </p>
                    </div>
                  )}
                </div>
                <div className={`flex-shrink-0 ${item.lightColor} p-2 rounded-lg`}>
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <button
            onClick={() => setActiveStep((prev) => (prev - 1 + steps.length) % steps.length)}
            className="p-3 bg-white border-2 border-neutral-300 rounded-xl hover:bg-neutral-50 hover:border-primary-500 transition-all"
          >
            <ArrowRight className="h-5 w-5 rotate-180" />
          </button>
          
          {/* Step Dots */}
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => handleStepClick(index)}
                className={`transition-all rounded-full ${
                  index === activeStep
                    ? 'w-8 h-3 bg-primary-500'
                    : 'w-3 h-3 bg-neutral-300 hover:bg-neutral-400'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
            className="p-3 bg-white border-2 border-neutral-300 rounded-xl hover:bg-neutral-50 hover:border-primary-500 transition-all"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="ml-4 px-4 py-2 bg-white border-2 border-neutral-300 rounded-xl hover:bg-neutral-50 text-sm font-semibold transition-all"
          >
            {isAutoPlaying ? 'Pause' : 'Play'}
          </button>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <button className="inline-flex items-center gap-2 bg-primary-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-600 hover:scale-105 transition-all shadow-xl">
            Start Your Order
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>

      {/* Service Areas Overview */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-100 text-accent-600 rounded-2xl mb-6 shadow-md">
                <MapPin className="h-10 w-10" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-secondary-800 mb-4">
                We Deliver Across Kenya
              </h2>
              <p className="text-lg text-neutral-600">
                Comprehensive coverage from Nairobi to all major regions
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { region: 'Nairobi & Kiambu', areas: ['CBD', 'Westlands', 'Karen', 'Ruiru', 'Kikuyu'], time: '1-4 hours', color: 'green' },
                { region: 'Central Kenya', areas: ['Thika', 'Kiambu', 'Murang\'a', 'Nyeri', 'Nanyuki'], time: '3-6 hours', color: 'blue' },
                { region: 'Regional', areas: ['Nakuru', 'Mombasa', 'Kisumu', 'Eldoret', 'Meru'], time: '1-2 days', color: 'purple' },
              ].map((area, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 shadow-lg border-2 border-neutral-200 hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-3 h-3 rounded-full ${area.color === 'green' ? 'bg-green-500' : area.color === 'blue' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
                    <h3 className="text-xl font-bold text-secondary-900">{area.region}</h3>
                  </div>
                  <div className="flex items-center gap-2 mb-4 text-sm text-neutral-600">
                    <Clock className="h-4 w-4" />
                    <span>Typical delivery: {area.time}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {area.areas.map((loc, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-neutral-100 text-neutral-700 rounded-full">
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-primary-50 border-2 border-primary-200 rounded-2xl p-8 text-center">
              <Info className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <p className="text-secondary-800 text-lg font-medium mb-2">
                Don't see your area listed?
              </p>
              <p className="text-neutral-600 mb-4">
                Contact us to discuss custom delivery options and expanded coverage areas
              </p>
              <Link href="/contact">
              <button className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                Get in Touch
                <ArrowRight className="h-5 w-5" />
              </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

     

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1920&q=80"
          alt="Contact us for delivery"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-secondary-900/85"></div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Schedule a Delivery?
          </h2>
          <p className="text-xl text-neutral-200 max-w-3xl mx-auto mb-10 leading-relaxed">
            Get in touch with our logistics team for competitive pricing, flexible scheduling, and reliable service that keeps your operations running smoothly
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href='/contact'>
            <button className="inline-flex items-center gap-2 bg-primary-500 text-white px-10 py-5 rounded-xl text-lg font-semibold hover:bg-primary-600 hover:scale-105 transition-all shadow-xl">
              Request a Quote
              <ArrowRight className="h-5 w-5" />
            </button>
            </Link>
            <button className="inline-flex items-center gap-2 bg-accent-500 text-white px-10 py-5 rounded-xl text-lg font-semibold hover:bg-accent-600 hover:scale-105 transition-all shadow-xl">
              <Clock className="h-5 w-5" />
              Call 24/7 Hotline
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}