import { Router } from 'express';
import { getPayrolls, createPayroll } from '../controllers/payrollController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.use(requireAuth);

router.get('/', getPayrolls);
router.post('/', createPayroll);

export default router;
