import { Router } from 'express';
import { login, register, changePassword } from '../controllers/authController';
import { validateLogin, validateRegister, validateChangePassword } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/login', validateLogin, login);
router.post('/register', validateRegister, register);
router.put('/change-password', authenticateToken, validateChangePassword, changePassword);

export default router;