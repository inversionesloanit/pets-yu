import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cartController';
import { authenticateToken } from '../middleware/auth';
import { validateAddToCart, validateId } from '../middleware/validation';

const router = Router();

// All cart routes require authentication
router.use(authenticateToken);

router.get('/', getCart);
router.post('/add', validateAddToCart, addToCart);
router.put('/:id', validateId, updateCartItem);
router.delete('/:id', validateId, removeFromCart);
router.delete('/', clearCart);

export default router;
