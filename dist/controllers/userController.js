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
exports.toggleUserStatus = exports.getAllUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const SystemLog_1 = __importDefault(require("../models/SystemLog"));
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});
exports.getAllUsers = getAllUsers;
const toggleUserStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        const user = yield User_1.default.findByIdAndUpdate(id, { isActive }, { new: true }).select('-password');
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.status(200).json({ message: 'User status updated', user });
        // Background Logging
        if (req.user) {
            SystemLog_1.default.create({
                action: isActive ? 'USER_ACTIVATED' : 'USER_SUSPENDED',
                performedBy: req.user.userId,
                target: user._id.toString(),
                description: `User ${user.fullName} (${user.email}) was ${isActive ? 'activated' : 'suspended'}.`
            }).catch(err => console.error('Failed to write SystemLog', err));
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update user status' });
    }
});
exports.toggleUserStatus = toggleUserStatus;
