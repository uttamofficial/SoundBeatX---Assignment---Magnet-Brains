const { connectDB } = require('../config/mongodb');
const Product = require('../models/Product');
const Admin = require('../models/Admin');
const frontendLikeProducts = require('../data/stationeryProducts');

// Build sample products from frontend-like data (to match user site products)
const sampleProducts = frontendLikeProducts.map(p => ({
  name: p.name,
  description: p.description,
  price: Number(p.price),
  category: p.category,
  image: p.image
}));

// Sample admin data
const sampleAdmins = [
  {
    username: 'admin',
    email: 'admin@soundbeatx.com',
    password: 'admin123',
    role: 'super_admin'
  },
  {
    username: 'manager',
    email: 'manager@soundbeatx.com',
    password: 'manager123',
    role: 'admin'
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting MongoDB seeding...');
    
    // Connect to MongoDB
    await connectDB();
    
    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await Product.deleteMany({});
    await Admin.deleteMany({});
    
    // Insert products
    console.log('📦 Inserting products...');
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${products.length} products`);
    
    // Insert admins
    console.log('👤 Inserting admins...');
    const adminPromises = sampleAdmins.map(async (adminData) => {
      const admin = new Admin(adminData);
      return admin.save(); // This will trigger the pre-save hook to hash password
    });
    const admins = await Promise.all(adminPromises);
    console.log(`✅ Inserted ${admins.length} admins`);
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`- Products: ${products.length}`);
    console.log(`- Admins: ${admins.length}`);
    console.log('\n🔑 Default Admin Credentials:');
    console.log('Username: admin, Password: admin123');
    console.log('Username: manager, Password: manager123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
