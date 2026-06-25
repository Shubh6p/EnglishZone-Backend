import { Request, Response } from 'express';
import Payroll from '../models/Payroll';
import { AuthRequest } from '../middleware/authMiddleware';

export const getPayrolls = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { teacherId, month, year } = req.query;
    
    const filter: any = {};
    if (teacherId) filter.teacherId = teacherId as string;
    if (month) filter.month = month as string;
    if (year) filter.year = Number(year);
    
    // If user is a teacher, only let them see their own payroll
    if (req.user!.role === 'TEACHER') {
      filter.teacherId = req.user!.userId;
    }
    
    const payrolls = await Payroll.find(filter)
      .populate('teacherId', 'fullName email')
      .sort({ year: -1, month: -1 });
      
    res.status(200).json(payrolls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch payroll data' });
  }
};

export const createPayroll = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { teacherId, month, year, baseSalary, leaveDeductions, status } = req.body;
    
    const netSalary = baseSalary - (leaveDeductions || 0);
    
    const newPayroll = await Payroll.create({
      teacherId,
      month,
      year,
      baseSalary,
      leaveDeductions,
      netSalary,
      status
    });
    
    res.status(201).json(newPayroll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create payroll record' });
  }
};
