import { Request, Response } from 'express';
import Class from '../models/Class';
import Timetable from '../models/Timetable';

export const getAllClasses = async (req: Request, res: Response): Promise<void> => {
  try {
    const classes = await Class.find().populate('classTeacher', 'fullName email').sort({ grade: 1, section: 1 });
    res.status(200).json(classes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
};

export const getClassTimetable = async (req: Request, res: Response): Promise<void> => {
  try {
    const { classId } = req.params;
    const timetable = await Timetable.find({ classId }).populate('teacherId', 'fullName email').sort({ startTime: 1 });
    res.status(200).json(timetable);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch timetable' });
  }
};

export const createClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, grade, section, classTeacher } = req.body;
    const newClass = await Class.create({ name, grade, section, classTeacher });
    res.status(201).json(newClass);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create class' });
  }
};
