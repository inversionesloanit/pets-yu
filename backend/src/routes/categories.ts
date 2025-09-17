import { Router } from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateCreateCategory, validateId } from '../middleware/validation';

const router = Router();

// Public routes
router.get('/', getAllCategories);
router.get('/:id', validateId, getCategoryById);

// Protected routes (Admin only)
router.post('/', authenticateToken, requireRole(['ADMIN']), validateCreateCategory, createCategory);
router.put('/:id', authenticateToken, requireRole(['ADMIN']), validateId, updateCategory);
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), validateId, deleteCategory);

export default router;
