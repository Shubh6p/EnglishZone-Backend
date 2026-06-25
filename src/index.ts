import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import academicRoutes from './routes/academicRoutes';
import invoiceRoutes from './routes/invoiceRoutes';
import examRoutes from './routes/examRoutes';
import assignmentRoutes from './routes/assignmentRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import gradeRoutes from './routes/gradeRoutes';
import transitRoutes from './routes/transitRoutes';
import payrollRoutes from './routes/payrollRoutes';
import superadminRoutes from './routes/superadminRoutes';
import { connectDB } from './config/db';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/academics', academicRoutes);
app.use('/api/v1/invoices', invoiceRoutes);
app.use('/api/v1/exams', examRoutes);
app.use('/api/v1/assignments', assignmentRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/grades', gradeRoutes);
app.use('/api/v1/transit', transitRoutes);
app.use('/api/v1/payroll', payrollRoutes);
app.use('/api/v1/superadmin', superadminRoutes);

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
