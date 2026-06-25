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
exports.getDashboardStats = exports.updateConfig = exports.getConfigs = exports.getSystemLogs = void 0;
const SystemLog_1 = __importDefault(require("../models/SystemLog"));
const SystemConfig_1 = __importDefault(require("../models/SystemConfig"));
const getSystemLogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const logs = yield SystemLog_1.default.find()
            .populate('performedBy', 'fullName email role')
            .sort({ createdAt: -1 })
            .limit(100);
        res.status(200).json(logs);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch system logs' });
    }
});
exports.getSystemLogs = getSystemLogs;
const getConfigs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const configs = yield SystemConfig_1.default.find().populate('updatedBy', 'fullName');
        res.status(200).json(configs);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch configs' });
    }
});
exports.getConfigs = getConfigs;
const updateConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { key, value, description } = req.body;
        const superadminId = req.user.userId;
        let config = yield SystemConfig_1.default.findOne({ key });
        if (config) {
            config.value = value;
            if (description)
                config.description = description;
            config.updatedBy = superadminId;
            yield config.save();
        }
        else {
            config = yield SystemConfig_1.default.create({
                key,
                value,
                description,
                updatedBy: superadminId
            });
        }
        // Log this action
        yield SystemLog_1.default.create({
            action: 'UPDATE_SYSTEM_CONFIG',
            performedBy: superadminId,
            target: key,
            description: `Updated configuration for ${key}`
        });
        res.status(200).json(config);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update config' });
    }
});
exports.updateConfig = updateConfig;
const getDashboardStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalLogs = yield SystemLog_1.default.countDocuments();
        const configCount = yield SystemConfig_1.default.countDocuments();
        res.status(200).json({
            totalLogs,
            configCount,
            systemStatus: 'ONLINE'
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});
exports.getDashboardStats = getDashboardStats;
