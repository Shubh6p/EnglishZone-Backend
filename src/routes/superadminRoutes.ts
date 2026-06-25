import { Router } from 'express';
import { requireAuth, requireSuperAdmin } from '../middleware/authMiddleware';
import { getSystemLogs, getConfigs, updateConfig, getDashboardStats } from '../controllers/superadminController';

const router = Router();

// Protect all superadmin routes
router.use(requireAuth);
router.use(requireSuperAdmin);

router.get('/logs', getSystemLogs);
router.get('/configs', getConfigs);
router.put('/configs', updateConfig);
router.get('/stats', getDashboardStats);

export default router;
