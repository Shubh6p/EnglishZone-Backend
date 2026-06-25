import { Request, Response } from 'express';
import SystemLog from '../models/SystemLog';
import SystemConfig from '../models/SystemConfig';
import { AuthRequest } from '../middleware/authMiddleware';

export const getSystemLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const logs = await SystemLog.find()
      .populate('performedBy', 'fullName email role')
      .sort({ createdAt: -1 })
      .limit(100);
      
    res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch system logs' });
  }
};

export const getConfigs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const configs = await SystemConfig.find().populate('updatedBy', 'fullName');
    res.status(200).json(configs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch configs' });
  }
};

export const updateConfig = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { key, value, description } = req.body;
    const superadminId = req.user!.userId;
    
    let config = await SystemConfig.findOne({ key });
    
    if (config) {
      config.value = value;
      if (description) config.description = description;
      config.updatedBy = superadminId as any;
      await config.save();
    } else {
      config = await SystemConfig.create({
        key,
        value,
        description,
        updatedBy: superadminId
      });
    }

    // Log this action
    await SystemLog.create({
      action: 'UPDATE_SYSTEM_CONFIG',
      performedBy: superadminId,
      target: key,
      description: `Updated configuration for ${key}`
    });
    
    res.status(200).json(config);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update config' });
  }
};

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalLogs = await SystemLog.countDocuments();
    const configCount = await SystemConfig.countDocuments();
    
    res.status(200).json({
      totalLogs,
      configCount,
      systemStatus: 'ONLINE'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
