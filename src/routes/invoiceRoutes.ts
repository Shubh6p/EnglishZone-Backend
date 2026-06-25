import { Router } from 'express';
import { getAllInvoices, createInvoice, markInvoicePaid } from '../controllers/invoiceController';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

// All invoice routes require authentication
router.use(requireAuth);

router.get('/', getAllInvoices);

// Admin only routes
router.post('/', requireAdmin, createInvoice);
router.put('/:id/pay', requireAdmin, markInvoicePaid);

export default router;
