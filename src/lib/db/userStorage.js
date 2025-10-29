// src/lib/db/userStorage.js
// User authentication and profile management

import bcrypt from 'bcryptjs';

const STORAGE_KEY = 'eston_users';

// User structure
const createUser = async (data) => ({
  id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  email: data.email.toLowerCase(),
  password: await bcrypt.hash(data.password, 10),
  name: data.name,
  phone: data.phone || '',
  company: data.company || '',
  role: data.role || 'customer', // customer, admin
  profile: {
    businessType: data.businessType || 'individual', // individual, corporate, fleet
    deliveryAddress: data.deliveryAddress || '',
    billingAddress: data.billingAddress || '',
    preferredFuelTypes: data.preferredFuelTypes || [],
    paymentMethod: data.paymentMethod || 'cash',
  },
  preferences: {
    emailNotifications: true,
    smsNotifications: false,
    priceAlerts: false,
    newsletter: true,
  },
  stats: {
    totalOrders: 0,
    totalSpent: 0,
    lastOrderDate: null,
  },
  status: 'active', // active, suspended, deleted
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  lastLogin: null,
});

// Get all users (admin only)
export function getAllUsers() {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading users:', error);
    return [];
  }
}

// Get user by ID
export function getUserById(id) {
  const users = getAllUsers();
  const user = users.find(u => u.id === id);
  if (user) {
    // Remove password from returned user
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
}

// Get user by email
export function getUserByEmail(email) {
  const users = getAllUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

// Create new user (registration)
export async function createUserAccount(data) {
  try {
    // Check if email already exists
    const existing = getUserByEmail(data.email);
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

    const users = getAllUsers();
    const newUser = await createUser(data);
    
    users.push(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    
    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    
    return {
      success: true,
      user: userWithoutPassword
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Authenticate user (login)
export async function authenticateUser(email, password) {
  try {
    const user = getUserByEmail(email);
    
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

    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    // Update last login
    await updateUser(user.id, { lastLogin: new Date().toISOString() });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      success: true,
      user: userWithoutPassword
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
    const users = getAllUsers();
    const index = users.findIndex(u => u.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    // Don't allow updating certain fields directly
    const { password, email, role, ...safeUpdates } = updates;

    users[index] = {
      ...users[index],
      ...safeUpdates,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    
    const { password: _, ...userWithoutPassword } = users[index];
    
    return {
      success: true,
      user: userWithoutPassword
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
    const users = getAllUsers();
    const user = users.find(u => u.id === id);
    
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
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

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    const index = users.findIndex(u => u.id === id);
    users[index] = {
      ...users[index],
      password: hashedPassword,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    
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

// Update user stats (called when order is placed)
export function updateUserStats(userId, orderData) {
  try {
    const users = getAllUsers();
    const index = users.findIndex(u => u.id === userId);
    
    if (index === -1) return { success: false };

    users[index].stats = {
      totalOrders: users[index].stats.totalOrders + 1,
      totalSpent: users[index].stats.totalSpent + orderData.totalCost,
      lastOrderDate: orderData.orderDate,
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    
    return { success: true };
  } catch (error) {
    console.error('Error updating user stats:', error);
    return { success: false };
  }
}

// Create demo users for testing
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
  for (const user of demoUsers) {
    const result = await createUserAccount(user);
    results.push(result);
  }

  return results;
}

// Check if demo users exist
export function demoUsersExist() {
  const users = getAllUsers();
  return users.some(u => u.email === 'demo@estonkd.com');
}

// Initialize demo users if needed
export async function initializeDemoUsers() {
  if (!demoUsersExist()) {
    return await createDemoUsers();
  }
  return { success: true, message: 'Demo users already exist' };
}