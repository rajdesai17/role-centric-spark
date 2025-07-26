import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.rating.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Cleared existing data');

  // Create demo users matching the frontend expectations
  const adminPassword = await hashPassword('AdminPass123!');
  const userPassword = await hashPassword('UserPass123!');
  const ownerPassword = await hashPassword('OwnerPass123!');

  await prisma.user.create({
    data: {
      name: 'System Administrator Account',
      email: 'admin@test.com',
      password: adminPassword,
      address: '123 Admin Street, Admin City, AC 12345',
      role: 'SYSTEM_ADMIN',
    },
  });

  const normalUser = await prisma.user.create({
    data: {
      name: 'Regular User Account For Testing',
      email: 'user@test.com',
      password: userPassword,
      address: '456 User Avenue, User Town, UT 54321',
      role: 'NORMAL_USER',
    },
  });

  const storeOwner1 = await prisma.user.create({
    data: {
      name: 'Store Owner Account Number One',
      email: 'owner@test.com',
      password: ownerPassword,
      address: '789 Owner Boulevard, Owner City, OC 98765',
      role: 'STORE_OWNER',
    },
  });

  const storeOwner2 = await prisma.user.create({
    data: {
      name: 'Second Store Owner Account Here',
      email: 'owner2@test.com',
      password: ownerPassword,
      address: '101 Second Owner Street, Owner City, OC 11111',
      role: 'STORE_OWNER',
    },
  });

  console.log('👥 Created demo users');

  // Create demo stores matching the frontend expectations
  const store1 = await prisma.store.create({
    data: {
      name: 'Tech Electronics Store',
      email: 'contact@techelectronics.com',
      address: '123 Tech Street, Silicon Valley, CA 94000',
      ownerId: storeOwner1.id,
    },
  });

  const store2 = await prisma.store.create({
    data: {
      name: 'Fashion Boutique Central',
      email: 'info@fashionboutique.com',
      address: '456 Fashion Ave, New York, NY 10001',
      ownerId: storeOwner1.id,
    },
  });

  const store3 = await prisma.store.create({
    data: {
      name: 'Home Goods Market Place',
      email: 'hello@homegoods.com',
      address: '789 Home Street, Chicago, IL 60601',
      ownerId: storeOwner2.id,
    },
  });

  console.log('🏪 Created demo stores');

  // Create multiple additional users for better statistics
  const extraUsers = [];
  for (let i = 1; i <= 20; i++) {
    const extraUser = await prisma.user.create({
      data: {
        name: `Demo User Number ${i} For Testing Purposes`,
        email: `demo${i}@test.com`,
        password: userPassword,
        address: `${100 + i} Demo Street, Demo City, DC ${10000 + i}`,
        role: 'NORMAL_USER',
      },
    });
    extraUsers.push(extraUser);
  }

  console.log('👥 Created additional demo users');

  // Create ratings to match expected statistics
  // Tech Electronics Store - Target: 4.5 rating, 120 reviews
  const techRatings = [];
  for (let i = 0; i < 120; i++) {
    const userId = i === 0 ? normalUser.id : extraUsers[i % extraUsers.length].id;
    const rating = Math.random() < 0.8 ? (Math.random() < 0.6 ? 5 : 4) : 3; // Bias toward 4-5 ratings
    
    try {
      const newRating = await prisma.rating.create({
        data: {
          userId,
          storeId: store1.id,
          rating,
        },
      });
      techRatings.push(newRating);
    } catch (error) {
      // Skip duplicate user-store combinations
      continue;
    }
  }

  // Fashion Boutique Central - Target: 4.2 rating, 89 reviews
  const fashionRatings = [];
  for (let i = 0; i < 89; i++) {
    const userId = extraUsers[i % extraUsers.length].id;
    const rating = Math.random() < 0.7 ? (Math.random() < 0.5 ? 4 : 5) : (Math.random() < 0.5 ? 3 : 2);
    
    try {
      const newRating = await prisma.rating.create({
        data: {
          userId,
          storeId: store2.id,
          rating,
        },
      });
      fashionRatings.push(newRating);
    } catch (error) {
      // Skip duplicate user-store combinations
      continue;
    }
  }

  // Home Goods Market Place - Target: 3.8 rating, 67 reviews
  const homeRatings = [];
  for (let i = 0; i < 67; i++) {
    const userId = extraUsers[i % extraUsers.length].id;
    const rating = Math.random() < 0.6 ? 4 : (Math.random() < 0.4 ? 3 : (Math.random() < 0.3 ? 5 : 2));
    
    try {
      const newRating = await prisma.rating.create({
        data: {
          userId,
          storeId: store3.id,
          rating,
        },
      });
      homeRatings.push(newRating);
    } catch (error) {
      // Skip duplicate user-store combinations
      continue;
    }
  }

  console.log('⭐ Created demo ratings');

  // Verify the statistics
  const userCount = await prisma.user.count();
  const storeCount = await prisma.store.count();
  const ratingCount = await prisma.rating.count();

  console.log('\n📊 Database Statistics:');
  console.log(`Total Users: ${userCount}`);
  console.log(`Total Stores: ${storeCount}`);
  console.log(`Total Ratings: ${ratingCount}`);

  console.log('\n🔑 Demo Accounts:');
  console.log('Admin: admin@test.com / AdminPass123!');
  console.log('User: user@test.com / UserPass123!');
  console.log('Store Owner: owner@test.com / OwnerPass123!');

  console.log('\n✅ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });