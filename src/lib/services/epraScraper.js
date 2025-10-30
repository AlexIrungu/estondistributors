// src/lib/services/epraScraper.js

/**
 * EPRA Web Scraper Service
 * Fetches current fuel prices from EPRA website
 * 
 * Note: Install cheerio first: npm install cheerio
 */

const EPRA_URLS = {
  main: 'https://www.epra.go.ke',
  pumpPrices: 'https://www.epra.go.ke/pump-prices',
  pressReleases: 'https://www.epra.go.ke/EPRA%20Pump%20Prices'
};

/**
 * Scrape current fuel prices from EPRA website
 */
export async function scrapeEPRAPrices() {
  try {
    console.log('Fetching EPRA prices from:', EPRA_URLS.pumpPrices);
    
    // Fetch the pump prices page
    const response = await fetch(EPRA_URLS.pumpPrices, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      next: { revalidate: 86400 } // Cache for 24 hours (EPRA updates monthly)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    
    // Parse the HTML to extract prices
    const prices = parseEPRAHTML(html);
    
    if (!prices || Object.keys(prices.locations).length === 0) {
      throw new Error('No price data extracted from EPRA website');
    }
    
    return {
      success: true,
      data: prices,
      lastUpdated: new Date().toISOString(),
      source: 'EPRA Kenya'
    };

  } catch (error) {
    console.error('Error scraping EPRA:', error);
    
    return {
      success: false,
      error: error.message,
      fallback: true
    };
  }
}

/**
 * Parse EPRA HTML to extract fuel prices
 * Based on the FUEL PRICE INDEX structure
 */
function parseEPRAHTML(html) {
  // Extract the FUEL PRICE INDEX section
  const fuelPriceIndexMatch = html.match(/FUEL PRICE INDEX[^]*?(?=FULL PRICE LIST|$)/i);
  
  if (!fuelPriceIndexMatch) {
    console.warn('Could not find FUEL PRICE INDEX in HTML');
    return null;
  }

  const priceText = fuelPriceIndexMatch[0];
  
  // Extract effective date period
  const dateMatch = html.match(/from\s+(\d+(?:st|nd|rd|th)\s+\w+\s+\d{4})\s+to\s+(\d+(?:st|nd|rd|th)\s+\w+\s+\d{4})/i);
  const effectiveDate = dateMatch 
    ? `${dateMatch[1]} to ${dateMatch[2]}`
    : 'Current month';

  const locations = {};
  
  // Define the cities we're tracking
  const cities = ['Mombasa', 'Nairobi', 'Nakuru', 'Eldoret', 'Kisumu'];
  const fuelTypes = {
    'PMS': { key: 'pms', label: 'Super Petrol' },
    'AGO': { key: 'ago', label: 'Diesel' },
    'IK': { key: 'ik', label: 'Kerosene' }
  };

  // Parse each city and fuel type
  cities.forEach(city => {
    const cityKey = city.toLowerCase();
    locations[cityKey] = {
      name: city,
      prices: {}
    };

    Object.entries(fuelTypes).forEach(([fuelCode, fuelInfo]) => {
      // Pattern: "Mombasa PMS 182.03 ▼ -0.54%"
      const pattern = new RegExp(
        `${city}\\s+${fuelCode}\\s+([\\d.]+)\\s*([▼▲■])?\\s*([+-]?[\\d.]+%)?`,
        'i'
      );
      
      const match = priceText.match(pattern);
      
      if (match) {
        const price = parseFloat(match[1]);
        const trend = match[2] || '■';
        const changeStr = match[3] || '0.00%';
        const change = parseFloat(changeStr.replace('%', ''));
        
        locations[cityKey].prices[fuelInfo.key] = {
          price: price,
          change: change,
          trend: trend === '▲' ? 'up' : trend === '▼' ? 'down' : 'stable',
          label: fuelInfo.label,
          unit: 'KES/Litre'
        };
      } else {
        console.warn(`Could not extract ${fuelCode} price for ${city}`);
      }
    });
  });

  return {
    lastUpdated: new Date().toISOString(),
    effectiveDate: effectiveDate,
    source: 'EPRA Kenya',
    locations: locations
  };
}

/**
 * Cache for EPRA prices (server-side only)
 */
let epraPriceCache = {
  data: null,
  timestamp: null,
  cacheDuration: 24 * 60 * 60 * 1000 // 24 hours (EPRA updates monthly on 15th)
};

/**
 * Get EPRA prices with caching
 */
export async function getEPRAPrices(forceRefresh = false) {
  // Check cache first (unless force refresh)
  if (!forceRefresh && epraPriceCache.data && epraPriceCache.timestamp) {
    const now = Date.now();
    const age = now - epraPriceCache.timestamp;
    
    if (age < epraPriceCache.cacheDuration) {
      console.log('Returning cached EPRA prices (age: ' + Math.round(age / 1000 / 60) + ' minutes)');
      return {
        success: true,
        data: epraPriceCache.data,
        cached: true,
        cacheAge: age
      };
    }
  }

  // Scrape fresh data
  const result = await scrapeEPRAPrices();
  
  if (result.success) {
    // Update cache
    epraPriceCache.data = result.data;
    epraPriceCache.timestamp = Date.now();
    
    return result;
  }

  // If scraping fails but we have stale cache, return it
  if (epraPriceCache.data) {
    console.log('Scraping failed, returning stale cache');
    return {
      success: true,
      data: epraPriceCache.data,
      stale: true,
      note: 'Using stale cached data due to scraping failure'
    };
  }

  // Complete failure
  return result;
}

/**
 * Manually clear EPRA cache (useful for testing or manual refresh)
 */
export function clearEPRACache() {
  epraPriceCache = {
    data: null,
    timestamp: null,
    cacheDuration: 24 * 60 * 60 * 1000
  };
  console.log('EPRA price cache cleared');
}

/**
 * Get cache status
 */
export function getEPRACacheStatus() {
  if (!epraPriceCache.data || !epraPriceCache.timestamp) {
    return {
      cached: false,
      message: 'No cached data available'
    };
  }

  const now = Date.now();
  const age = now - epraPriceCache.timestamp;
  const isValid = age < epraPriceCache.cacheDuration;
  const expiresIn = Math.max(0, epraPriceCache.cacheDuration - age);

  return {
    cached: true,
    isValid: isValid,
    age: age,
    ageMinutes: Math.round(age / 1000 / 60),
    ageHours: Math.round(age / 1000 / 60 / 60),
    expiresIn: expiresIn,
    expiresInMinutes: Math.round(expiresIn / 1000 / 60),
    lastUpdated: new Date(epraPriceCache.timestamp).toISOString()
  };
}