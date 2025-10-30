// src/app/api/register/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';

export async function POST(request) {
  try {
    const userData = await request.json();

    console.log('Registration attempt:', { email: userData.email, name: userData.name });

    // Validate required fields
    if (!userData.email || !userData.password || !userData.name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (userData.password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findByEmail(userData.email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create new user (password will be hashed by the model)
    const user = new User({
      email: userData.email,
      password: userData.password,
      name: userData.name,
      phone: userData.phone || '',
      company: userData.company || '',
      role: 'customer',
      profile: {
        businessType: userData.businessType || 'individual',
        deliveryAddress: userData.address || '',
        preferredFuelTypes: userData.preferredFuelTypes || [],
        paymentMethod: userData.paymentMethod || 'mpesa'
      }
    });

    await user.save();

    console.log('✅ Registration successful:', user.email);

    // Return user without password
    const userResponse = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      phone: user.phone,
      company: user.company,
      role: user.role,
      createdAt: user.createdAt
    };

    return NextResponse.json(
      { 
        success: true, 
        user: userResponse,
        message: 'Account created successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during registration' },
      { status: 500 }
    );
  }
}