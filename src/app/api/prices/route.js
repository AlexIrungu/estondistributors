// src/app/api/prices/route.js
import { NextResponse } from 'next/server';
import { getEPRAPrices, clearEPRACache, getEPRACacheStatus } from '@/lib/services/epraScraper';

export const dynamic = 'force-dynamic';

// Fallback data in case EPRA scraping fails completely
const FALLBACK_PRICES = {
  lastUpdated: new Date().toISOString(),
  effectiveDate: '15th January 2025 to 14th February 2025',
  source: 'Cached Fallback Data',
  locations: {
    mombasa: {
      name: 'Mombasa',
      prices: {
        pms: { price: 181.24, change: -0.43, trend: 'down', label: 'Super Petrol', unit: 'KES/Litre' },
        ago: { price: 168.19, change: -0.07, trend: 'down', label: 'Diesel', unit: 'KES/Litre' },
        ik: { price: 151.49, change: -0.53, trend: 'down', label: 'Kerosene', unit: 'KES/Litre' }
      }
    },
    nairobi: {
      name: 'Nairobi',
      prices: {
        pms: { price: 184.52, change: -0.43, trend: 'down', label: 'Super Petrol', unit: 'KES/Litre' },
        ago: { price: 171.47, change: -0.06, trend: 'down', label: 'Diesel', unit: 'KES/Litre' },
        ik: { price: 154.78, change: -0.51, trend: 'down', label: 'Kerosene', unit: 'KES/Litre' }
      }
    },
    nakuru: {
      name: 'Nakuru',
      prices: {
        pms: { price: 183.56, change: -0.43, trend: 'down', label: 'Super Petrol', unit: 'KES/Litre' },
        ago: { price: 170.87, change: -0.06, trend: 'down', label: 'Diesel', unit: 'KES/Litre' },
        ik: { price: 154.21, change: -0.52, trend: 'down', label: 'Kerosene', unit: 'KES/Litre' }
      }
    },
    eldoret: {
      name: 'Eldoret',
      prices: {
        pms: { price: 184.38, change: -0.43, trend: 'down', label: 'Super Petrol', unit: 'KES/Litre' },
        ago: { price: 171.68, change: -0.07, trend: 'down', label: 'Diesel', unit: 'KES/Litre' },
        ik: { price: 155.03, change: -0.51, trend: 'down', label: 'Kerosene', unit: 'KES/Litre' }
      }
    },
    kisumu: {
      name: 'Kisumu',
      prices: {
        pms: { price: 184.37, change: -0.43, trend: 'down', label: 'Super Petrol', unit: 'KES/Litre' },
        ago: { price: 171.68, change: -0.06, trend: 'down', label: 'Diesel', unit: 'KES/Litre' },
        ik: { price: 155.03, change: -0.51, trend: 'down', label: 'Kerosene', unit: 'KES/Litre' }
      }
    }
  }
};

