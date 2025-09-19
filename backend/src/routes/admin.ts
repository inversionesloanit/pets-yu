import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth';
import { uploadSingle } from '../middleware/upload';
import { prisma } from '../index';
import path from 'path';

const router = Router();

// Serve admin panel
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../public/admin/index.html'));
});

// Serve static files for admin panel
router.use('/static', require('express').static(path.join(__dirname, '../../../public/admin')));

// Admin login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || user.role !== 'ADMIN') {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const bcrypt = require('bcryptjs');
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

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
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Serve uploaded images (public)
router.use('/uploads', require('express').static(path.join(__dirname, '../../../public/uploads')));

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

