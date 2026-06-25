import { Router } from 'express';
import { getAllUsers, toggleUserStatus } from '../controllers/userController';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

// Protect all user routes with Admin privileges
router.use(requireAuth);
router.use(requireAdmin);

router.get('/', getAllUsers);
router.put('/:id/status', toggleUserStatus);

export default router;
