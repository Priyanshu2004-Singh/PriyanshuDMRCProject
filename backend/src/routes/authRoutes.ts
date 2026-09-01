import { Router } from 'express';
import { getCaptcha, register, login, getMe } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/captcha', getCaptcha);
router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);

export default router;
