import { Router } from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders
} from '../controllers/orderController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateCreateOrder, validateId, validatePagination } from '../middleware/validation';

const router = Router();

// Protected routes
router.post('/', authenticateToken, validateCreateOrder, createOrder);
router.get('/my-orders', authenticateToken, validatePagination, getUserOrders);
router.get('/:id', authenticateToken, validateId, getOrderById);

// Admin routes
router.get('/', authenticateToken, requireRole(['ADMIN']), validatePagination, getAllOrders);
router.put('/:id/status', authenticateToken, requireRole(['ADMIN']), validateId, updateOrderStatus);

export default router;
