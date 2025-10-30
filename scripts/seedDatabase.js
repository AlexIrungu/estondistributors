// scripts/seedDatabase.js
// Script to seed initial data into MongoDB

// ✨ ADD THIS: Load environment variables
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local from project root
dotenv.config({ path: join(__dirname, '..', '.env.local') });

import mongoose from 'mongoose';
import connectDB from '../src/lib/db/mongodb.js';
import User from '../src/lib/db/models/User.js';
import Inventory from '../src/lib/db/models/Inventory.js';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Debug: Check if env variable is loaded
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      console.log('💡 Make sure .env.local exists in your project root');
      process.exit(1);
    }
    
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // 1. Seed Demo Users
    console.log('\n📝 Seeding demo users...');
    
    const demoUsers = [
      {
        email: 'demo@estonkd.com',
        password: 'demo123',
        name: 'Demo Customer',
        phone: '+254700000000',
        company: 'Demo Company Ltd',
        profile: {
          businessType: 'corporate',
          deliveryAddress: '123 Demo Street, Nairobi',
          preferredFuelTypes: ['pms', 'ago'],
          paymentMethod: 'mpesa'
        }
      },
      {
        email: 'admin@estonkd.com',
        password: 'admin123',
        name: 'Admin User',
        phone: '+254700000001',
        role: 'admin',
        company: 'Eston Distributors'
      }
    ];

    for (const userData of demoUsers) {
      const existingUser = await User.findByEmail(userData.email);
      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        console.log(`✅ Created user: ${userData.email}`);
      } else {
        console.log(`⏭️  User already exists: ${userData.email}`);
      }
    }

    // 2. Seed Inventory Data
    console.log('\n📦 Seeding inventory data...');
    
    const inventoryData = [
      {
        locationId: 'nairobi',
        locationName: 'Nairobi Depot',
        locationAddress: 'Industrial Area, Nairobi',
        contactPhone: '+254722943291',
        fuelStock: {
          pms: {
            currentStock: 85000,
            capacity: 150000,
            reserved: 10000,
            available: 75000
          },
          ago: {
            currentStock: 120000,
            capacity: 200000,
            reserved: 15000,
            available: 105000
          },
          ik: {
            currentStock: 45000,
            capacity: 100000,
            reserved: 5000,
            available: 40000
          }
        },
        status: 'active'
      },
      {
        locationId: 'mombasa',
        locationName: 'Mombasa Depot',
        locationAddress: 'Port Reitz, Mombasa',
        contactPhone: '+254722943291',
        fuelStock: {
          pms: {
            currentStock: 95000,
            capacity: 180000,
            reserved: 12000,
            available: 83000
          },
          ago: {
            currentStock: 160000,
            capacity: 250000,
            reserved: 20000,
            available: 140000
          },
          ik: {
            currentStock: 55000,
            capacity: 120000,
            reserved: 8000,
            available: 47000
          }
        },
        status: 'active'
      }
    ];

    for (const invData of inventoryData) {
      const existing = await Inventory.findByLocation(invData.locationId);
      if (!existing) {
        const inventory = new Inventory(invData);
        await inventory.save();
        console.log(`✅ Created inventory: ${invData.locationName}`);
      } else {
        console.log(`⏭️  Inventory already exists: ${invData.locationName}`);
      }
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${await User.countDocuments()}`);
    console.log(`   Inventory Locations: ${await Inventory.countDocuments()}`);
    
    console.log('\n🔐 Demo Credentials:');
    console.log('   Customer: demo@estonkd.com / demo123');
    console.log('   Admin: admin@estonkd.com / admin123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
  }
}

// Run the seed function
seedDatabase();