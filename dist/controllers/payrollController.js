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
exports.createPayroll = exports.getPayrolls = void 0;
const Payroll_1 = __importDefault(require("../models/Payroll"));
const getPayrolls = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teacherId, month, year } = req.query;
        const filter = {};
        if (teacherId)
            filter.teacherId = teacherId;
        if (month)
            filter.month = month;
        if (year)
            filter.year = Number(year);
        // If user is a teacher, only let them see their own payroll
        if (req.user.role === 'TEACHER') {
            filter.teacherId = req.user.userId;
        }
        const payrolls = yield Payroll_1.default.find(filter)
            .populate('teacherId', 'fullName email')
            .sort({ year: -1, month: -1 });
        res.status(200).json(payrolls);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch payroll data' });
    }
});
exports.getPayrolls = getPayrolls;
const createPayroll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teacherId, month, year, baseSalary, leaveDeductions, status } = req.body;
        const netSalary = baseSalary - (leaveDeductions || 0);
        const newPayroll = yield Payroll_1.default.create({
            teacherId,
            month,
            year,
            baseSalary,
            leaveDeductions,
            netSalary,
            status
        });
        res.status(201).json(newPayroll);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create payroll record' });
    }
});
exports.createPayroll = createPayroll;
