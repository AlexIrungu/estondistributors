// src/app/api/crude-oil/route.js
import { NextResponse } from 'next/server';

// Enable dynamic rendering for this route
export const dynamic = 'force-dynamic';

const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

/**
 * GET /api/crude-oil
 * Returns current crude oil prices (WTI and Brent)
 * 
 * Query params:
 * - type: 'wti', 'brent', or 'all' (default: 'all')
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    
    // Validate type parameter
    const validTypes = ['all', 'wti', 'brent'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { 
          error: 'Invalid type parameter',
          validTypes: validTypes,
          received: type
        },
        { status: 400 }
      );
    }
    
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    
    // If no API key, return mock data immediately
    if (!apiKey) {
      console.log('Alpha Vantage API key not configured, returning mock data');
      const mockData = getMockCrudeData(type);
      return NextResponse.json(mockData, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Data-Source': 'mock',
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      });
    }
    
    let result;
    
    if (type === 'wti' || type === 'all') {
      const wtiData = await fetchWTIPrice(apiKey);
      
      if (type === 'wti') {
        result = wtiData;
      } else {
        const brentData = await fetchBrentPrice(apiKey);
        result = {
          wti: wtiData,
          brent: brentData,
          lastUpdated: new Date().toISOString(),
          source: 'Alpha Vantage'
        };
      }
    } else if (type === 'brent') {
      const brentData = await fetchBrentPrice(apiKey);
      result = brentData;
    }
    
    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Data-Source': 'live',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });
    
  } catch (error) {
    console.error('Error in /api/crude-oil:', error);
    
    // Return mock data on error with fallback indication
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    
    const fallbackData = {
      ...getMockCrudeData(type),
      note: 'Using fallback data due to API error',
      error: error.message,
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(fallbackData, {
      status: 200, // Return 200 with fallback data instead of 500
      headers: {
        'Content-Type': 'application/json',
        'X-Data-Source': 'fallback'
      }
    });
  }
}

/**
 * Fetch WTI crude oil price from Alpha Vantage
 */
async function fetchWTIPrice(apiKey) {
  try {
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=WTI&interval=daily&apikey=${apiKey}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'NextJS-Fuel-Prices-App'
        },
        next: { revalidate: 300 } // Cache for 5 minutes
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Handle API errors
    if (data['Error Message']) {
      throw new Error(`API Error: ${data['Error Message']}`);
    }
    
    if (data['Information']) {
      console.warn('Alpha Vantage API limit:', data['Information']);
      return getMockWTIData();
    }
    
    if (data['Note']) {
      console.warn('Alpha Vantage API note:', data['Note']);
      return getMockWTIData();
    }
    
    const timeSeries = data.data || [];
    const latest = timeSeries[0];
    
    if (!latest || !latest.value) {
      console.warn('No valid WTI data found in response');
      return getMockWTIData();
    }
    
    return {
      type: 'WTI',
      price: parseFloat(latest.value),
      date: latest.date,
      unit: 'USD per barrel',
      source: 'Alpha Vantage',
      isMock: false
    };
  } catch (error) {
    console.error('Error fetching WTI price:', error);
    return getMockWTIData();
  }
}

/**
 * Fetch Brent crude oil price from Alpha Vantage
 */
async function fetchBrentPrice(apiKey) {
  try {
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=BRENT&interval=daily&apikey=${apiKey}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'NextJS-Fuel-Prices-App'
        },
        next: { revalidate: 300 } // Cache for 5 minutes
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Handle API errors
    if (data['Error Message']) {
      throw new Error(`API Error: ${data['Error Message']}`);
    }
    
    if (data['Information']) {
      console.warn('Alpha Vantage API limit:', data['Information']);
      return getMockBrentData();
    }
    
    if (data['Note']) {
      console.warn('Alpha Vantage API note:', data['Note']);
      return getMockBrentData();
    }
    
    const timeSeries = data.data || [];
    const latest = timeSeries[0];
    
    if (!latest || !latest.value) {
      console.warn('No valid Brent data found in response');
      return getMockBrentData();
    }
    
    return {
      type: 'Brent',
      price: parseFloat(latest.value),
      date: latest.date,
      unit: 'USD per barrel',
      source: 'Alpha Vantage',
      isMock: false
    };
  } catch (error) {
    console.error('Error fetching Brent price:', error);
    return getMockBrentData();
  }
}

/**
 * Mock data functions with realistic prices
 */
function getMockWTIData() {
  const basePrice = 73.45;
  const variation = (Math.random() - 0.5) * 2; // Random variation between -1 and +1
  
  return {
    type: 'WTI',
    price: basePrice + variation,
    date: new Date().toISOString().split('T')[0],
    unit: 'USD per barrel',
    source: 'Mock Data',
    isMock: true,
    note: 'Using mock data - configure ALPHA_VANTAGE_API_KEY for live data'
  };
}

function getMockBrentData() {
  const basePrice = 78.20;
  const variation = (Math.random() - 0.5) * 2; // Random variation between -1 and +1
  
  return {
    type: 'Brent',
    price: basePrice + variation,
    date: new Date().toISOString().split('T')[0],
    unit: 'USD per barrel',
    source: 'Mock Data',
    isMock: true,
    note: 'Using mock data - configure ALPHA_VANTAGE_API_KEY for live data'
  };
}

function getMockCrudeData(type) {
  const baseData = {
    lastUpdated: new Date().toISOString(),
    note: 'Using mock data - configure ALPHA_VANTAGE_API_KEY for live data'
  };

  if (type === 'wti') {
    return {
      ...getMockWTIData(),
      ...baseData
    };
  }
  
  if (type === 'brent') {
    return {
      ...getMockBrentData(),
      ...baseData
    };
  }
  
  return {
    wti: getMockWTIData(),
    brent: getMockBrentData(),
    ...baseData
  };
}

/**
 * OPTIONS /api/crude-oil
 * Handle CORS preflight requests
 */
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}