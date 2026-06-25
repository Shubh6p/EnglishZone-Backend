import { Request, Response } from 'express';
import Attendance from '../models/Attendance';
import User from '../models/User';
import { sendSMS } from '../services/notificationService';
import { AuthRequest } from '../middleware/authMiddleware';

export const getAttendanceByClass = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { classId } = req.params;
    const { date } = req.query; // optional date filter
    
    const filter: any = { classId };
    if (date) {
      // Find for specific date
      const queryDate = new Date(date as string);
      const startOfDay = new Date(queryDate.setHours(0,0,0,0));
      const endOfDay = new Date(queryDate.setHours(23,59,59,999));
      filter.date = { $gte: startOfDay, $lte: endOfDay };
    }
    
    const attendance = await Attendance.find(filter)
      .populate('records.studentId', 'fullName email')
      .sort({ date: -1 });
      
    res.status(200).json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
};

export const submitAttendance = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { classId, date, records } = req.body;
    
    // Check if attendance already exists for this class on this date
    const attendanceDate = new Date(date);
    const startOfDay = new Date(attendanceDate.setHours(0,0,0,0));
    const endOfDay = new Date(attendanceDate.setHours(23,59,59,999));
    
    const existing = await Attendance.findOne({
      classId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });
    
    if (existing) {
      // Update existing record
      existing.records = records;
      await existing.save();
      res.status(200).json(existing);
      return;
    }
    
    // Create new record
    const newAttendance = await Attendance.create({
      classId,
      date: new Date(date),
      records
    });
    
    res.status(201).json(newAttendance);

    // Push Notifications for Absences
    for (const record of records) {
      if (record.status === 'Absent') {
        const student = await User.findById(record.studentId);
        if (student) {
          await sendSMS(
            student.phone || '+919876543210', 
            `Dear Parent, ${student.fullName} has been marked absent today (${new Date(date).toLocaleDateString()}). Please contact the school office.`
          );
        }
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit attendance' });
  }
};
