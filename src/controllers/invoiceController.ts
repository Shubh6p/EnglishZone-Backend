import { Request, Response } from 'express';
import Invoice, { InvoiceStatus } from '../models/Invoice';
import SystemLog from '../models/SystemLog';
import User from '../models/User';
import { sendEmail } from '../services/notificationService';
import { AuthRequest } from '../middleware/authMiddleware';

export const getAllInvoices = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { role, userId } = req.user!;
    
    let invoices;
    if (role === 'ADMIN' || role === 'SUPERADMIN') {
      // Admins see all invoices
      invoices = await Invoice.find()
        .populate('studentId', 'fullName email')
        .populate('classId', 'name grade section')
        .sort({ createdAt: -1 });
    } else {
      // Students only see their own invoices
      invoices = await Invoice.find({ studentId: userId })
        .populate('classId', 'name grade section')
        .sort({ createdAt: -1 });
    }
    
    res.status(200).json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
};

export const createInvoice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { studentId, classId, amount, description, dueDate } = req.body;
    
    const newInvoice = await Invoice.create({
      studentId,
      classId,
      amount,
      description,
      dueDate
    });
    
    res.status(201).json(newInvoice);

    if (req.user) {
      SystemLog.create({
        action: 'INVOICE_CREATED',
        performedBy: req.user.userId,
        target: newInvoice._id.toString(),
        description: `Created invoice for ${amount} due on ${dueDate}`
      }).catch(err => console.error('SystemLog err', err));
    }

    // Push Notifications for Invoices
    const student = await User.findById(studentId);
    if (student) {
      await sendEmail(
        student.email,
        'English Zone - New Fee Invoice',
        `Dear ${student.fullName},\n\nA new fee invoice of Rs. ${amount} has been generated. Due date: ${new Date(dueDate).toLocaleDateString()}.\nDesc: ${description}\n\nPlease login to your portal to make the payment.\n\nRegards,\nEnglish Zone Administration`
      );
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
};

export const markInvoicePaid = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const invoice = await Invoice.findByIdAndUpdate(
      id, 
      { status: InvoiceStatus.PAID }, 
      { new: true }
    );
    
    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }
    
    res.status(200).json({ message: 'Invoice marked as paid', invoice });

    if (req.user) {
      SystemLog.create({
        action: 'INVOICE_PAID',
        performedBy: req.user.userId,
        target: invoice._id.toString(),
        description: `Invoice ${invoice._id} marked as PAID`
      }).catch(err => console.error('SystemLog err', err));
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update invoice status' });
  }
};