/**
 * GET /api/prices
 * Returns current fuel prices from EPRA (with fallback)
 * 
 * Query params:
 * - location: Filter by specific location (optional)
 * - fuelType: Filter by fuel type (pms, ago, ik) (optional)
 * - refresh: 'true' to force cache refresh (optional)
 * - status: 'true' to get cache status instead of prices (optional)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const fuelType = searchParams.get('fuelType');
    const forceRefresh = searchParams.get('refresh') === 'true';
    const getStatus = searchParams.get('status') === 'true';
    
    // Return cache status if requested
    if (getStatus) {
      const cacheStatus = getEPRACacheStatus();
      return NextResponse.json({
        cacheStatus,
        timestamp: new Date().toISOString()
      }, { status: 200 });
    }
    
    // Validate location parameter
    if (location) {
      const validLocations = ['nairobi', 'mombasa', 'nakuru', 'eldoret', 'kisumu'];
      if (!validLocations.includes(location.toLowerCase())) {
        return NextResponse.json(
          { 
            error: 'Invalid location parameter',
            validLocations,
            received: location
          },
          { status: 400 }
        );
      }
    }

    // Validate fuelType parameter
    if (fuelType) {
      const validFuelTypes = ['pms', 'ago', 'ik'];
      if (!validFuelTypes.includes(fuelType.toLowerCase())) {
        return NextResponse.json(
          { 
            error: 'Invalid fuelType parameter',
            validFuelTypes,
            received: fuelType
          },
          { status: 400 }
        );
      }
    }

    // Try to get EPRA prices
    let priceData;
    let dataSource = 'epra';
    let metadata = {};
    
    try {
      const epraResult = await getEPRAPrices(forceRefresh);
      
      if (epraResult.success) {
        priceData = epraResult.data;
        metadata = {
          cached: epraResult.cached || false,
          stale: epraResult.stale || false,
          cacheAge: epraResult.cacheAge,
          note: epraResult.note
        };
        console.log('Successfully fetched EPRA prices');
      } else {
        throw new Error('EPRA scraping failed: ' + epraResult.error);
      }
    } catch (error) {
      console.warn('EPRA fetch failed, using fallback:', error.message);
      priceData = FALLBACK_PRICES;
      dataSource = 'fallback';
      metadata = {
        warning: 'Using fallback data due to EPRA scraping failure',
        error: error.message
      };
    }

    let responseData = { 
      ...priceData,
      dataSource,
      timestamp: new Date().toISOString(),
      ...metadata
    };

    // Filter by location if specified
    if (location) {
      const locationKey = location.toLowerCase();
      const locationData = priceData.locations[locationKey];
      
      if (!locationData) {
        return NextResponse.json(
          { error: 'Location data not found', location: locationKey },
          { status: 404 }
        );
      }
      
      responseData = {
        ...responseData,
        locations: {
          [locationKey]: locationData
        }
      };
    }
    
    // Filter by fuel type if specified
    if (fuelType) {
      const fuelTypeKey = fuelType.toLowerCase();
      const filteredLocations = {};
      
      Object.keys(responseData.locations).forEach(locKey => {
        const locationData = responseData.locations[locKey];
        if (locationData.prices[fuelTypeKey]) {
          filteredLocations[locKey] = {
            ...locationData,
            prices: {
              [fuelTypeKey]: locationData.prices[fuelTypeKey]
            }
          };
        }
      });
      
      if (Object.keys(filteredLocations).length === 0) {
        return NextResponse.json(
          { error: `Fuel type '${fuelType}' not found in any location` },
          { status: 404 }
        );
      }
      
      responseData = {
        ...responseData,
        locations: filteredLocations
      };
    }
    
    // Set cache headers based on data source
    const cacheControl = dataSource === 'epra' 
      ? 'public, s-maxage=43200, stale-while-revalidate=86400' // 12 hours, stale for 24 hours
      : 'public, s-maxage=3600, stale-while-revalidate=7200'; // 1 hour for fallback
    
    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': cacheControl,
        'X-Data-Source': dataSource
      }
    });
    
  } catch (error) {
    console.error('Error in /api/prices:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/prices
 * Admin endpoint to manually refresh EPRA cache
 */
export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Check for admin action
    if (body.action === 'refresh') {
      console.log('Manual cache refresh requested');
      clearEPRACache();
      
      const result = await getEPRAPrices(true);
      
      return NextResponse.json({
        success: true,
        message: 'Cache refreshed',
        data: result,
        timestamp: new Date().toISOString()
      }, { status: 200 });
    }
    
    if (body.action === 'clear') {
      clearEPRACache();
      return NextResponse.json({
        success: true,
        message: 'Cache cleared',
        timestamp: new Date().toISOString()
      }, { status: 200 });
    }

    // In production, this would handle manual price updates
    return NextResponse.json({
      success: false,
      message: 'Invalid action. Use "refresh" or "clear"',
      received: body
    }, { status: 400 });
    
  } catch (error) {
    console.error('Error in POST /api/prices:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        message: error.message
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/prices
 * Handle CORS preflight requests
 */
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}