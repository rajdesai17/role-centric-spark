import { Router } from 'express';
import {
  getDashboard,
  getRecentActivity,
  getUsers,
  createUser,
  getUserById,
  getStores,
  createStore,
} from '../controllers/adminController';
import {
  validateCreateUser,
  validateCreateStore,
  validateUUID,
  validateSearchQuery,
} from '../middleware/validation';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticateToken, requireAdmin);

router.get('/dashboard', getDashboard);
router.get('/recent-activity', getRecentActivity);
router.get('/users', validateSearchQuery, getUsers);
router.post('/users', validateCreateUser, createUser);
router.get('/users/:id', validateUUID, getUserById);
router.get('/stores', validateSearchQuery, getStores);
router.post('/stores', validateCreateStore, createStore);

export default router;