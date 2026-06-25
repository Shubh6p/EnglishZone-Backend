"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const academicRoutes_1 = __importDefault(require("./routes/academicRoutes"));
const invoiceRoutes_1 = __importDefault(require("./routes/invoiceRoutes"));
const examRoutes_1 = __importDefault(require("./routes/examRoutes"));
const assignmentRoutes_1 = __importDefault(require("./routes/assignmentRoutes"));
const attendanceRoutes_1 = __importDefault(require("./routes/attendanceRoutes"));
const gradeRoutes_1 = __importDefault(require("./routes/gradeRoutes"));
const transitRoutes_1 = __importDefault(require("./routes/transitRoutes"));
const payrollRoutes_1 = __importDefault(require("./routes/payrollRoutes"));
const superadminRoutes_1 = __importDefault(require("./routes/superadminRoutes"));
const db_1 = require("./config/db");
dotenv_1.default.config();
// Connect to MongoDB
(0, db_1.connectDB)();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Routes
app.use('/api/v1/auth', authRoutes_1.default);
app.use('/api/v1/users', userRoutes_1.default);
app.use('/api/v1/academics', academicRoutes_1.default);
app.use('/api/v1/invoices', invoiceRoutes_1.default);
app.use('/api/v1/exams', examRoutes_1.default);
app.use('/api/v1/assignments', assignmentRoutes_1.default);
app.use('/api/v1/attendance', attendanceRoutes_1.default);
app.use('/api/v1/grades', gradeRoutes_1.default);
app.use('/api/v1/transit', transitRoutes_1.default);
app.use('/api/v1/payroll', payrollRoutes_1.default);
app.use('/api/v1/superadmin', superadminRoutes_1.default);
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'English Zone SMS API is running.' });
});
// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found.' });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
