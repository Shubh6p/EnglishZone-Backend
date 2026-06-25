import { Request, Response } from 'express';
import Exam from '../models/Exam';
import { AuthRequest } from '../middleware/authMiddleware';

export const getExams = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { classId } = req.query;
    const filter: Record<string, any> = {};
    if (classId) {
      filter.classId = classId;
    }
    
    const exams = await Exam.find(filter)
      .populate('classId', 'name grade section')
      .sort({ date: 1 });
      
    res.status(200).json(exams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch exams' });
  }
};

export const createExam = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, classId, subject, date, totalMarks } = req.body;
    
    const newExam = await Exam.create({
      title,
      classId,
      subject,
      date,
      totalMarks
    });
    
    res.status(201).json(newExam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create exam' });
  }
};
