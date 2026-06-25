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
exports.submitAttendance = exports.getAttendanceByClass = void 0;
const Attendance_1 = __importDefault(require("../models/Attendance"));
const User_1 = __importDefault(require("../models/User"));
const notificationService_1 = require("../services/notificationService");
const getAttendanceByClass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { classId } = req.params;
        const { date } = req.query; // optional date filter
        const filter = { classId };
        if (date) {
            // Find for specific date
            const queryDate = new Date(date);
            const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));
            filter.date = { $gte: startOfDay, $lte: endOfDay };
        }
        const attendance = yield Attendance_1.default.find(filter)
            .populate('records.studentId', 'fullName email')
            .sort({ date: -1 });
        res.status(200).json(attendance);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch attendance' });
    }
});
exports.getAttendanceByClass = getAttendanceByClass;
const submitAttendance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { classId, date, records } = req.body;
        // Check if attendance already exists for this class on this date
        const attendanceDate = new Date(date);
        const startOfDay = new Date(attendanceDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(attendanceDate.setHours(23, 59, 59, 999));
        const existing = yield Attendance_1.default.findOne({
            classId,
            date: { $gte: startOfDay, $lte: endOfDay }
        });
        if (existing) {
            // Update existing record
            existing.records = records;
            yield existing.save();
            res.status(200).json(existing);
            return;
        }
        // Create new record
        const newAttendance = yield Attendance_1.default.create({
            classId,
            date: new Date(date),
            records
        });
        res.status(201).json(newAttendance);
        // Push Notifications for Absences
        for (const record of records) {
            if (record.status === 'Absent') {
                const student = yield User_1.default.findById(record.studentId);
                if (student) {
                    yield (0, notificationService_1.sendSMS)(student.phone || '+919876543210', `Dear Parent, ${student.fullName} has been marked absent today (${new Date(date).toLocaleDateString()}). Please contact the school office.`);
                }
            }
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to submit attendance' });
    }
});
exports.submitAttendance = submitAttendance;
