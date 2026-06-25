"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkUpsertGrades = exports.getGrades = void 0;
const Grade_1 = __importDefault(require("../models/Grade"));
const getGrades = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { classId, subject, examName, studentId } = req.query;
        const filter = {};
        if (classId)
            filter.classId = classId;
        if (subject)
            filter.subject = subject;
        if (examName)
            filter.examName = examName;
        if (studentId)
            filter.studentId = studentId;
        // If user is a student, only let them see their own grades
        if (req.user.role === 'STUDENT') {
            filter.studentId = req.user.userId;
        }
        const grades = yield Grade_1.default.find(filter)
            .populate('studentId', 'fullName email')
            .populate('classId', 'name grade section')
            .sort({ createdAt: -1 });
        res.status(200).json(grades);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch grades' });
    }
});
exports.getGrades = getGrades;
const bulkUpsertGrades = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { classId, subject, examName, grades } = req.body;
        if (!grades || !Array.isArray(grades)) {
            res.status(400).json({ error: 'Invalid grades array' });
            return;
        }
        const bulkOps = grades.map((g) => ({
            updateOne: {
                filter: { studentId: g.studentId, classId, subject, examName },
                update: { $set: { score: g.score } },
                upsert: true
            }
        }));
        if (bulkOps.length > 0) {
            yield Grade_1.default.bulkWrite(bulkOps);
        }
        res.status(200).json({ message: 'Grades successfully updated' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to upsert grades' });
    }
});
exports.bulkUpsertGrades = bulkUpsertGrades;
