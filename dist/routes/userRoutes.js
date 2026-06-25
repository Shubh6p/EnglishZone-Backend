"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Protect all user routes with Admin privileges
router.use(authMiddleware_1.requireAuth);
router.use(authMiddleware_1.requireAdmin);
router.get('/', userController_1.getAllUsers);
router.put('/:id/status', userController_1.toggleUserStatus);
exports.default = router;
