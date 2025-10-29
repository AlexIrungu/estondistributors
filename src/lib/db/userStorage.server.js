// src/lib/db/userStorage.server.js
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Hash password using Node.js crypto
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

const verifyPassword = (password, hashedPassword) => {
  const hashed = hashPassword(password);
  return hashed === hashedPassword;
};

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Read users from file
async function readUsers() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Write users to file
async function writeUsers(users) {
  await ensureDataDir();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

// User structure
const createUser = (data) => ({
  id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  email: data.email.toLowerCase(),
  password: hashPassword(data.password),
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
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  lastLogin: null,
});

// Get user by email
export async function getUserByEmail(email) {
  const users = await readUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

// Get user by ID
export async function getUserById(id) {
  const users = await readUsers();
  const user = users.find(u => u.id === id);
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
}

// Create new user
export async function createUserAccount(data) {
  try {
    // Check if email already exists
    const existing = await getUserByEmail(data.email);
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

    const users = await readUsers();
    const newUser = createUser(data);
    
    users.push(newUser);
    await writeUsers(users);
    
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
      error: error.message || 'Failed to create user'
    };
  }
}

// Authenticate user
export async function authenticateUser(email, password) {
  try {
    const user = await getUserByEmail(email);
    
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

    const isValidPassword = verifyPassword(password, user.password);
    
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

// Update user
export async function updateUser(id, updates) {
  try {
    const users = await readUsers();
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
    
    await writeUsers(users);
    
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
    const users = await readUsers();
    const user = users.find(u => u.id === id);
    
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    // Verify current password
    const isValidPassword = verifyPassword(currentPassword, user.password);
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
    const hashedPassword = hashPassword(newPassword);
    
    // Update password
    const index = users.findIndex(u => u.id === id);
    users[index] = {
      ...users[index],
      password: hashedPassword,
      updatedAt: new Date().toISOString()
    };
    
    await writeUsers(users);
    
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
    const users = await readUsers();
    const index = users.findIndex(u => u.id === userId);
    
    if (index === -1) return { success: false };

    users[index].stats = {
      totalOrders: users[index].stats.totalOrders + 1,
      totalSpent: users[index].stats.totalSpent + orderData.totalCost,
      lastOrderDate: orderData.orderDate,
    };
    
    await writeUsers(users);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating user stats:', error);
    return { success: false };
  }
}

// Get all users (admin only)
export async function getAllUsers() {
  return await readUsers();
}
