// src/lib/services/crudeOilService.js
// Unified Crude Oil Service - Works on both client and server

const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours

// In-memory cache for server-side
let serverCache = {
  wti: null,
  brent: null,
  exchangeRate: null,
  lastFetch: {
    wti: null,
    brent: null,
    exchangeRate: null
  }
};

/**
 * Get API key from environment
 */
function getApiKey() {
  // Try server-side first, then client-side
  return process.env.ALPHA_VANTAGE_API_KEY || 
         process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;
}

/**
 * Check if running on server
 */
const isServer = typeof window === 'undefined';

/**
 * Get cached data - works on both client and server
 */
function getCachedData(key) {
  // Server-side cache
  if (isServer) {
    if (!serverCache[key] || !serverCache.lastFetch[key]) return null;
    
    const now = Date.now();
    if (now - serverCache.lastFetch[key] < CACHE_DURATION) {
      return serverCache[key];
    }
    return null;
  }
  
  // Client-side cache (localStorage)
  try {
    const cached = localStorage.getItem(`crude_oil_${key}`);
    if (!cached) return null;
    
    const data = JSON.parse(cached);
    const now = Date.now();
    
    if (now - data.timestamp < CACHE_DURATION) {
      return data.value;
    }
    return null;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
}

/**
 * Save data to cache - works on both client and server
 */
function cacheData(key, value) {
  // Server-side cache
  if (isServer) {
    serverCache[key] = value;
    serverCache.lastFetch[key] = Date.now();
    return;
  }
  
  // Client-side cache
  try {
    const data = {
      value,
      timestamp: Date.now()
    };
    localStorage.setItem(`crude_oil_${key}`, JSON.stringify(data));
  } catch (error) {
    console.error('Error caching data:', error);
  }
}

/**
 * Fetch WTI Crude Oil prices from Alpha Vantage
 */
export async function getWTICrudePrice() {
  // Check cache first
  const cached = getCachedData('wti');
  if (cached) {
    console.log('Returning cached WTI data');
    return cached;
  }
  
  try {
    const apiKey = getApiKey();
    
    if (!apiKey) {
      console.warn('Alpha Vantage API key not configured, using mock data');
      return getMockWTIData();
    }
    
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=WTI&interval=daily&apikey=${apiKey}`,
      { next: { revalidate: 43200 } } // 12 hours for Next.js cache
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Handle API errors
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }
    
    // Handle rate limiting
    if (data['Note'] || data['Information']) {
      console.warn('Alpha Vantage rate limit reached, using mock data');
      return getMockWTIData();
    }
    
    const timeSeries = data.data || [];
    if (!timeSeries || timeSeries.length === 0) {
      throw new Error('No data returned from API');
    }
    
    const latest = timeSeries[0];
    
    // Get historical data for trends (last 30 days)
    const historical = timeSeries.slice(0, 30).map(item => ({
      date: item.date,
      price: parseFloat(item.value)
    }));
    
    const wtiData = {
      current: {
        price: parseFloat(latest.value),
        date: latest.date,
        unit: 'USD per barrel'
      },
      historical,
      source: 'Alpha Vantage',
      isMock: false
    };
    
    // Cache the result
    cacheData('wti', wtiData);
    
    return wtiData;
    
  } catch (error) {
    console.error('Error fetching WTI price:', error);
    return getMockWTIData();
  }
}

/**
 * Fetch Brent Crude Oil prices from Alpha Vantage
 */
export async function getBrentCrudePrice() {
  const cached = getCachedData('brent');
  if (cached) {
    console.log('Returning cached Brent data');
    return cached;
  }
  
  try {
    const apiKey = getApiKey();
    
    if (!apiKey) {
      console.warn('Alpha Vantage API key not configured, using mock data');
      return getMockBrentData();
    }
    
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=BRENT&interval=daily&apikey=${apiKey}`,
      { next: { revalidate: 43200 } }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }
    
    if (data['Note'] || data['Information']) {
      console.warn('Alpha Vantage rate limit reached, using mock data');
      return getMockBrentData();
    }
    
    const timeSeries = data.data || [];
    if (!timeSeries || timeSeries.length === 0) {
      throw new Error('No data returned from API');
    }
    
    const latest = timeSeries[0];
    const historical = timeSeries.slice(0, 30).map(item => ({
      date: item.date,
      price: parseFloat(item.value)
    }));
    
    const brentData = {
      current: {
        price: parseFloat(latest.value),
        date: latest.date,
        unit: 'USD per barrel'
      },
      historical,
      source: 'Alpha Vantage',
      isMock: false
    };
    
    cacheData('brent', brentData);
    
    return brentData;
    
  } catch (error) {
    console.error('Error fetching Brent price:', error);
    return getMockBrentData();
  }
}

