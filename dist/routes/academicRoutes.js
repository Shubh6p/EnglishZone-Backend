"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const academicController_1 = require("../controllers/academicController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.requireAuth);
router.get('/classes', academicController_1.getAllClasses);
router.get('/classes/:classId/timetable', academicController_1.getClassTimetable);
// Admin only route
router.post('/classes', authMiddleware_1.requireAdmin, academicController_1.createClass);
exports.default = router;
