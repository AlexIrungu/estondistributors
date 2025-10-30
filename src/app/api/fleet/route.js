// src/app/api/fleet/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db/mongodb';
import Fleet from '@/lib/db/models/Fleet';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const vehicleId = searchParams.get('vehicleId');

    switch (action) {
      case 'vehicles':
        const vehicles = await Fleet.findByUser(session.user.id);
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
        
        const vehicle = await Fleet.findById(vehicleId);
        
        if (!vehicle || vehicle.userId.toString() !== session.user.id) {
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
          // Get refuels for specific vehicle
          const vehicleWithRefuels = await Fleet.findById(vehicleId);
          if (!vehicleWithRefuels || vehicleWithRefuels.userId.toString() !== session.user.id) {
            return NextResponse.json(
              { error: 'Vehicle not found' },
              { status: 404 }
            );
          }
          
          return NextResponse.json({
            success: true,
            refuels: vehicleWithRefuels.refuels
          });
        } else {
          // Get all refuels for user
          const vehicles = await Fleet.findByUser(session.user.id);
          const allRefuels = vehicles.flatMap(vehicle => 
            vehicle.refuels.map(refuel => ({
              ...refuel.toObject(),
              vehicleId: vehicle._id,
              vehicleName: vehicle.name,
              registrationNumber: vehicle.registrationNumber
            }))
          );
          
          // Sort by date, most recent first
          allRefuels.sort((a, b) => new Date(b.date) - new Date(a.date));
          
          return NextResponse.json({
            success: true,
            refuels: allRefuels
          });
        }

      case 'analytics':
        const analyticsVehicles = await Fleet.findByUser(session.user.id);
        
        // Calculate analytics
        const totalVehicles = analyticsVehicles.length;
        const activeVehicles = analyticsVehicles.filter(v => v.status === 'active').length;
        
        let totalRefuels = 0;
        let totalLiters = 0;
        let totalCost = 0;
        let totalDistance = 0;
        
        analyticsVehicles.forEach(vehicle => {
          totalRefuels += vehicle.refuels.length;
          vehicle.refuels.forEach(refuel => {
            totalLiters += refuel.liters;
            totalCost += refuel.totalCost;
            if (refuel.odometerReading) {
              totalDistance += refuel.odometerReading;
            }
          });
        });
        
        const averageFuelEfficiency = totalDistance > 0 && totalLiters > 0
          ? (totalDistance / totalLiters).toFixed(2)
          : 0;
        
        const analytics = {
          totalVehicles,
          activeVehicles,
          totalRefuels,
          totalLiters: parseFloat(totalLiters.toFixed(2)),
          totalCost: parseFloat(totalCost.toFixed(2)),
          totalDistance: parseFloat(totalDistance.toFixed(2)),
          averageFuelEfficiency: parseFloat(averageFuelEfficiency),
          averageCostPerLiter: totalLiters > 0 ? parseFloat((totalCost / totalLiters).toFixed(2)) : 0
        };
        
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

    await connectDB();

    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'add-vehicle':
        const newVehicle = new Fleet({
          userId: session.user.id,
          name: body.vehicle.name,
          registrationNumber: body.vehicle.registrationNumber,
          type: body.vehicle.type,
          fuelType: body.vehicle.fuelType,
          tankCapacity: body.vehicle.tankCapacity,
          currentOdometer: body.vehicle.currentOdometer || 0,
          status: body.vehicle.status || 'active',
          driver: body.vehicle.driver,
          notes: body.vehicle.notes
        });
        
        await newVehicle.save();
        
        return NextResponse.json({
          success: true,
          message: 'Vehicle added successfully',
          vehicle: newVehicle
        });

      case 'add-refuel':
        const vehicle = await Fleet.findById(body.refuel.vehicleId);
        
        if (!vehicle || vehicle.userId.toString() !== session.user.id) {
          return NextResponse.json(
            { error: 'Vehicle not found' },
            { status: 404 }
          );
        }
        
        // Add refuel to vehicle
        vehicle.refuels.push({
          date: body.refuel.date,
          fuelType: body.refuel.fuelType,
          liters: body.refuel.liters,
          pricePerLiter: body.refuel.pricePerLiter,
          totalCost: body.refuel.totalCost,
          odometerReading: body.refuel.odometerReading,
          location: body.refuel.location,
          filledBy: body.refuel.filledBy,
          notes: body.refuel.notes
        });
        
        // Update vehicle odometer
        if (body.refuel.odometerReading && body.refuel.odometerReading > vehicle.currentOdometer) {
          vehicle.currentOdometer = body.refuel.odometerReading;
        }
        
        await vehicle.save();
        
        return NextResponse.json({
          success: true,
          message: 'Refuel record added successfully',
          vehicle
        });

      case 'create-demo':
        // Create demo fleet vehicles
        const demoVehicles = [
          {
            userId: session.user.id,
            name: 'Delivery Truck 1',
            registrationNumber: 'KCA 123A',
            type: 'truck',
            fuelType: 'ago',
            tankCapacity: 200,
            currentOdometer: 45000,
            status: 'active',
            driver: 'John Kamau',
            refuels: [
              {
                date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                fuelType: 'ago',
                liters: 180,
                pricePerLiter: 162.5,
                totalCost: 29250,
                odometerReading: 44800,
                location: 'Nairobi Depot',
                filledBy: 'Station Attendant'
              }
            ]
          },
          {
            userId: session.user.id,
            name: 'Van 2',
            registrationNumber: 'KBZ 456B',
            type: 'van',
            fuelType: 'pms',
            tankCapacity: 60,
            currentOdometer: 32000,
            status: 'active',
            driver: 'Mary Wanjiru',
            refuels: [
              {
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                fuelType: 'pms',
                liters: 55,
                pricePerLiter: 177.3,
                totalCost: 9751.5,
                odometerReading: 31900,
                location: 'Mombasa Depot',
                filledBy: 'Station Attendant'
              }
            ]
          }
        ];
        
        const createdVehicles = await Fleet.insertMany(demoVehicles);
        
        return NextResponse.json({
          success: true,
          message: 'Demo fleet created successfully',
          vehicles: createdVehicles
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

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { vehicleId, updates } = body;

    if (!vehicleId) {
      return NextResponse.json(
        { error: 'Vehicle ID required' },
        { status: 400 }
      );
    }

    const vehicle = await Fleet.findById(vehicleId);
    
    if (!vehicle || vehicle.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    // Update vehicle fields
    Object.keys(updates).forEach(key => {
      if (key !== 'userId' && key !== 'refuels') {
        vehicle[key] = updates[key];
      }
    });

    await vehicle.save();

    return NextResponse.json({
      success: true,
      message: 'Vehicle updated successfully',
      vehicle
    });
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

    await connectDB();

    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get('vehicleId');

    if (!vehicleId) {
      return NextResponse.json(
        { error: 'Vehicle ID required' },
        { status: 400 }
      );
    }

    const vehicle = await Fleet.findById(vehicleId);
    
    if (!vehicle || vehicle.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    await Fleet.findByIdAndDelete(vehicleId);

    return NextResponse.json({
      success: true,
      message: 'Vehicle deleted successfully'
    });
  } catch (error) {
    console.error('Fleet API error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}