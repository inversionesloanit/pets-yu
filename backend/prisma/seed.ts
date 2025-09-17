import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Accesorios' },
      update: {},
      create: {
        name: 'Accesorios',
        description: 'Collares, arneses y accesorios para mascotas'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Juguetes' },
      update: {},
      create: {
        name: 'Juguetes',
        description: 'Juguetes interactivos y de entretenimiento'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Hogar' },
      update: {},
      create: {
        name: 'Hogar',
        description: 'Camas, casas y accesorios para el hogar'
      }
    })
  ]);

  console.log('✅ Categories created');

  // Create products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { id: 'product-1' },
      update: {},
      create: {
        id: 'product-1',
        name: 'Collar Premium para Perros',
        description: 'Collar de cuero genuino con hebilla de acero inoxidable. Disponible en varios colores y tallas.',
        price: 25.99,
        image: 'https://placehold.co/300x300/FFD700/FFFFFF?text=Premium+Collar',
        categoryId: categories[0].id,
        inStock: true,
        rating: 4.8
      }
    }),
    prisma.product.upsert({
      where: { id: 'product-2' },
      update: {},
      create: {
        id: 'product-2',
        name: 'Juguete Interactivo para Gatos',
        description: 'Juguete con plumas y sonido que mantiene a tu gato entretenido por horas.',
        price: 18.50,
        image: 'https://placehold.co/300x300/FF6B6B/FFFFFF?text=Interactive+Toy',
        categoryId: categories[1].id,
        inStock: true,
        rating: 4.5
      }
    }),
    prisma.product.upsert({
      where: { id: 'product-3' },
      update: {},
      create: {
        id: 'product-3',
        name: 'Cama Cómoda para Mascotas',
        description: 'Cama ortopédica con memoria de forma para el máximo confort de tu mascota.',
        price: 89.99,
        image: 'https://placehold.co/300x300/4ECDC4/FFFFFF?text=Comfort+Bed',
        categoryId: categories[2].id,
        inStock: false,
        rating: 4.9
      }
    }),
    prisma.product.upsert({
      where: { id: 'product-4' },
      update: {},
      create: {
        id: 'product-4',
        name: 'Arnes de Seguridad para Perros',
        description: 'Arnes ajustable con correa incluida. Perfecto para paseos seguros.',
        price: 32.00,
        image: 'https://placehold.co/300x300/45B7D1/FFFFFF?text=Safety+Harness',
        categoryId: categories[0].id,
        inStock: true,
        rating: 4.7
      }
    })
  ]);

  console.log('✅ Products created');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@petsyu.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@petsyu.com',
      password: hashedPassword,
      role: 'ADMIN',
      phone: '+507 123-4567',
      address: 'Av. Central #123',
      city: 'Ciudad de Panamá',
      country: 'Panamá'
    }
  });

  console.log('✅ Admin user created');

  // Create sample customer
  const customerPassword = await bcrypt.hash('customer123', 12);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@petsyu.com' },
    update: {},
    create: {
      name: 'Cliente Demo',
      email: 'customer@petsyu.com',
      password: customerPassword,
      role: 'CUSTOMER',
      phone: '+507 987-6543',
      address: 'Calle 50 #456',
      city: 'Ciudad de Panamá',
      country: 'Panamá'
    }
  });

  console.log('✅ Customer user created');

  // Create testimonials
  const testimonials = await Promise.all([
    prisma.testimonial.upsert({
      where: { id: 'testimonial-1' },
      update: {},
      create: {
        id: 'testimonial-1',
        name: 'María González',
        location: 'Panamá City',
        text: 'Los productos de Pets Yu son de excelente calidad y mi perro los ama!',
        rating: 5
      }
    }),
    prisma.testimonial.upsert({
      where: { id: 'testimonial-2' },
      update: {},
      create: {
        id: 'testimonial-2',
        name: 'Carlos Pérez',
        location: 'San José',
        text: 'Compré varios accesorios para mi gato y todos han sido duraderos y cómodos.',
        rating: 5
      }
    }),
    prisma.testimonial.upsert({
      where: { id: 'testimonial-3' },
      update: {},
      create: {
        id: 'testimonial-3',
        name: 'Ana Rodríguez',
        location: 'Colón',
        text: 'El servicio al cliente es excelente y el envío fue muy rápido.',
        rating: 4
      }
    })
  ]);

  console.log('✅ Testimonials created');

  console.log('🎉 Database seed completed successfully!');
  console.log('\n📋 Created:');
  console.log(`- ${categories.length} categories`);
  console.log(`- ${products.length} products`);
  console.log(`- 2 users (admin & customer)`);
  console.log(`- ${testimonials.length} testimonials`);
  console.log('\n🔑 Login credentials:');
  console.log('Admin: admin@petsyu.com / admin123');
  console.log('Customer: customer@petsyu.com / customer123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
