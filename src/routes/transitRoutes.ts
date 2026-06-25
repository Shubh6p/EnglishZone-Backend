import { Router } from 'express';
import { getTransits, createTransit } from '../controllers/transitController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.use(requireAuth);

router.get('/', getTransits);
router.post('/', createTransit);

export default router;
