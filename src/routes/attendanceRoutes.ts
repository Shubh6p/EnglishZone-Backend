import { Router } from 'express';
import { getAttendanceByClass, submitAttendance } from '../controllers/attendanceController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.use(requireAuth);

router.get('/:classId', getAttendanceByClass);
router.post('/', submitAttendance);

export default router;