/**
 * Get USD/KES exchange rate from Alpha Vantage
 */
export async function getUSDKESRate() {
  const cached = getCachedData('exchangeRate');
  if (cached) {
    console.log('Returning cached exchange rate');
    return cached;
  }
  
  try {
    const apiKey = getApiKey();
    
    if (!apiKey) {
      console.warn('Alpha Vantage API key not configured, using mock rate');
      return getMockExchangeRate();
    }
    
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=KES&apikey=${apiKey}`,
      { next: { revalidate: 43200 } }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }
    
    if (data['Note'] || data['Information']) {
      console.warn('Alpha Vantage rate limit reached, using mock rate');
      return getMockExchangeRate();
    }
    
    const exchangeData = data['Realtime Currency Exchange Rate'];
    if (!exchangeData) {
      throw new Error('No exchange rate data returned');
    }
    
    const rateData = {
      rate: parseFloat(exchangeData['5. Exchange Rate']),
      lastRefreshed: exchangeData['6. Last Refreshed'],
      fromCurrency: 'USD',
      toCurrency: 'KES',
      bidPrice: parseFloat(exchangeData['8. Bid Price']),
      askPrice: parseFloat(exchangeData['9. Ask Price']),
      source: 'Alpha Vantage',
      isMock: false
    };
    
    cacheData('exchangeRate', rateData);
    
    return rateData;
    
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return getMockExchangeRate();
  }
}

/**
 * Get all crude oil prices (WTI and Brent)
 */
export async function getAllCrudePrices() {
  try {
    const [wti, brent] = await Promise.all([
      getWTICrudePrice(),
      getBrentCrudePrice()
    ]);
    
    return {
      success: true,
      wti,
      brent,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching all crude prices:', error);
    return {
      success: false,
      error: error.message,
      wti: getMockWTIData(),
      brent: getMockBrentData()
    };
  }
}

/**
 * Mock data for development/fallback
 */
function getMockWTIData() {
  const today = new Date();
  const historical = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    return {
      date: date.toISOString().split('T')[0],
      price: 73.45 + (Math.random() * 4 - 2) // Random variation ±2
    };
  });
  
  return {
    current: {
      price: 73.45,
      date: today.toISOString().split('T')[0],
      unit: 'USD per barrel'
    },
    historical,
    source: 'Mock Data',
    isMock: true
  };
}

function getMockBrentData() {
  const today = new Date();
  const historical = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    return {
      date: date.toISOString().split('T')[0],
      price: 78.20 + (Math.random() * 4 - 2)
    };
  });
  
  return {
    current: {
      price: 78.20,
      date: today.toISOString().split('T')[0],
      unit: 'USD per barrel'
    },
    historical,
    source: 'Mock Data',
    isMock: true
  };
}

function getMockExchangeRate() {
  return {
    rate: 129.50,
    lastRefreshed: new Date().toISOString(),
    fromCurrency: 'USD',
    toCurrency: 'KES',
    bidPrice: 129.45,
    askPrice: 129.55,
    source: 'Mock Data',
    isMock: true
  };
}

/**
 * Calculate correlation between crude oil and local fuel prices
 */
export function calculateCorrelation(crudePrice, localPrice) {
  // Simplified correlation calculation
  // In production, use historical data for accurate correlation
  const estimatedCorrelation = 0.75; // 75% correlation (typical for fuel markets)
  return estimatedCorrelation;
}

/**
 * Clear all caches
 */
export function clearCrudeCache() {
  // Clear server cache
  if (isServer) {
    serverCache = {
      wti: null,
      brent: null,
      exchangeRate: null,
      lastFetch: { wti: null, brent: null, exchangeRate: null }
    };
  }
  
  // Clear client cache
  if (!isServer) {
    try {
      localStorage.removeItem('crude_oil_wti');
      localStorage.removeItem('crude_oil_brent');
      localStorage.removeItem('crude_oil_exchangeRate');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
}

/**
 * Get cache status
 */
export function getCacheStatus() {
  if (isServer) {
    return {
      wti: {
        cached: serverCache.wti !== null,
        lastFetch: serverCache.lastFetch.wti,
        expiresIn: serverCache.lastFetch.wti 
          ? Math.max(0, CACHE_DURATION - (Date.now() - serverCache.lastFetch.wti))
          : 0
      },
      brent: {
        cached: serverCache.brent !== null,
        lastFetch: serverCache.lastFetch.brent,
        expiresIn: serverCache.lastFetch.brent 
          ? Math.max(0, CACHE_DURATION - (Date.now() - serverCache.lastFetch.brent))
          : 0
      }
    };
  }
  
  return { message: 'Cache status only available on server' };
}