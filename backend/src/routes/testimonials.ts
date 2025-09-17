import { Router } from 'express';
import {
  getAllTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} from '../controllers/testimonialController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateCreateTestimonial, validateId, validatePagination } from '../middleware/validation';

const router = Router();

// Public routes
router.get('/', validatePagination, getAllTestimonials);
router.get('/:id', validateId, getTestimonialById);

// Protected routes (Admin only)
router.post('/', authenticateToken, requireRole(['ADMIN']), validateCreateTestimonial, createTestimonial);
router.put('/:id', authenticateToken, requireRole(['ADMIN']), validateId, updateTestimonial);
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), validateId, deleteTestimonial);

export default router;
