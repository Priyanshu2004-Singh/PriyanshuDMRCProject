import { Router } from 'express';
import { getCivilMaterials, getArcMaterials, getElectricalMaterials } from '../controllers/materialController';

const router = Router();

router.get('/civil', getCivilMaterials);
router.get('/architecture', getArcMaterials);
router.get('/electrical', getElectricalMaterials);

export default router;
