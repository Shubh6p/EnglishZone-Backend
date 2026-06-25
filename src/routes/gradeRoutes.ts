import { Router } from 'express';
import { getGrades, bulkUpsertGrades } from '../controllers/gradeController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.use(requireAuth);

router.get('/', getGrades);
router.post('/bulk', bulkUpsertGrades);

export default router;
