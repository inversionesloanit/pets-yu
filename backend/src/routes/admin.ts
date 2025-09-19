import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth';
import { uploadSingle } from '../middleware/upload';
import { prisma } from '../index';
import path from 'path';

const router = Router();

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Admin routes are working',
    timestamp: new Date().toISOString(),
    dirname: __dirname
  });
});

// Test static files
router.get('/test-static', (req, res) => {
  const adminJsPath = path.join(__dirname, '../../public/admin/admin.js');
  const fs = require('fs');
  
  try {
    const exists = fs.existsSync(adminJsPath);
    res.json({
      success: true,
      adminJsPath,
      exists,
      files: fs.readdirSync(path.join(__dirname, '../../public/admin'))
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
      adminJsPath
    });
  }
});

// List all users (for debugging)
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    
    res.json({
      success: true,
      users,
      count: users.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
});

// Test password for specific user
router.post('/test-password', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Testing password for:', email);
    
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.json({ success: false, error: 'User not found' });
    }
    
    const bcrypt = require('bcryptjs');
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      passwordValid: isValidPassword,
      passwordHash: user.password.substring(0, 20) + '...'
    });
  } catch (error) {
    console.error('Error testing password:', error);
    res.status(500).json({ error: 'Failed to test password', details: error.message });
  }
});

// Serve admin panel
router.get('/', (req, res) => {
  const filePath = path.join(__dirname, '../../public/admin/index.html');
  console.log('Attempting to serve admin panel from:', filePath);
  console.log('__dirname:', __dirname);
  
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error serving admin panel:', err);
      res.status(500).json({ error: 'Failed to serve admin panel', details: err.message });
    }
  });
});

// Serve static files for admin panel
router.use('/static', require('express').static(path.join(__dirname, '../../public/admin')));

// Serve admin.js directly
router.get('/admin.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/admin/admin.js'), {
    headers: {
      'Content-Type': 'application/javascript'
    }
  });
});

// Admin login endpoint
router.post('/login', async (req, res) => {
  try {
    console.log('=== ADMIN LOGIN START ===');
    console.log('Admin login attempt:', req.body);
    const { email, password } = req.body;
    
    console.log('Looking for user with email:', email);
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    console.log('User found:', user ? { id: user.id, email: user.email, role: user.role } : 'No user found');

    if (!user) {
      console.log('No user found with email:', email);
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    if (user.role !== 'ADMIN') {
      console.log('User is not admin, role:', user.role);
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    console.log('User is admin, checking password...');
    const bcrypt = require('bcryptjs');
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isValidPassword);

    if (!isValidPassword) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    console.log('Generating JWT token...');
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    console.log('JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);
    
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    console.log('Token generated successfully, length:', token.length);
    console.log('Login successful for user:', email);
    console.log('=== ADMIN LOGIN SUCCESS ===');
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('=== ADMIN LOGIN ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('=== END ADMIN LOGIN ERROR ===');
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// Serve uploaded images (public)
router.use('/uploads', require('express').static(path.join(__dirname, '../../public/uploads')));

// Protected admin routes (require authentication)
router.use(authenticateToken);
router.use(requireRole(['ADMIN']));

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [totalProducts, totalCategories, totalOrders, totalUsers] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count(),
      prisma.user.count()
    ]);

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });

    res.json({
      success: true,
      data: {
        stats: {
          totalProducts,
          totalCategories,
          totalOrders,
          totalUsers
        },
        recentOrders
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// Upload image endpoint
router.post('/upload', uploadSingle, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      data: { imageUrl }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;

