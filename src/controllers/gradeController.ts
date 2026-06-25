import { Request, Response } from 'express';
import Grade from '../models/Grade';
import { AuthRequest } from '../middleware/authMiddleware';

export const getGrades = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { classId, subject, examName, studentId } = req.query;
    
    const filter: any = {};
    if (classId) filter.classId = classId as string;
    if (subject) filter.subject = subject as string;
    if (examName) filter.examName = examName as string;
    if (studentId) filter.studentId = studentId as string;
    
    // If user is a student, only let them see their own grades
    if (req.user!.role === 'STUDENT') {
      filter.studentId = req.user!.userId;
    }
    
    const grades = await Grade.find(filter)
      .populate('studentId', 'fullName email')
      .populate('classId', 'name grade section')
      .sort({ createdAt: -1 });
      
    res.status(200).json(grades);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch grades' });
  }
};

export const bulkUpsertGrades = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { classId, subject, examName, grades } = req.body;
    
    if (!grades || !Array.isArray(grades)) {
      res.status(400).json({ error: 'Invalid grades array' });
      return;
    }
    
    const bulkOps = grades.map((g: { studentId: string; score: number }) => ({
      updateOne: {
        filter: { studentId: g.studentId, classId, subject, examName },
        update: { $set: { score: g.score } },
        upsert: true
      }
    }));
    
    if (bulkOps.length > 0) {
      await Grade.bulkWrite(bulkOps);
    }
    
    res.status(200).json({ message: 'Grades successfully updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upsert grades' });
  }
};
