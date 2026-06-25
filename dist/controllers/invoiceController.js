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
exports.markInvoicePaid = exports.createInvoice = exports.getAllInvoices = void 0;
const Invoice_1 = __importStar(require("../models/Invoice"));
const SystemLog_1 = __importDefault(require("../models/SystemLog"));
const User_1 = __importDefault(require("../models/User"));
const notificationService_1 = require("../services/notificationService");
const getAllInvoices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role, userId } = req.user;
        let invoices;
        if (role === 'ADMIN' || role === 'SUPERADMIN') {
            // Admins see all invoices
            invoices = yield Invoice_1.default.find()
                .populate('studentId', 'fullName email')
                .populate('classId', 'name grade section')
                .sort({ createdAt: -1 });
        }
        else {
            // Students only see their own invoices
            invoices = yield Invoice_1.default.find({ studentId: userId })
                .populate('classId', 'name grade section')
                .sort({ createdAt: -1 });
        }
        res.status(200).json(invoices);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch invoices' });
    }
});
exports.getAllInvoices = getAllInvoices;
const createInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studentId, classId, amount, description, dueDate } = req.body;
        const newInvoice = yield Invoice_1.default.create({
            studentId,
            classId,
            amount,
            description,
            dueDate
        });
        res.status(201).json(newInvoice);
        if (req.user) {
            SystemLog_1.default.create({
                action: 'INVOICE_CREATED',
                performedBy: req.user.userId,
                target: newInvoice._id.toString(),
                description: `Created invoice for ${amount} due on ${dueDate}`
            }).catch(err => console.error('SystemLog err', err));
        }
        // Push Notifications for Invoices
        const student = yield User_1.default.findById(studentId);
        if (student) {
            yield (0, notificationService_1.sendEmail)(student.email, 'English Zone - New Fee Invoice', `Dear ${student.fullName},\n\nA new fee invoice of Rs. ${amount} has been generated. Due date: ${new Date(dueDate).toLocaleDateString()}.\nDesc: ${description}\n\nPlease login to your portal to make the payment.\n\nRegards,\nEnglish Zone Administration`);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create invoice' });
    }
});
exports.createInvoice = createInvoice;
const markInvoicePaid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const invoice = yield Invoice_1.default.findByIdAndUpdate(id, { status: Invoice_1.InvoiceStatus.PAID }, { new: true });
        if (!invoice) {
            res.status(404).json({ error: 'Invoice not found' });
            return;
        }
        res.status(200).json({ message: 'Invoice marked as paid', invoice });
        if (req.user) {
            SystemLog_1.default.create({
                action: 'INVOICE_PAID',
                performedBy: req.user.userId,
                target: invoice._id.toString(),
                description: `Invoice ${invoice._id} marked as PAID`
            }).catch(err => console.error('SystemLog err', err));
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update invoice status' });
    }
});
exports.markInvoicePaid = markInvoicePaid;
