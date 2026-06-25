"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const superadminController_1 = require("../controllers/superadminController");
const router = (0, express_1.Router)();
// Protect all superadmin routes
router.use(authMiddleware_1.requireAuth);
router.use(authMiddleware_1.requireSuperAdmin);
router.get('/logs', superadminController_1.getSystemLogs);
router.get('/configs', superadminController_1.getConfigs);
router.put('/configs', superadminController_1.updateConfig);
router.get('/stats', superadminController_1.getDashboardStats);
exports.default = router;
