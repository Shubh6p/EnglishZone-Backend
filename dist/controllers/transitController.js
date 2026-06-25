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
exports.createTransit = exports.getTransits = void 0;
const Transit_1 = __importDefault(require("../models/Transit"));
const getTransits = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transits = yield Transit_1.default.find().sort({ busNumber: 1 });
        res.status(200).json(transits);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch transit data' });
    }
});
exports.getTransits = getTransits;
const createTransit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { busNumber, driverName, driverPhone, route, capacity, occupancy, status } = req.body;
        const newTransit = yield Transit_1.default.create({
            busNumber,
            driverName,
            driverPhone,
            route,
            capacity,
            occupancy,
            status
        });
        res.status(201).json(newTransit);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create transit record' });
    }
});
exports.createTransit = createTransit;
