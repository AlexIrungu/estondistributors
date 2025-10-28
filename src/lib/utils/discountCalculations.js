// src/lib/utils/discountCalculations.js

/**
 * Bulk Discount Tiers for Fuel Orders
 * Based on Kenya fuel distribution industry standards
 */
export const DISCOUNT_TIERS = [
  { min: 0, max: 999, discount: 0, name: 'Standard', color: 'neutral' },
  { min: 1000, max: 4999, discount: 2.5, name: 'Bronze', color: 'amber' },
  { min: 5000, max: 9999, discount: 5, name: 'Silver', color: 'neutral' },
  { min: 10000, max: 24999, discount: 7.5, name: 'Gold', color: 'yellow' },
  { min: 25000, max: Infinity, discount: 10, name: 'Platinum', color: 'primary' }
];

/**
 * Get discount tier for a given volume
 * @param {number} volume - Order volume in liters
 * @returns {object} - Discount tier object
 */
export function getDiscountTier(volume) {
  return DISCOUNT_TIERS.find(tier => volume >= tier.min && volume <= tier.max) || DISCOUNT_TIERS[0];
}

/**
 * Calculate bulk discount for an order
 * @param {number} basePrice - Base price per liter
 * @param {number} volume - Order volume in liters
 * @returns {object} - Discount calculation results
 */
export function calculateBulkDiscount(basePrice, volume) {
  const tier = getDiscountTier(volume);
  
  const discountAmount = basePrice * (tier.discount / 100);
  const discountedPrice = basePrice - discountAmount;
  const totalBaseCost = basePrice * volume;
  const totalDiscountedCost = discountedPrice * volume;
  const totalSavings = totalBaseCost - totalDiscountedCost;

  return {
    tier,
    basePrice,
    discountedPrice,
    discountPercentage: tier.discount,
    discountAmount,
    totalBaseCost,
    totalDiscountedCost,
    totalSavings,
    volume
  };
}

/**
 * Calculate savings compared to competitor price
 * @param {number} competitorPrice - Competitor's price per liter
 * @param {number} ourPrice - Our price per liter
 * @param {number} monthlyVolume - Monthly consumption in liters
 * @returns {object} - Savings calculation
 */
export function calculateSavings(competitorPrice, ourPrice, monthlyVolume) {
  const monthlyCompetitorCost = competitorPrice * monthlyVolume;
  const monthlyOurCost = ourPrice * monthlyVolume;
  const monthlySavings = monthlyCompetitorCost - monthlyOurCost;
  const yearlySavings = monthlySavings * 12;
  const savingsPercentage = (monthlySavings / monthlyCompetitorCost) * 100;

  return {
    monthlyCompetitorCost,
    monthlyOurCost,
    monthlySavings,
    yearlySavings,
    savingsPercentage: savingsPercentage.toFixed(2),
    pricePerLiterSavings: competitorPrice - ourPrice
  };
}

/**
 * Get next tier information
 * @param {number} currentVolume - Current order volume
 * @returns {object|null} - Next tier info or null if at max tier
 */
export function getNextTierInfo(currentVolume) {
  const currentTier = getDiscountTier(currentVolume);
  const currentIndex = DISCOUNT_TIERS.indexOf(currentTier);
  
  if (currentIndex >= DISCOUNT_TIERS.length - 1) {
    return null;
  }

  const nextTier = DISCOUNT_TIERS[currentIndex + 1];
  const volumeToNextTier = nextTier.min - currentVolume;

  return {
    nextTier,
    volumeToNextTier,
    additionalDiscount: nextTier.discount - currentTier.discount
  };
}

/**
 * Calculate total order cost including discounts
 * @param {number} basePrice - Base price per liter
 * @param {number} volume - Order volume
 * @param {number} deliveryCost - Delivery cost (optional)
 * @returns {object} - Complete order calculation
 */
export function calculateOrderTotal(basePrice, volume, deliveryCost = 0) {
  const discount = calculateBulkDiscount(basePrice, volume);
  const fuelCost = discount.totalDiscountedCost;
  const grandTotal = fuelCost + deliveryCost;

  return {
    ...discount,
    deliveryCost,
    fuelCost,
    grandTotal,
    breakdown: {
      fuel: fuelCost,
      delivery: deliveryCost,
      total: grandTotal
    }
  };
}

/**
 * Format currency for display (Kenya Shillings)
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted currency string
 */
export function formatKES(amount) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Format price per liter
 * @param {number} price - Price per liter
 * @returns {string} - Formatted price
 */
export function formatPricePerLiter(price) {
  return `KES ${price.toFixed(2)}/L`;
}