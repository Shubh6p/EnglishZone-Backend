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
exports.createAssignment = exports.getAssignments = void 0;
const Assignment_1 = __importDefault(require("../models/Assignment"));
const getAssignments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { classId } = req.query;
        const filter = classId ? { classId: classId } : {};
        const assignments = yield Assignment_1.default.find(filter)
            .populate('classId', 'name grade section')
            .populate('teacherId', 'fullName email')
            .sort({ createdAt: -1 });
        res.status(200).json(assignments);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch assignments' });
    }
});
exports.getAssignments = getAssignments;
const createAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { title, classId, type, link } = req.body;
        const teacherId = req.user.userId; // Pulled from JWT
        // If a file was uploaded, construct the local URL for it
        if (req.file) {
            link = `/uploads/${req.file.filename}`;
        }
        const newAssignment = yield Assignment_1.default.create({
            title,
            classId,
            type,
            link,
            teacherId
        });
        res.status(201).json(newAssignment);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create assignment' });
    }
});
exports.createAssignment = createAssignment;
