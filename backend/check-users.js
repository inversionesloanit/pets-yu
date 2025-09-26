const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('🔍 Checking database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    
    console.log(`\n📊 Found ${users.length} users:`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role} - Created: ${user.createdAt}`);
    });
    
    // Check for admin users
    const adminUsers = users.filter(user => user.role === 'ADMIN');
    console.log(`\n👑 Admin users: ${adminUsers.length}`);
    adminUsers.forEach(admin => {
      console.log(`- ${admin.name} (${admin.email})`);
    });
    
    // Check if specific admin exists
    const adminExists = await prisma.user.findFirst({
      where: { email: 'admin@example.com' }
    });
    
    console.log(`\n🔍 admin@example.com exists:`, adminExists ? 'YES' : 'NO');
    if (adminExists) {
      console.log('   Details:', {
        id: adminExists.id,
        name: adminExists.name,
        email: adminExists.email,
        role: adminExists.role
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();



