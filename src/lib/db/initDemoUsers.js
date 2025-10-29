// src/lib/db/initDemoUsers.js
import { createUserAccount, getUserByEmail } from './userStorage.server.js';

export async function initializeDemoUsers() {
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
    },
    {
      email: 'alex.irungu@student.moringaschool.com',
      password: 'password123',
      name: 'Alex Muiruri Irungu',
      phone: '+254700000002',
      company: 'Moringa School',
      role: 'customer',
    }
  ];

  const results = [];
  
  for (const user of demoUsers) {
    // Check if user already exists
    const existing = await getUserByEmail(user.email);
    
    if (!existing) {
      const result = await createUserAccount(user);
      results.push({
        email: user.email,
        created: result.success,
        error: result.error
      });
      console.log(`✓ Created user: ${user.email}`);
    } else {
      results.push({
        email: user.email,
        created: false,
        skipped: true
      });
      console.log(`⊘ User already exists: ${user.email}`);
    }
  }

  return results;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDemoUsers()
    .then((results) => {
      console.log('\nDemo users initialization complete:');
      console.log(JSON.stringify(results, null, 2));
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error initializing demo users:', error);
      process.exit(1);
    });
}