// src/lib/db/userStorage.server.js
// User authentication and profile management with MongoDB

import connectDB from './mongodb';
import User from './models/User';

// Get user by email
export async function getUserByEmail(email) {
  try {
    await connectDB();
    const user = await User.findByEmail(email);
    return user;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
}

// Get user by ID
export async function getUserById(id) {
  try {
    await connectDB();
    const user = await User.findById(id).select('-password');
    return user ? user.toJSON() : null;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
}

// Create new user
export async function createUserAccount(data) {
  try {
    await connectDB();

    // Check if email already exists
    const existing = await User.findByEmail(data.email);
    if (existing) {
      return {
        success: false,
        error: 'Email already registered'
      };
    }

    // Validate required fields
    if (!data.email || !data.password || !data.name) {
      return {
        success: false,
        error: 'Email, password, and name are required'
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return {
        success: false,
        error: 'Invalid email format'
      };
    }

    // Validate password strength
    if (data.password.length < 6) {
      return {
        success: false,
        error: 'Password must be at least 6 characters'
      };
    }

    // Create new user
    const newUser = new User({
      email: data.email,
      password: data.password,
      name: data.name,
      phone: data.phone || '',
      company: data.company || '',
      address: data.address || '',
      role: data.role || 'customer',
      profile: {
        businessType: data.businessType || 'individual',
        deliveryAddress: data.deliveryAddress || '',
        billingAddress: data.billingAddress || '',
        preferredFuelTypes: data.preferredFuelTypes || [],
        paymentMethod: data.paymentMethod || 'cash',
      }
    });

    await newUser.save();
    
    return {
      success: true,
      user: newUser.toJSON()
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      success: false,
      error: error.message || 'Failed to create user'
    };
  }
}

// Authenticate user
export async function authenticateUser(email, password) {
  try {
    await connectDB();

    const user = await User.findByEmail(email);
    
    if (!user) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    if (user.status !== 'active') {
      return {
        success: false,
        error: 'Account is suspended or deleted'
      };
    }

    const isValidPassword = await user.comparePassword(password);
    
    if (!isValidPassword) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    return {
      success: true,
      user: user.toJSON()
    };
  } catch (error) {
    console.error('Error authenticating user:', error);
    return {
      success: false,
      error: 'Authentication failed'
    };
  }
}

// Update user profile
export async function updateUser(id, updates) {
  try {
    await connectDB();

    // Don't allow updating certain fields directly
    const { password, email, role, ...safeUpdates } = updates;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: safeUpdates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }
    
    return {
      success: true,
      user: user.toJSON()
    };
  } catch (error) {
    console.error('Error updating user:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Update user password
export async function updateUserPassword(id, currentPassword, newPassword) {
  try {
    await connectDB();

    const user = await User.findById(id);
    
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    // Verify current password
    const isValidPassword = await user.comparePassword(currentPassword);
    if (!isValidPassword) {
      return {
        success: false,
        error: 'Current password is incorrect'
      };
    }

    // Validate new password
    if (newPassword.length < 6) {
      return {
        success: false,
        error: 'New password must be at least 6 characters'
      };
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();
    
    return {
      success: true,
      message: 'Password updated successfully'
    };
  } catch (error) {
    console.error('Error updating password:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Update user stats
export async function updateUserStats(userId, orderData) {
  try {
    await connectDB();

    const user = await User.findById(userId);
    
    if (!user) {
      return { success: false };
    }

    user.stats.totalOrders += 1;
    user.stats.totalSpent += orderData.totalCost;
    user.stats.lastOrderDate = orderData.orderDate;

    await user.save();
    
    return { success: true };
  } catch (error) {
    console.error('Error updating user stats:', error);
    return { success: false };
  }
}

// Get all users (admin only)
export async function getAllUsers() {
  try {
    await connectDB();
    const users = await User.find().select('-password');
    return users.map(user => user.toJSON());
  } catch (error) {
    console.error('Error fetching all users:', error);
    return [];
  }
}

// Create demo users (for testing)
export async function createDemoUsers() {
  const demoUsers = [
    {
      email: 'demo@estonkd.com',
      password: 'demo123',
      name: 'Demo Customer',
      phone: '+254700000000',
      company: 'Demo Company Ltd',
      businessType: 'corporate',
      deliveryAddress: '123 Demo Street, Nairobi',
      preferredFuelTypes: ['pms', 'ago'],
    },
    {
      email: 'admin@estonkd.com',
      password: 'admin123',
      name: 'Admin User',
      phone: '+254700000001',
      role: 'admin',
    }
  ];

  const results = [];
  for (const userData of demoUsers) {
    const result = await createUserAccount(userData);
    results.push(result);
  }

  return results;
}

// Check if demo users exist
export async function demoUsersExist() {
  try {
    await connectDB();
    const demoUser = await User.findByEmail('demo@estonkd.com');
    return !!demoUser;
  } catch (error) {
    return false;
  }
}

// Initialize demo users
export async function initializeDemoUsers() {
  const exists = await demoUsersExist();
  if (!exists) {
    return await createDemoUsers();
  }
  return { success: true, message: 'Demo users already exist' };
}