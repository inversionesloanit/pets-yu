import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth';
import { createMovement, listMovements } from '../controllers/inventoryController';

const router = Router();

// Admin only
router.use(authenticateToken, requireRole(['ADMIN']));

router.get('/movements', listMovements);
router.post('/movements', createMovement);

export default router;


