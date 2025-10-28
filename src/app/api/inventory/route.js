// src/app/api/inventory/route.js

import { NextResponse } from 'next/server';
import {
  getAllInventory,
  getLocationInventory,
  getFuelInventory,
  updateInventory,
  reserveStock,
  completeOrder,
  getLowStockAlerts,
  getInventorySummary,
  canFulfillOrder
} from '@/lib/db/inventoryStorage';

/**
 * GET - Fetch inventory data
 * Query params:
 * - location: nairobi | mombasa
 * - fuelType: pms | ago | ik
 * - action: all | location | fuel | alerts | summary | check
 * - quantity: (for check action)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'all';
    const location = searchParams.get('location');
    const fuelType = searchParams.get('fuelType');
    const quantity = searchParams.get('quantity');

    switch (action) {
      case 'all':
        // Get all inventory
        const allInventory = getAllInventory();
        return NextResponse.json({
          success: true,
          data: allInventory
        });

      case 'location':
        // Get inventory for specific location
        if (!location) {
          return NextResponse.json({
            success: false,
            error: 'Location parameter required'
          }, { status: 400 });
        }
        
        const locationInventory = getLocationInventory(location);
        if (!locationInventory) {
          return NextResponse.json({
            success: false,
            error: 'Location not found'
          }, { status: 404 });
        }

        return NextResponse.json({
          success: true,
          data: locationInventory
        });

      case 'fuel':
        // Get inventory for specific fuel at location
        if (!location || !fuelType) {
          return NextResponse.json({
            success: false,
            error: 'Location and fuelType parameters required'
          }, { status: 400 });
        }

        const fuelInventory = getFuelInventory(location, fuelType);
        if (!fuelInventory) {
          return NextResponse.json({
            success: false,
            error: 'Fuel inventory not found'
          }, { status: 404 });
        }

        return NextResponse.json({
          success: true,
          data: fuelInventory
        });

      case 'alerts':
        // Get low stock alerts
        const alerts = getLowStockAlerts();
        return NextResponse.json({
          success: true,
          count: alerts.length,
          data: alerts
        });

      case 'summary':
        // Get inventory summary across all locations
        const summary = getInventorySummary();
        return NextResponse.json({
          success: true,
          data: summary
        });

      case 'check':
        // Check if order can be fulfilled
        if (!location || !fuelType || !quantity) {
          return NextResponse.json({
            success: false,
            error: 'Location, fuelType, and quantity parameters required'
          }, { status: 400 });
        }

        const checkResult = canFulfillOrder(location, fuelType, parseInt(quantity));
        return NextResponse.json({
          success: true,
          data: checkResult
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action parameter'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Inventory API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error'
    }, { status: 500 });
  }
}

/**
 * POST - Update inventory or reserve stock
 * Body:
 * - action: update | reserve | complete
 * - location: nairobi | mombasa
 * - fuelType: pms | ago | ik
 * - quantity: number
 * - updates: object (for update action)
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { action, location, fuelType, quantity, updates } = body;

    // Basic validation
    if (!action || !location || !fuelType) {
      return NextResponse.json({
        success: false,
        error: 'Action, location, and fuelType are required'
      }, { status: 400 });
    }

    switch (action) {
      case 'update':
        // Update inventory (admin only in production)
        if (!updates) {
          return NextResponse.json({
            success: false,
            error: 'Updates object required'
          }, { status: 400 });
        }

        const updatedInventory = updateInventory(location, fuelType, updates);
        return NextResponse.json({
          success: true,
          message: 'Inventory updated successfully',
          data: updatedInventory
        });

      case 'reserve':
        // Reserve stock for an order
        if (!quantity || quantity <= 0) {
          return NextResponse.json({
            success: false,
            error: 'Valid quantity required'
          }, { status: 400 });
        }

        const reservedStock = reserveStock(location, fuelType, quantity);
        return NextResponse.json({
          success: true,
          message: 'Stock reserved successfully',
          data: reservedStock
        });

      case 'complete':
        // Complete an order (reduce actual stock)
        if (!quantity || quantity <= 0) {
          return NextResponse.json({
            success: false,
            error: 'Valid quantity required'
          }, { status: 400 });
        }

        const completedOrder = completeOrder(location, fuelType, quantity);
        return NextResponse.json({
          success: true,
          message: 'Order completed successfully',
          data: completedOrder
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Inventory POST error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error'
    }, { status: 500 });
  }
}

/**
 * PUT - Bulk update inventory (admin only)
 */
export async function PUT(request) {
  try {
    const body = await request.json();
    const { updates } = body;

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json({
        success: false,
        error: 'Updates object required'
      }, { status: 400 });
    }

    // Process bulk updates
    const results = [];
    for (const [location, fuels] of Object.entries(updates)) {
      for (const [fuelType, data] of Object.entries(fuels)) {
        try {
          const updated = updateInventory(location, fuelType, data);
          results.push({
            location,
            fuelType,
            success: true,
            data: updated
          });
        } catch (error) {
          results.push({
            location,
            fuelType,
            success: false,
            error: error.message
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Bulk update completed',
      results
    });

  } catch (error) {
    console.error('Inventory PUT error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error'
    }, { status: 500 });
  }
}

/**
 * DELETE - Clear reserved stock (cancel order)
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const fuelType = searchParams.get('fuelType');
    const quantity = searchParams.get('quantity');

    if (!location || !fuelType || !quantity) {
      return NextResponse.json({
        success: false,
        error: 'Location, fuelType, and quantity required'
      }, { status: 400 });
    }

    // Release reserved stock (add back to available)
    const updates = {
      reserved: -parseInt(quantity)
    };

    const updatedInventory = updateInventory(location, fuelType, updates);
    
    return NextResponse.json({
      success: true,
      message: 'Reserved stock released',
      data: updatedInventory
    });

  } catch (error) {
    console.error('Inventory DELETE error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error'
    }, { status: 500 });
  }
}