// src/app/api/inventory/route.js

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Inventory from '@/lib/db/models/Inventory';

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
    await connectDB();

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'all';
    const location = searchParams.get('location');
    const fuelType = searchParams.get('fuelType');
    const quantity = searchParams.get('quantity');

    switch (action) {
      case 'all':
        // Get all inventory
        const allInventory = await Inventory.find();
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
        
        const locationInventory = await Inventory.findByLocation(location);
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

        const inventory = await Inventory.findByLocation(location);
        if (!inventory) {
          return NextResponse.json({
            success: false,
            error: 'Location not found'
          }, { status: 404 });
        }

        const fuelInventory = inventory.fuels.find(f => f.type === fuelType);
        if (!fuelInventory) {
          return NextResponse.json({
            success: false,
            error: 'Fuel type not found'
          }, { status: 404 });
        }

        return NextResponse.json({
          success: true,
          data: fuelInventory
        });

      case 'alerts':
        // Get low stock alerts
        const alerts = await Inventory.getLowStockAlerts();
        return NextResponse.json({
          success: true,
          count: alerts.length,
          data: alerts
        });

      case 'summary':
        // Get inventory summary across all locations
        const summary = await Inventory.getSummary();
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

        const checkInventory = await Inventory.findByLocation(location);
        if (!checkInventory) {
          return NextResponse.json({
            success: false,
            error: 'Location not found'
          }, { status: 404 });
        }

        const fuel = checkInventory.fuels.find(f => f.type === fuelType);
        if (!fuel) {
          return NextResponse.json({
            success: false,
            error: 'Fuel type not found'
          }, { status: 404 });
        }

        const requestedQty = parseInt(quantity);
        const available = fuel.currentStock - fuel.reserved;
        const canFulfill = available >= requestedQty;

        return NextResponse.json({
          success: true,
          data: {
            canFulfill,
            available,
            requested: requestedQty,
            shortfall: canFulfill ? 0 : requestedQty - available
          }
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
    await connectDB();

    const body = await request.json();
    const { action, location, fuelType, quantity, updates } = body;

    // Basic validation
    if (!action || !location || !fuelType) {
      return NextResponse.json({
        success: false,
        error: 'Action, location, and fuelType are required'
      }, { status: 400 });
    }

    const inventory = await Inventory.findByLocation(location);
    if (!inventory) {
      return NextResponse.json({
        success: false,
        error: 'Location not found'
      }, { status: 404 });
    }

    const fuelIndex = inventory.fuels.findIndex(f => f.type === fuelType);
    if (fuelIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Fuel type not found'
      }, { status: 404 });
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

        Object.keys(updates).forEach(key => {
          if (inventory.fuels[fuelIndex][key] !== undefined) {
            inventory.fuels[fuelIndex][key] = updates[key];
          }
        });

        await inventory.save();

        return NextResponse.json({
          success: true,
          message: 'Inventory updated successfully',
          data: inventory.fuels[fuelIndex]
        });

      case 'reserve':
        // Reserve stock for an order
        if (!quantity || quantity <= 0) {
          return NextResponse.json({
            success: false,
            error: 'Valid quantity required'
          }, { status: 400 });
        }

        const available = inventory.fuels[fuelIndex].currentStock - inventory.fuels[fuelIndex].reserved;
        if (available < quantity) {
          return NextResponse.json({
            success: false,
            error: 'Insufficient stock available',
            available
          }, { status: 400 });
        }

        inventory.fuels[fuelIndex].reserved += quantity;
        await inventory.save();

        return NextResponse.json({
          success: true,
          message: 'Stock reserved successfully',
          data: inventory.fuels[fuelIndex]
        });

      case 'complete':
        // Complete an order (reduce actual stock)
        if (!quantity || quantity <= 0) {
          return NextResponse.json({
            success: false,
            error: 'Valid quantity required'
          }, { status: 400 });
        }

        if (inventory.fuels[fuelIndex].reserved < quantity) {
          return NextResponse.json({
            success: false,
            error: 'Not enough reserved stock'
          }, { status: 400 });
        }

        inventory.fuels[fuelIndex].reserved -= quantity;
        inventory.fuels[fuelIndex].currentStock -= quantity;
        await inventory.save();

        return NextResponse.json({
          success: true,
          message: 'Order completed successfully',
          data: inventory.fuels[fuelIndex]
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
    await connectDB();

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
      const inventory = await Inventory.findByLocation(location);
      
      if (!inventory) {
        results.push({
          location,
          success: false,
          error: 'Location not found'
        });
        continue;
      }

      for (const [fuelType, data] of Object.entries(fuels)) {
        const fuelIndex = inventory.fuels.findIndex(f => f.type === fuelType);
        
        if (fuelIndex === -1) {
          results.push({
            location,
            fuelType,
            success: false,
            error: 'Fuel type not found'
          });
          continue;
        }

        try {
          Object.keys(data).forEach(key => {
            if (inventory.fuels[fuelIndex][key] !== undefined) {
              inventory.fuels[fuelIndex][key] = data[key];
            }
          });

          await inventory.save();

          results.push({
            location,
            fuelType,
            success: true,
            data: inventory.fuels[fuelIndex]
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
    await connectDB();

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

    const inventory = await Inventory.findByLocation(location);
    if (!inventory) {
      return NextResponse.json({
        success: false,
        error: 'Location not found'
      }, { status: 404 });
    }

    const fuelIndex = inventory.fuels.findIndex(f => f.type === fuelType);
    if (fuelIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Fuel type not found'
      }, { status: 404 });
    }

    // Release reserved stock
    const releaseQty = parseInt(quantity);
    inventory.fuels[fuelIndex].reserved = Math.max(0, inventory.fuels[fuelIndex].reserved - releaseQty);
    await inventory.save();
    
    return NextResponse.json({
      success: true,
      message: 'Reserved stock released',
      data: inventory.fuels[fuelIndex]
    });

  } catch (error) {
    console.error('Inventory DELETE error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error'
    }, { status: 500 });
  }
}