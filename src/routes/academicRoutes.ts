import { Router } from 'express';
import { getAllClasses, getClassTimetable, createClass } from '../controllers/academicController';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

router.use(requireAuth);

router.get('/classes', getAllClasses);
router.get('/classes/:classId/timetable', getClassTimetable);

// Admin only route
router.post('/classes', requireAdmin, createClass);

export default router;
