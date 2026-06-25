import { Request, Response } from 'express';
import Transit from '../models/Transit';
import { AuthRequest } from '../middleware/authMiddleware';

export const getTransits = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const transits = await Transit.find().sort({ busNumber: 1 });
    res.status(200).json(transits);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch transit data' });
  }
};

export const createTransit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { busNumber, driverName, driverPhone, route, capacity, occupancy, status } = req.body;
    
    const newTransit = await Transit.create({
      busNumber,
      driverName,
      driverPhone,
      route,
      capacity,
      occupancy,
      status
    });
    
    res.status(201).json(newTransit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create transit record' });
  }
};
