// src/lib/utils/deliveryCalculations.js

/**
 * Delivery zones for Nairobi and surrounding areas
 * Prices based on distance and logistics costs
 */
export const DELIVERY_ZONES = [
  {
    id: 'nairobi-cbd',
    name: 'Nairobi CBD',
    baseCost: 0,
    description: 'Within city center - Free delivery',
    areas: ['City Center', 'Westlands', 'Kilimani', 'Upper Hill', 'Parklands'],
    deliveryTime: '2-4 hours',
    color: 'primary',
    freeDeliveryThreshold: 5000 // liters
  },
  {
    id: 'nairobi-inner',
    name: 'Nairobi Inner Suburbs',
    baseCost: 2000,
    description: 'Within 10km radius',
    areas: ['Karen', 'Lavington', 'Parklands', 'South C', 'Donholm', 'Buruburu', 'Eastlands'],
    deliveryTime: '4-6 hours',
    color: 'accent',
    freeDeliveryThreshold: null
  },
  {
    id: 'nairobi-outer',
    name: 'Nairobi Outer Suburbs',
    baseCost: 3500,
    description: '10-25km radius',
    areas: ['Ruiru', 'Ngong', 'Rongai', 'Kitengela', 'Ruaka', 'Banana', 'Githurai'],
    deliveryTime: '6-8 hours',
    color: 'amber',
    freeDeliveryThreshold: null
  },
  {
    id: 'kiambu-county',
    name: 'Kiambu County',
    baseCost: 5000,
    description: 'Beyond 25km',
    areas: ['Thika', 'Kikuyu', 'Limuru', 'Kiambu Town', 'Juja'],
    deliveryTime: '8-12 hours',
    color: 'orange',
    freeDeliveryThreshold: null
  },
  {
    id: 'regional',
    name: 'Regional Delivery',
    baseCost: 8000,
    description: 'Other counties',
    areas: ['Nakuru', 'Mombasa', 'Kisumu', 'Eldoret', 'Nyeri', 'Machakos'],
    deliveryTime: '1-2 days',
    color: 'red',
    freeDeliveryThreshold: null
  }
];

/**
 * Urgency multipliers for delivery
 */
export const URGENCY_OPTIONS = [
  { 
    value: 'standard', 
    label: 'Standard Delivery', 
    multiplier: 1, 
    description: 'Normal business hours (8AM - 6PM)' 
  },
  { 
    value: 'express', 
    label: 'Express Delivery', 
    multiplier: 1.5, 
    description: 'Priority service (same-day guaranteed)' 
  },
  { 
    value: 'emergency', 
    label: 'Emergency 24/7', 
    multiplier: 2, 
    description: 'Immediate response (any time)' 
  }
];

/**
 * Get delivery zone by ID
 * @param {string} zoneId - Zone identifier
 * @returns {object|null} - Zone object or null
 */
export function getDeliveryZone(zoneId) {
  return DELIVERY_ZONES.find(zone => zone.id === zoneId) || null;
}

/**
 * Calculate volume-based delivery discount
 * @param {number} volume - Order volume in liters
 * @returns {number} - Discount percentage (0-1)
 */
export function getVolumeDiscount(volume) {
  if (volume >= 25000) return 0.30; // 30% off
  if (volume >= 10000) return 0.20; // 20% off
  if (volume >= 5000) return 0.10;  // 10% off
  return 0;
}

/**
 * Calculate delivery cost
 * @param {string} zoneId - Delivery zone ID
 * @param {number} volume - Order volume in liters
 * @param {string} urgency - Urgency level (standard/express/emergency)
 * @returns {object} - Delivery cost calculation
 */
export function calculateDeliveryCost(zoneId, volume, urgency = 'standard') {
  const zone = getDeliveryZone(zoneId);
  const urgencyOption = URGENCY_OPTIONS.find(u => u.value === urgency);

  if (!zone || !urgencyOption) {
    throw new Error('Invalid zone or urgency option');
  }

  // Check for free delivery
  const isFreeDelivery = zone.freeDeliveryThreshold && volume >= zone.freeDeliveryThreshold;

  if (isFreeDelivery) {
    return {
      zone,
      urgency: urgencyOption,
      volume,
      baseDeliveryCost: zone.baseCost,
      urgencyMultiplier: 1,
      urgencyCost: 0,
      volumeDiscountPercent: 0,
      volumeDiscount: 0,
      finalDeliveryCost: 0,
      isFreeDelivery: true,
      deliveryTime: zone.deliveryTime,
      breakdown: {
        base: zone.baseCost,
        urgency: 0,
        discount: 0,
        final: 0
      }
    };
  }

  // Calculate base cost with urgency
  let deliveryCost = zone.baseCost * urgencyOption.multiplier;

  // Apply volume discount
  const volumeDiscountPercent = getVolumeDiscount(volume);
  const volumeDiscount = deliveryCost * volumeDiscountPercent;
  const finalDeliveryCost = Math.max(0, deliveryCost - volumeDiscount);

  return {
    zone,
    urgency: urgencyOption,
    volume,
    baseDeliveryCost: zone.baseCost,
    urgencyMultiplier: urgencyOption.multiplier,
    urgencyCost: deliveryCost,
    volumeDiscountPercent,
    volumeDiscount,
    finalDeliveryCost,
    isFreeDelivery: false,
    deliveryTime: zone.deliveryTime,
    breakdown: {
      base: zone.baseCost,
      urgency: deliveryCost - zone.baseCost,
      discount: volumeDiscount,
      final: finalDeliveryCost
    }
  };
}

/**
 * Find zone by area name
 * @param {string} areaName - Area name to search for
 * @returns {object|null} - Zone object or null
 */
export function findZoneByArea(areaName) {
  const searchTerm = areaName.toLowerCase();
  return DELIVERY_ZONES.find(zone => 
    zone.areas.some(area => area.toLowerCase().includes(searchTerm))
  ) || null;
}

/**
 * Calculate total order cost (fuel + delivery)
 * @param {number} fuelCost - Cost of fuel
 * @param {number} deliveryCost - Delivery cost
 * @param {number} taxRate - Tax rate (optional, default 0)
 * @returns {object} - Total cost breakdown
 */
export function calculateTotalOrderCost(fuelCost, deliveryCost, taxRate = 0) {
  const subtotal = fuelCost + deliveryCost;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return {
    fuelCost,
    deliveryCost,
    subtotal,
    tax,
    total,
    breakdown: {
      fuel: fuelCost,
      delivery: deliveryCost,
      tax: tax,
      total: total
    }
  };
}

/**
 * Get estimated delivery time range
 * @param {string} zoneId - Delivery zone ID
 * @param {string} urgency - Urgency level
 * @returns {string} - Delivery time estimate
 */
export function getDeliveryTimeEstimate(zoneId, urgency = 'standard') {
  const zone = getDeliveryZone(zoneId);
  if (!zone) return 'Unknown';

  if (urgency === 'emergency') {
    return 'Within 2 hours';
  }

  if (urgency === 'express') {
    const [minTime] = zone.deliveryTime.split('-');
    return `Within ${minTime}`;
  }

  return zone.deliveryTime;
}

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted currency
 */
export function formatKES(amount) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0
  }).format(amount);
}