import { Router } from 'express';
import { listApplications, getApplicationById, saveApplication } from '../controllers/applicationController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', listApplications);
router.get('/:id', getApplicationById);
router.post('/save', saveApplication);

export default router;
