// src/lib/db/alertStorage.js
// Alert subscription and management system

const STORAGE_KEY = 'fuel_price_alerts';

// Alert subscription structure
const createAlertSubscription = (data) => ({
  id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  name: data.name,
  email: data.email,
  phone: data.phone,
  preferences: {
    fuelTypes: data.fuelTypes || ['pms', 'ago', 'ik'], // Which fuels to track
    locations: data.locations || ['nairobi', 'mombasa'], // Which locations
    alertTypes: data.alertTypes || ['price_increase', 'price_decrease', 'significant_change'], // What triggers alert
    threshold: data.threshold || 5, // Percentage change threshold
    emailEnabled: data.emailEnabled !== false,
    smsEnabled: data.smsEnabled || false,
  },
  status: 'active', // active, paused, unsubscribed
  createdAt: new Date().toISOString(),
  lastAlertSent: null,
  alertCount: 0,
  verificationToken: Math.random().toString(36).substr(2, 9),
  verified: false,
});

// Get all alert subscriptions
export function getAllAlertSubscriptions() {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading alert subscriptions:', error);
    return [];
  }
}

// Get subscription by ID
export function getAlertSubscription(id) {
  const subscriptions = getAllAlertSubscriptions();
  return subscriptions.find(sub => sub.id === id);
}

// Get subscription by email
export function getAlertSubscriptionByEmail(email) {
  const subscriptions = getAllAlertSubscriptions();
  return subscriptions.find(sub => sub.email.toLowerCase() === email.toLowerCase());
}

// Create new alert subscription
export function createAlertSubscriptionRecord(data) {
  try {
    // Check if email already exists
    const existing = getAlertSubscriptionByEmail(data.email);
    if (existing) {
      return {
        success: false,
        error: 'Email already subscribed to alerts',
        subscription: existing
      };
    }

    const subscriptions = getAllAlertSubscriptions();
    const newSubscription = createAlertSubscription(data);
    
    subscriptions.push(newSubscription);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
    
    return {
      success: true,
      subscription: newSubscription
    };
  } catch (error) {
    console.error('Error creating alert subscription:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Update alert subscription
export function updateAlertSubscription(id, updates) {
  try {
    const subscriptions = getAllAlertSubscriptions();
    const index = subscriptions.findIndex(sub => sub.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Subscription not found'
      };
    }

    subscriptions[index] = {
      ...subscriptions[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
    
    return {
      success: true,
      subscription: subscriptions[index]
    };
  } catch (error) {
    console.error('Error updating alert subscription:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Verify subscription
export function verifyAlertSubscription(token) {
  try {
    const subscriptions = getAllAlertSubscriptions();
    const subscription = subscriptions.find(sub => sub.verificationToken === token);
    
    if (!subscription) {
      return {
        success: false,
        error: 'Invalid verification token'
      };
    }

    return updateAlertSubscription(subscription.id, { verified: true });
  } catch (error) {
    console.error('Error verifying subscription:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Pause subscription
export function pauseAlertSubscription(id) {
  return updateAlertSubscription(id, { status: 'paused' });
}

// Resume subscription
export function resumeAlertSubscription(id) {
  return updateAlertSubscription(id, { status: 'active' });
}

// Unsubscribe
export function unsubscribeAlert(id) {
  return updateAlertSubscription(id, { 
    status: 'unsubscribed',
    unsubscribedAt: new Date().toISOString()
  });
}

// Delete subscription
export function deleteAlertSubscription(id) {
  try {
    const subscriptions = getAllAlertSubscriptions();
    const filtered = subscriptions.filter(sub => sub.id !== id);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    
    return {
      success: true,
      deleted: true
    };
  } catch (error) {
    console.error('Error deleting subscription:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Record alert sent
export function recordAlertSent(id) {
  const subscription = getAlertSubscription(id);
  if (!subscription) return { success: false };

  return updateAlertSubscription(id, {
    lastAlertSent: new Date().toISOString(),
    alertCount: subscription.alertCount + 1
  });
}

// Get active subscriptions for a specific fuel type and location
export function getActiveSubscriptionsForFuel(fuelType, location) {
  const subscriptions = getAllAlertSubscriptions();
  
  return subscriptions.filter(sub => 
    sub.status === 'active' &&
    sub.verified &&
    sub.preferences.fuelTypes.includes(fuelType) &&
    sub.preferences.locations.includes(location)
  );
}

// Check if price change should trigger alert
export function shouldTriggerAlert(subscription, priceChange) {
  const { alertTypes, threshold } = subscription.preferences;
  const changePercent = Math.abs(priceChange.percentageChange);

  // Check if change exceeds threshold
  if (changePercent < threshold) {
    return false;
  }

  // Check alert type preferences
  if (priceChange.percentageChange > 0 && !alertTypes.includes('price_increase')) {
    return false;
  }

  if (priceChange.percentageChange < 0 && !alertTypes.includes('price_decrease')) {
    return false;
  }

  if (changePercent >= 10 && !alertTypes.includes('significant_change')) {
    return false;
  }

  return true;
}

// Get alert statistics
export function getAlertStatistics() {
  const subscriptions = getAllAlertSubscriptions();
  
  return {
    total: subscriptions.length,
    active: subscriptions.filter(s => s.status === 'active').length,
    paused: subscriptions.filter(s => s.status === 'paused').length,
    unsubscribed: subscriptions.filter(s => s.status === 'unsubscribed').length,
    verified: subscriptions.filter(s => s.verified).length,
    unverified: subscriptions.filter(s => !s.verified).length,
    emailEnabled: subscriptions.filter(s => s.preferences.emailEnabled).length,
    smsEnabled: subscriptions.filter(s => s.preferences.smsEnabled).length,
    totalAlertsSent: subscriptions.reduce((sum, s) => sum + s.alertCount, 0),
  };
}

// Format fuel type name
export function getFuelTypeName(code) {
  const names = {
    pms: 'Super Petrol',
    ago: 'Diesel',
    ik: 'Kerosene'
  };
  return names[code] || code.toUpperCase();
}

// Format location name
export function getLocationName(code) {
  const names = {
    nairobi: 'Nairobi',
    mombasa: 'Mombasa'
  };
  return names[code] || code;
}

// Export sample alert for testing
export function createSampleAlert() {
  return createAlertSubscriptionRecord({
    name: 'Test User',
    email: 'test@example.com',
    phone: '+254700000000',
    fuelTypes: ['pms', 'ago'],
    locations: ['nairobi'],
    alertTypes: ['price_increase', 'price_decrease', 'significant_change'],
    threshold: 3,
    emailEnabled: true,
    smsEnabled: true,
  });
}