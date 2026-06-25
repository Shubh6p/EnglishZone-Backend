"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.verifyOtp = exports.signup = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importStar(require("../models/User"));
const StudentProfile_1 = __importDefault(require("../models/StudentProfile"));
const TeacherProfile_1 = __importDefault(require("../models/TeacherProfile"));
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, role } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        if (user.role !== role) {
            res.status(401).json({ error: 'Invalid role for this user' });
            return;
        }
        if (!user.password) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: (process.env.JWT_EXPIRES_IN || '1h') });
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        res.status(200).json({ token, user: userWithoutPassword, message: 'Login successful' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
});
exports.login = login;
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, password, phone, dob, role } = req.body;
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: 'Email already in use' });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password || 'password123', 10);
        const userRole = role || User_1.Role.STUDENT;
        const newUser = yield User_1.default.create({
            fullName,
            email,
            password: hashedPassword,
            phone,
            role: userRole
        });
        if (userRole === User_1.Role.STUDENT) {
            yield StudentProfile_1.default.create({ user: newUser._id });
        }
        else if (userRole === User_1.Role.TEACHER) {
            yield TeacherProfile_1.default.create({ user: newUser._id, employeeId: `TCH-${Date.now()}` });
        }
        res.status(201).json({ message: 'Signup successful, please verify OTP' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Signup failed' });
    }
});
exports.signup = signup;
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        if (otp && otp.length === 6) {
            const user = yield User_1.default.findOne({ email });
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: (process.env.JWT_EXPIRES_IN || '1h') });
            res.status(200).json({ token, message: 'OTP verified successfully' });
        }
        else {
            res.status(400).json({ error: 'Invalid OTP' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'OTP verification failed' });
    }
});
exports.verifyOtp = verifyOtp;
