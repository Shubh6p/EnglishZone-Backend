import { Request, Response } from 'express';
import User from '../models/User';
import SystemLog from '../models/SystemLog';
import { AuthRequest } from '../middleware/authMiddleware';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const toggleUserStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(id, { isActive }, { new: true }).select('-password');
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ message: 'User status updated', user });

    // Background Logging
    if (req.user) {
      SystemLog.create({
        action: isActive ? 'USER_ACTIVATED' : 'USER_SUSPENDED',
        performedBy: req.user.userId,
        target: user._id.toString(),
        description: `User ${user.fullName} (${user.email}) was ${isActive ? 'activated' : 'suspended'}.`
      }).catch(err => console.error('Failed to write SystemLog', err));
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
};
