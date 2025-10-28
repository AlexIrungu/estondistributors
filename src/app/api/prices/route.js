// src/app/api/prices/route.js
import { NextResponse } from 'next/server';

// Enable dynamic rendering for this route
export const dynamic = 'force-dynamic';

/**
 * GET /api/prices
 * Returns current fuel prices for all locations
 * 
 * Query params:
 * - location: Filter by specific location (optional)
 * - fuelType: Filter by fuel type (pms, ago, ik) (optional)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const fuelType = searchParams.get('fuelType');
    
    // Validate location parameter if provided
    if (location) {
      const validLocations = ['nairobi', 'mombasa', 'nakuru', 'eldoret', 'kisumu'];
      if (!validLocations.includes(location.toLowerCase())) {
        return NextResponse.json(
          { 
            error: 'Invalid location parameter',
            validLocations: validLocations,
            received: location
          },
          { status: 400 }
        );
      }
    }

    // Validate fuelType parameter if provided
    if (fuelType) {
      const validFuelTypes = ['pms', 'ago', 'ik'];
      if (!validFuelTypes.includes(fuelType.toLowerCase())) {
        return NextResponse.json(
          { 
            error: 'Invalid fuelType parameter',
            validFuelTypes: validFuelTypes,
            received: fuelType
          },
          { status: 400 }
        );
      }
    }

    // EPRA prices data with realistic changes
    const EPRA_PRICES = {
      lastUpdated: new Date().toISOString(),
      effectiveDate: `${new Date().toISOString().split('T')[0]} to ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`,
      source: 'EPRA Kenya',
      locations: {
        mombasa: {
          name: 'Mombasa',
          prices: {
            pms: { price: 181.24, change: 0.25, label: 'Super Petrol', unit: 'KES/Litre' },
            ago: { price: 168.19, change: -0.15, label: 'Diesel', unit: 'KES/Litre' },
            ik: { price: 151.49, change: 0.10, label: 'Kerosene', unit: 'KES/Litre' }
          }
        },
        nairobi: {
          name: 'Nairobi',
          prices: {
            pms: { price: 184.52, change: 0.30, label: 'Super Petrol', unit: 'KES/Litre' },
            ago: { price: 171.47, change: -0.20, label: 'Diesel', unit: 'KES/Litre' },
            ik: { price: 154.78, change: 0.05, label: 'Kerosene', unit: 'KES/Litre' }
          }
        },
        nakuru: {
          name: 'Nakuru',
          prices: {
            pms: { price: 183.56, change: 0.18, label: 'Super Petrol', unit: 'KES/Litre' },
            ago: { price: 170.87, change: -0.12, label: 'Diesel', unit: 'KES/Litre' },
            ik: { price: 154.21, change: 0.08, label: 'Kerosene', unit: 'KES/Litre' }
          }
        },
        eldoret: {
          name: 'Eldoret',
          prices: {
            pms: { price: 184.38, change: 0.22, label: 'Super Petrol', unit: 'KES/Litre' },
            ago: { price: 171.68, change: -0.18, label: 'Diesel', unit: 'KES/Litre' },
            ik: { price: 155.03, change: 0.12, label: 'Kerosene', unit: 'KES/Litre' }
          }
        },
        kisumu: {
          name: 'Kisumu',
          prices: {
            pms: { price: 184.37, change: 0.20, label: 'Super Petrol', unit: 'KES/Litre' },
            ago: { price: 171.68, change: -0.15, label: 'Diesel', unit: 'KES/Litre' },
            ik: { price: 155.03, change: 0.07, label: 'Kerosene', unit: 'KES/Litre' }
          }
        }
      }
    };
    
    let responseData = { ...EPRA_PRICES };

    // Filter by location if specified
    if (location) {
      const locationKey = location.toLowerCase();
      const locationData = EPRA_PRICES.locations[locationKey];
      
      if (!locationData) {
        return NextResponse.json(
          { error: 'Location data not found' },
          { status: 404 }
        );
      }
      
      responseData = {
        ...EPRA_PRICES,
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
      
      // If no locations have the requested fuel type
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
    
    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
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
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

/**
 * POST /api/prices
 * Update prices (admin only - would require authentication in production)
 */
export async function POST(request) {
  try {
    // Check content type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Basic validation
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    // In production, this would:
    // 1. Verify admin authentication
    // 2. Validate the price data
    // 3. Update the database
    // 4. Clear caches
    // 5. Send notifications if needed

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return NextResponse.json({
      success: true,
      message: 'Prices update endpoint (requires admin authentication)',
      received: body,
      timestamp: new Date().toISOString(),
      note: 'This is a demo endpoint. In production, this would update the database.'
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error('Error in POST /api/prices:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        message: error.message,
        timestamp: new Date().toISOString()
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