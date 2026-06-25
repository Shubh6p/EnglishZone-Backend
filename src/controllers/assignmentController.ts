import { Request, Response } from 'express';
import Assignment from '../models/Assignment';
import { AuthRequest } from '../middleware/authMiddleware';

export const getAssignments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { classId } = req.query;
    const filter: any = classId ? { classId: classId as string } : {};
    
    const assignments = await Assignment.find(filter)
      .populate('classId', 'name grade section')
      .populate('teacherId', 'fullName email')
      .sort({ createdAt: -1 });
      
    res.status(200).json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
};

export const createAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let { title, classId, type, link } = req.body;
    const teacherId = req.user!.userId; // Pulled from JWT
    
    // If a file was uploaded, construct the local URL for it
    if (req.file) {
      link = `/uploads/${req.file.filename}`;
    }
    
    const newAssignment = await Assignment.create({
      title,
      classId,
      type,
      link,
      teacherId
    });
    
    res.status(201).json(newAssignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
};
