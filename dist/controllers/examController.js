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
exports.createExam = exports.getExams = void 0;
const Exam_1 = __importDefault(require("../models/Exam"));
const getExams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { classId } = req.query;
        const filter = {};
        if (classId) {
            filter.classId = classId;
        }
        const exams = yield Exam_1.default.find(filter)
            .populate('classId', 'name grade section')
            .sort({ date: 1 });
        res.status(200).json(exams);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch exams' });
    }
});
exports.getExams = getExams;
const createExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, classId, subject, date, totalMarks } = req.body;
        const newExam = yield Exam_1.default.create({
            title,
            classId,
            subject,
            date,
            totalMarks
        });
        res.status(201).json(newExam);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create exam' });
    }
});
exports.createExam = createExam;
