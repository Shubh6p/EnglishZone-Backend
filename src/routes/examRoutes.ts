import { Router } from 'express';
import { getExams, createExam } from '../controllers/examController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.use(requireAuth);

router.get('/', getExams);
router.post('/', createExam); // In a real app we might restrict to Teacher/Admin

export default router;
