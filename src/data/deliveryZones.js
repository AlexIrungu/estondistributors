// src/data/deliveryZones.js

/**
 * Complete delivery zones configuration for Kenya
 * Organized by region with detailed area coverage
 */

export const DELIVERY_ZONES = {
  nairobi: {
    cbd: {
      id: 'nairobi-cbd',
      name: 'Nairobi CBD',
      baseCost: 0,
      freeDeliveryThreshold: 5000,
      radius: '5km',
      estimatedTime: '2-4 hours',
      areas: [
        'City Center',
        'CBD',
        'Westlands',
        'Kilimani',
        'Upper Hill',
        'Ngara',
        'Parklands (inner)',
        'Hurlingham'
      ],
      landmarks: [
        'Kenyatta International Convention Centre',
        'Nairobi Hospital',
        'Sarit Centre',
        'Westgate Mall'
      ]
    },
    inner: {
      id: 'nairobi-inner',
      name: 'Nairobi Inner Suburbs',
      baseCost: 2000,
      freeDeliveryThreshold: null,
      radius: '5-10km',
      estimatedTime: '4-6 hours',
      areas: [
        'Karen',
        'Lavington',
        'Parklands (outer)',
        'South C',
        'South B',
        'Donholm',
        'Buruburu',
        'Eastlands',
        'Nairobi West',
        'Langata',
        'Woodley',
        'Dagoretti',
        'Kilimani (outer)',
        'Kasarani (inner)',
        'Embakasi (inner)'
      ]
    },
    outer: {
      id: 'nairobi-outer',
      name: 'Nairobi Outer Suburbs',
      baseCost: 3500,
      freeDeliveryThreshold: null,
      radius: '10-25km',
      estimatedTime: '6-8 hours',
      areas: [
        'Ruiru',
        'Ngong',
        'Rongai',
        'Kitengela',
        'Ruaka',
        'Banana',
        'Githurai',
        'Kahawa',
        'Zimmerman',
        'Kasarani (outer)',
        'Embakasi (outer)',
        'Syokimau',
        'Mlolongo',
        'Athi River (town)'
      ]
    }
  },
  kiambu: {
    id: 'kiambu-county',
    name: 'Kiambu County',
    baseCost: 5000,
    freeDeliveryThreshold: null,
    radius: '25-50km',
    estimatedTime: '8-12 hours',
    areas: [
      'Thika',
      'Kikuyu',
      'Limuru',
      'Kiambu Town',
      'Juja',
      'Karuri',
      'Gatundu',
      'Gatanga',
      'Lari'
    ],
    majorTowns: ['Thika', 'Kikuyu', 'Limuru', 'Kiambu']
  },
  regional: {
    central: {
      id: 'central-region',
      name: 'Central Kenya',
      baseCost: 8000,
      estimatedTime: '1-2 days',
      counties: ['Nyeri', 'Murang\'a', 'Nyandarua', 'Kirinyaga', 'Embu', 'Meru', 'Tharaka Nithi'],
      majorTowns: ['Nyeri', 'Murang\'a', 'Nanyuki', 'Embu', 'Meru']
    },
    eastern: {
      id: 'eastern-region',
      name: 'Eastern Kenya',
      baseCost: 10000,
      estimatedTime: '1-3 days',
      counties: ['Machakos', 'Makueni', 'Kitui', 'Marsabit', 'Isiolo'],
      majorTowns: ['Machakos', 'Makueni', 'Kitui', 'Marsabit']
    },
    coast: {
      id: 'coast-region',
      name: 'Coast Region',
      baseCost: 15000,
      estimatedTime: '2-3 days',
      counties: ['Mombasa', 'Kilifi', 'Kwale', 'Taita-Taveta', 'Lamu', 'Tana River'],
      majorTowns: ['Mombasa', 'Kilifi', 'Malindi', 'Voi']
    },
    western: {
      id: 'western-region',
      name: 'Western Kenya',
      baseCost: 12000,
      estimatedTime: '1-2 days',
      counties: ['Kisumu', 'Kakamega', 'Bungoma', 'Busia', 'Vihiga', 'Siaya', 'Homa Bay'],
      majorTowns: ['Kisumu', 'Kakamega', 'Bungoma', 'Busia']
    },
    riftValley: {
      id: 'rift-valley-region',
      name: 'Rift Valley',
      baseCost: 10000,
      estimatedTime: '1-2 days',
      counties: ['Nakuru', 'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Uasin Gishu', 'Trans Nzoia', 'Nandi', 'Baringo', 'Laikipia', 'Samburu', 'West Pokot', 'Turkana', 'Elgeyo-Marakwet'],
      majorTowns: ['Nakuru', 'Eldoret', 'Naivasha', 'Kericho', 'Narok']
    }
  }
};

