import { Router } from 'express';
import { getAllApplications, updateApplicationStatus } from '../controllers/adminController';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken, requireAdmin);

router.get('/applications', getAllApplications);
router.put('/applications/:id/status', updateApplicationStatus);

export default router;
