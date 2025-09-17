import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
} from '../controllers/productController';
import { authenticateToken, requireRole } from '../middleware/auth';
import {
  validateCreateProduct,
  validateUpdateProduct,
  validateId,
  validatePagination
} from '../middleware/validation';

const router = Router();

// Public routes
router.get('/', validatePagination, getAllProducts);
router.get('/category/:categoryId', validatePagination, getProductsByCategory);
router.get('/:id', validateId, getProductById);

// Protected routes (Admin only)
router.post('/', authenticateToken, requireRole(['ADMIN']), validateCreateProduct, createProduct);
router.put('/:id', authenticateToken, requireRole(['ADMIN']), validateId, validateUpdateProduct, updateProduct);
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), validateId, deleteProduct);

export default router;
