import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { Role } from '../models/User';
import StudentProfile from '../models/StudentProfile';
import TeacherProfile from '../models/TeacherProfile';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    if (user.role !== role) {
      res.status(401).json({ error: 'Invalid role for this user' });
      return;
    }

    if (!user.password) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as any });
    
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    
    res.status(200).json({ token, user: userWithoutPassword, message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, password, phone, dob, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'Email already in use' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password || 'password123', 10);
    const userRole = role as Role || Role.STUDENT;

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
      role: userRole
    });

    if (userRole === Role.STUDENT) {
      await StudentProfile.create({ user: newUser._id });
    } else if (userRole === Role.TEACHER) {
      await TeacherProfile.create({ user: newUser._id, employeeId: `TCH-${Date.now()}` });
    }

    res.status(201).json({ message: 'Signup successful, please verify OTP' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Signup failed' });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;
    
    if (otp && otp.length === 6) {
       const user = await User.findOne({ email });
       if (!user) {
         res.status(404).json({ error: 'User not found' });
         return;
       }
       const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as any });
       res.status(200).json({ token, message: 'OTP verified successfully' });
    } else {
       res.status(400).json({ error: 'Invalid OTP' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'OTP verification failed' });
  }
};