/**
 * Emergency delivery multipliers
 */
export const URGENCY_LEVELS = {
  standard: {
    multiplier: 1.0,
    name: 'Standard Delivery',
    description: 'Business hours (8AM - 6PM)',
    availability: 'Mon-Fri'
  },
  express: {
    multiplier: 1.5,
    name: 'Express Delivery',
    description: 'Same-day priority',
    availability: 'Mon-Sat'
  },
  emergency: {
    multiplier: 2.0,
    name: 'Emergency 24/7',
    description: 'Immediate response',
    availability: '24/7 including holidays'
  }
};

/**
 * Volume-based delivery discounts
 */
export const VOLUME_DISCOUNTS = [
  { minVolume: 0, maxVolume: 4999, discount: 0, label: 'Standard' },
  { minVolume: 5000, maxVolume: 9999, discount: 0.10, label: '10% Off' },
  { minVolume: 10000, maxVolume: 24999, discount: 0.20, label: '20% Off' },
  { minVolume: 25000, maxVolume: Infinity, discount: 0.30, label: '30% Off' }
];

/**
 * Helper function to get delivery zone by ID
 */
export function getZoneById(zoneId) {
  // Search in Nairobi zones
  for (const zone of Object.values(DELIVERY_ZONES.nairobi)) {
    if (zone.id === zoneId) return zone;
  }
  
  // Search in Kiambu
  if (DELIVERY_ZONES.kiambu.id === zoneId) {
    return DELIVERY_ZONES.kiambu;
  }
  
  // Search in regional zones
  for (const region of Object.values(DELIVERY_ZONES.regional)) {
    if (region.id === zoneId) return region;
  }
  
  return null;
}

/**
 * Find zone by area name
 */
export function findZoneByAreaName(areaName) {
  const searchTerm = areaName.toLowerCase().trim();
  
  // Search Nairobi zones
  for (const zone of Object.values(DELIVERY_ZONES.nairobi)) {
    if (zone.areas && zone.areas.some(area => 
      area.toLowerCase().includes(searchTerm) || searchTerm.includes(area.toLowerCase())
    )) {
      return zone;
    }
  }
  
  // Search Kiambu
  if (DELIVERY_ZONES.kiambu.areas && DELIVERY_ZONES.kiambu.areas.some(area =>
    area.toLowerCase().includes(searchTerm) || searchTerm.includes(area.toLowerCase())
  )) {
    return DELIVERY_ZONES.kiambu;
  }
  
  // Search regional zones
  for (const region of Object.values(DELIVERY_ZONES.regional)) {
    if (region.majorTowns && region.majorTowns.some(town =>
      town.toLowerCase().includes(searchTerm) || searchTerm.includes(town.toLowerCase())
    )) {
      return region;
    }
  }
  
  return null;
}

/**
 * Get volume discount percentage
 */
export function getVolumeDiscountPercent(volume) {
  const discount = VOLUME_DISCOUNTS.find(
    d => volume >= d.minVolume && volume <= d.maxVolume
  );
  return discount ? discount.discount : 0;
}

/**
 * Calculate delivery cost with all factors
 */
export function calculateFullDeliveryCost(zoneId, volume, urgency = 'standard') {
  const zone = getZoneById(zoneId);
  if (!zone) return null;

  const urgencyLevel = URGENCY_LEVELS[urgency];
  if (!urgencyLevel) return null;

  // Check for free delivery
  if (zone.freeDeliveryThreshold && volume >= zone.freeDeliveryThreshold) {
    return {
      baseCost: zone.baseCost,
      urgencyCost: 0,
      volumeDiscount: 0,
      finalCost: 0,
      isFree: true,
      zone: zone.name,
      estimatedTime: zone.estimatedTime
    };
  }

  // Calculate costs
  const baseCost = zone.baseCost;
  const urgencyCost = baseCost * urgencyLevel.multiplier;
  const volumeDiscountPercent = getVolumeDiscountPercent(volume);
  const volumeDiscount = urgencyCost * volumeDiscountPercent;
  const finalCost = urgencyCost - volumeDiscount;

  return {
    baseCost,
    urgencyCost,
    volumeDiscount,
    finalCost,
    isFree: false,
    zone: zone.name,
    estimatedTime: zone.estimatedTime,
    urgencyLevel: urgencyLevel.name,
    volumeDiscountPercent: volumeDiscountPercent * 100
  };
}

export default DELIVERY_ZONES;