"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const examController_1 = require("../controllers/examController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.requireAuth);
router.get('/', examController_1.getExams);
router.post('/', examController_1.createExam); // In a real app we might restrict to Teacher/Admin
exports.default = router;
