import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import products from './data/products.js';
import connectDB from './config/db.js';

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    isAdmin: true,
  },
  {
    name: 'Jane Customer',
    email: 'jane@example.com',
    password: 'password123',
    isAdmin: false,
  },
];

const importData = async () => {
  try {
    await connectDB();

    // Clear existing collections
    await Product.deleteMany();
    await User.deleteMany();

    // Insert users (triggers pre-save password hashing)
    const createdUsers = [];
    for (const user of users) {
      const created = await User.create(user);
      createdUsers.push(created);
    }

    const adminUser = createdUsers[0]._id;

    // Attach admin user as creator of products
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    await Product.insertMany(sampleProducts);

    console.log('✅ Users and Products imported successfully!');
    console.log(`📦 Inserted ${sampleProducts.length} sample products.`);
    console.log('Admin Account: admin@example.com / password123');
    console.log('Customer Account: jane@example.com / password123');
    process.exit();
  } catch (error) {
    console.error(`❌ Error importing data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Product.deleteMany();
    await User.deleteMany();

    console.log('✅ All data destroyed!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
