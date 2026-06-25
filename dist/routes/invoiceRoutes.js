"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const invoiceController_1 = require("../controllers/invoiceController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// All invoice routes require authentication
router.use(authMiddleware_1.requireAuth);
router.get('/', invoiceController_1.getAllInvoices);
// Admin only routes
router.post('/', authMiddleware_1.requireAdmin, invoiceController_1.createInvoice);
router.put('/:id/pay', authMiddleware_1.requireAdmin, invoiceController_1.markInvoicePaid);
exports.default = router;
