const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const admin = await prisma.user.create({
      data: {
        name: 'Administrator',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN',
        phone: '+1234567890',
        address: 'Admin Address',
        city: 'Admin City',
        country: 'Admin Country'
      }
    });

    console.log('Admin user created successfully:', {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    });

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

