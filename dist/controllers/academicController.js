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
exports.createClass = exports.getClassTimetable = exports.getAllClasses = void 0;
const Class_1 = __importDefault(require("../models/Class"));
const Timetable_1 = __importDefault(require("../models/Timetable"));
const getAllClasses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classes = yield Class_1.default.find().populate('classTeacher', 'fullName email').sort({ grade: 1, section: 1 });
        res.status(200).json(classes);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch classes' });
    }
});
exports.getAllClasses = getAllClasses;
const getClassTimetable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { classId } = req.params;
        const timetable = yield Timetable_1.default.find({ classId }).populate('teacherId', 'fullName email').sort({ startTime: 1 });
        res.status(200).json(timetable);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch timetable' });
    }
});
exports.getClassTimetable = getClassTimetable;
const createClass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, grade, section, classTeacher } = req.body;
        const newClass = yield Class_1.default.create({ name, grade, section, classTeacher });
        res.status(201).json(newClass);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create class' });
    }
});
exports.createClass = createClass;
