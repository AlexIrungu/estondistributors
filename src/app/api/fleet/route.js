// src/app/api/fleet/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db/mongodb';
import { Vehicle, Refuel } from '@/lib/db/models/Fleet';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'vehicles';
    const vehicleId = searchParams.get('vehicleId');

    switch (action) {
      case 'vehicles': {
        // Get all vehicles for the user
        const vehicles = await Vehicle.find({ 
          userId: session.user.id,
          status: { $ne: 'deleted' }
        }).sort({ createdAt: -1 });
        
        return NextResponse.json({
          success: true,
          vehicles
        });
      }

      case 'vehicle': {
        if (!vehicleId) {
          return NextResponse.json(
            { error: 'Vehicle ID required' },
            { status: 400 }
          );
        }
        
        const vehicle = await Vehicle.findById(vehicleId);
        
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
      }

      case 'refuels': {
        if (vehicleId) {
          // Get refuels for specific vehicle
          const refuels = await Refuel.find({ 
            vehicleId,
            userId: session.user.id 
          }).sort({ date: -1 });
          
          return NextResponse.json({
            success: true,
            refuels
          });
        } else {
          // Get all refuels for user
          const refuels = await Refuel.find({ 
            userId: session.user.id 
          })
          .sort({ date: -1 })
          .populate('vehicleId', 'vehicleNumber vehicleName');
          
          return NextResponse.json({
            success: true,
            refuels
          });
        }
      }

      case 'analytics': {
        const vehicles = await Vehicle.find({ 
          userId: session.user.id,
          status: { $ne: 'deleted' }
        });
        
        const refuels = await Refuel.find({ 
          userId: session.user.id 
        }).populate('vehicleId');
        
        // Calculate basic analytics
        const totalVehicles = vehicles.length;
        const activeVehicles = vehicles.filter(v => v.status === 'active').length;
        
        let totalLiters = 0;
        let totalFuelCost = 0;
        let totalDistance = 0;
        let refuelsByMonth = {};
        let fuelTypeBreakdown = {};
        let vehicleTypeBreakdown = {};
        
        // Process refuels
        refuels.forEach(refuel => {
          totalLiters += refuel.liters;
          totalFuelCost += refuel.totalCost;
          
          // Monthly breakdown
          const month = new Date(refuel.date).toISOString().slice(0, 7);
          if (!refuelsByMonth[month]) {
            refuelsByMonth[month] = { cost: 0, liters: 0, month };
          }
          refuelsByMonth[month].cost += refuel.totalCost;
          refuelsByMonth[month].liters += refuel.liters;
          
          // Fuel type breakdown
          if (!fuelTypeBreakdown[refuel.fuelType]) {
            fuelTypeBreakdown[refuel.fuelType] = { cost: 0, liters: 0 };
          }
          fuelTypeBreakdown[refuel.fuelType].cost += refuel.totalCost;
          fuelTypeBreakdown[refuel.fuelType].liters += refuel.liters;
        });
        
        // Process vehicles
        vehicles.forEach(vehicle => {
          totalDistance += vehicle.currentOdometer || 0;
          
          // Vehicle type breakdown
          const type = vehicle.vehicleType || 'other';
          vehicleTypeBreakdown[type] = (vehicleTypeBreakdown[type] || 0) + 1;
          
          // Update vehicle stats if available
          if (vehicle.stats) {
            totalDistance += vehicle.stats.totalDistance || 0;
          }
        });
        
        const avgFuelEfficiency = totalDistance > 0 && totalLiters > 0
          ? totalDistance / totalLiters
          : 8.5; // Default value
        
        const monthlyTrend = Object.values(refuelsByMonth).sort((a, b) => 
          a.month.localeCompare(b.month)
        );
        
        const analytics = {
          totalVehicles,
          activeVehicles,
          totalRefuels: refuels.length,
          totalLiters: parseFloat(totalLiters.toFixed(2)),
          totalFuelCost: parseFloat(totalFuelCost.toFixed(2)),
          totalDistance: parseFloat(totalDistance.toFixed(2)),
          avgFuelEfficiency: parseFloat(avgFuelEfficiency.toFixed(2)),
          avgCostPerLiter: totalLiters > 0 
            ? parseFloat((totalFuelCost / totalLiters).toFixed(2)) 
            : 0,
          monthlyTrend,
          fuelTypeBreakdown,
          vehicleTypeBreakdown
        };
        
        return NextResponse.json({
          success: true,
          analytics
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Fleet API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'add-vehicle': {
        const vehicleData = {
          userId: session.user.id,
          vehicleNumber: body.vehicleNumber,
          vehicleName: body.vehicleName || '',
          vehicleType: body.vehicleType,
          make: body.make || '',
          model: body.model || '',
          year: body.year || new Date().getFullYear(),
          fuelType: body.fuelType,
          tankCapacity: body.tankCapacity || 0,
          avgConsumption: body.avgConsumption || 0,
          currentOdometer: body.currentOdometer || 0,
          status: body.status || 'active',
          notes: body.notes || ''
        };
        
        const newVehicle = new Vehicle(vehicleData);
        await newVehicle.save();
        
        return NextResponse.json({
          success: true,
          message: 'Vehicle added successfully',
          vehicle: newVehicle
        });
      }

      case 'add-refuel': {
        const { vehicleId, date, liters, pricePerLiter, odometer, location, fuelStation, isFull, notes } = body;
        
        if (!vehicleId) {
          return NextResponse.json(
            { error: 'Vehicle ID required' },
            { status: 400 }
          );
        }
        
        const vehicle = await Vehicle.findById(vehicleId);
        
        if (!vehicle || vehicle.userId.toString() !== session.user.id) {
          return NextResponse.json(
            { error: 'Vehicle not found' },
            { status: 404 }
          );
        }
        
        // Create refuel record
        const refuel = new Refuel({
          vehicleId,
          userId: session.user.id,
          date: date || new Date(),
          odometer: odometer || vehicle.currentOdometer,
          liters,
          pricePerLiter,
          totalCost: liters * pricePerLiter,
          fuelType: vehicle.fuelType,
          location: location || '',
          fuelStation: fuelStation || '',
          isFull: isFull || false,
          notes: notes || ''
        });
        
        await refuel.save();
        
        // Update vehicle stats
        vehicle.stats = vehicle.stats || {
          totalRefuels: 0,
          totalLiters: 0,
          totalCost: 0,
          totalDistance: 0,
          avgFuelEfficiency: 0,
          lastRefuelDate: null
        };
        
        vehicle.stats.totalRefuels += 1;
        vehicle.stats.totalLiters += liters;
        vehicle.stats.totalCost += refuel.totalCost;
        vehicle.stats.lastRefuelDate = refuel.date;
        
        // Update odometer if provided and greater
        if (odometer && odometer > vehicle.currentOdometer) {
          const distanceTraveled = odometer - vehicle.currentOdometer;
          vehicle.stats.totalDistance += distanceTraveled;
          vehicle.currentOdometer = odometer;
          
          // Calculate efficiency
          if (vehicle.stats.totalLiters > 0) {
            vehicle.stats.avgFuelEfficiency = 
              vehicle.stats.totalDistance / vehicle.stats.totalLiters;
          }
        }
        
        await vehicle.save();
        
        return NextResponse.json({
          success: true,
          message: 'Refuel record added successfully',
          refuel,
          vehicle
        });
      }

      case 'create-demo': {
        // Create demo vehicles
        const demoVehicles = [
          {
            userId: session.user.id,
            vehicleNumber: 'KCA 123A',
            vehicleName: 'Delivery Truck 1',
            vehicleType: 'truck',
            make: 'Isuzu',
            model: 'NPR',
            year: 2020,
            fuelType: 'ago',
            tankCapacity: 200,
            currentOdometer: 45000,
            status: 'active',
            stats: {
              totalRefuels: 0,
              totalLiters: 0,
              totalCost: 0,
              totalDistance: 0,
              avgFuelEfficiency: 0
            }
          },
          {
            userId: session.user.id,
            vehicleNumber: 'KBZ 456B',
            vehicleName: 'Van 2',
            vehicleType: 'van',
            make: 'Toyota',
            model: 'Hiace',
            year: 2019,
            fuelType: 'pms',
            tankCapacity: 60,
            currentOdometer: 32000,
            status: 'active',
            stats: {
              totalRefuels: 0,
              totalLiters: 0,
              totalCost: 0,
              totalDistance: 0,
              avgFuelEfficiency: 0
            }
          }
        ];
        
        const createdVehicles = await Vehicle.insertMany(demoVehicles);
        
        // Create demo refuels
        const demoRefuels = [
          {
            vehicleId: createdVehicles[0]._id,
            userId: session.user.id,
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            odometer: 44800,
            liters: 180,
            pricePerLiter: 171.47,
            totalCost: 180 * 171.47,
            fuelType: 'ago',
            location: 'Nairobi Depot',
            fuelStation: 'Total Energies',
            isFull: true
          },
          {
            vehicleId: createdVehicles[1]._id,
            userId: session.user.id,
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            odometer: 31900,
            liters: 55,
            pricePerLiter: 184.52,
            totalCost: 55 * 184.52,
            fuelType: 'pms',
            location: 'Mombasa Depot',
            fuelStation: 'Shell',
            isFull: true
          }
        ];
        
        await Refuel.insertMany(demoRefuels);
        
        return NextResponse.json({
          success: true,
          message: 'Demo fleet created successfully',
          vehicles: createdVehicles
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Fleet API POST error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
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

    const vehicle = await Vehicle.findById(vehicleId);
    
    if (!vehicle || vehicle.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    // Update allowed fields
    const allowedUpdates = [
      'vehicleNumber', 'vehicleName', 'vehicleType', 'make', 'model', 
      'year', 'fuelType', 'tankCapacity', 'avgConsumption', 
      'currentOdometer', 'status', 'notes'
    ];
    
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        vehicle[field] = updates[field];
      }
    });

    await vehicle.save();

    return NextResponse.json({
      success: true,
      message: 'Vehicle updated successfully',
      vehicle
    });
  } catch (error) {
    console.error('Fleet API PUT error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
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

    const vehicle = await Vehicle.findById(vehicleId);
    
    if (!vehicle || vehicle.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    // Soft delete - just update status
    vehicle.status = 'deleted';
    await vehicle.save();
    
    // Or hard delete if preferred:
    // await Vehicle.findByIdAndDelete(vehicleId);
    // await Refuel.deleteMany({ vehicleId });

    return NextResponse.json({
      success: true,
      message: 'Vehicle deleted successfully'
    });
  } catch (error) {
    console.error('Fleet API DELETE error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}