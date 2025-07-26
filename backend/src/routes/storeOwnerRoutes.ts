import { Router } from 'express';
import { getDashboard, getRatings } from '../controllers/storeOwnerController';
import { authenticateToken, requireStoreOwner } from '../middleware/auth';

const router = Router();

// All store owner routes require authentication and store owner role
router.use(authenticateToken, requireStoreOwner);

router.get('/dashboard', getDashboard);
router.get('/ratings', getRatings);

export default router;