// src/app/api/fleet/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const vehicleId = searchParams.get('vehicleId');

    // Import client-side functions (they work in API routes too)
    const {
      getUserVehicles,
      getVehicleById,
      getVehicleRefuels,
      getUserRefuels,
      getFleetAnalytics,
    } = await import('@/lib/db/fleetStorage');

    switch (action) {
      case 'vehicles':
        const vehicles = getUserVehicles(session.user.id);
        return NextResponse.json({
          success: true,
          vehicles
        });

      case 'vehicle':
        if (!vehicleId) {
          return NextResponse.json(
            { error: 'Vehicle ID required' },
            { status: 400 }
          );
        }
        const vehicle = getVehicleById(vehicleId);
        if (!vehicle || vehicle.userId !== session.user.id) {
          return NextResponse.json(
            { error: 'Vehicle not found' },
            { status: 404 }
          );
        }
        return NextResponse.json({
          success: true,
          vehicle
        });

      case 'refuels':
        if (vehicleId) {
          const vehicleRefuels = getVehicleRefuels(vehicleId);
          return NextResponse.json({
            success: true,
            refuels: vehicleRefuels
          });
        } else {
          const userRefuels = getUserRefuels(session.user.id);
          return NextResponse.json({
            success: true,
            refuels: userRefuels
          });
        }

      case 'analytics':
        const analytics = getFleetAnalytics(session.user.id);
        return NextResponse.json({
          success: true,
          analytics
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Fleet API error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action } = body;

    const {
      addVehicle,
      addRefuel,
      createDemoFleet,
    } = await import('@/lib/db/fleetStorage');

    switch (action) {
      case 'add-vehicle':
        const vehicleResult = addVehicle({
          ...body.vehicle,
          userId: session.user.id
        });
        return NextResponse.json(vehicleResult);

      case 'add-refuel':
        const refuelResult = addRefuel({
          ...body.refuel,
          userId: session.user.id
        });
        return NextResponse.json(refuelResult);

      case 'create-demo':
        const demoResult = createDemoFleet(session.user.id);
        return NextResponse.json(demoResult);

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Fleet API error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { vehicleId, updates } = body;

    if (!vehicleId) {
      return NextResponse.json(
        { error: 'Vehicle ID required' },
        { status: 400 }
      );
    }

    const { updateVehicle, getVehicleById } = await import('@/lib/db/fleetStorage');
    
    // Verify ownership
    const vehicle = getVehicleById(vehicleId);
    if (!vehicle || vehicle.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    const result = updateVehicle(vehicleId, updates);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Fleet API error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get('vehicleId');

    if (!vehicleId) {
      return NextResponse.json(
        { error: 'Vehicle ID required' },
        { status: 400 }
      );
    }

    const { deleteVehicle, getVehicleById } = await import('@/lib/db/fleetStorage');
    
    // Verify ownership
    const vehicle = getVehicleById(vehicleId);
    if (!vehicle || vehicle.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    const result = deleteVehicle(vehicleId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Fleet API error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}