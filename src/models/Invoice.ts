import mongoose, { Document, Schema } from 'mongoose';

export enum InvoiceStatus {
  PAID = 'Paid',
  PENDING = 'Pending',
  OVERDUE = 'Overdue'
}

export interface IInvoice extends Document {
  studentId?: mongoose.Types.ObjectId;
  classId?: mongoose.Types.ObjectId;
  amount: number;
  description: string;
  dueDate: Date;
  status: InvoiceStatus;
}

const InvoiceSchema: Schema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User' },
    classId: { type: Schema.Types.ObjectId, ref: 'Class' },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    status: { 
      type: String, 
      enum: Object.values(InvoiceStatus), 
      default: InvoiceStatus.PENDING 
    }
  },
  { timestamps: true }
);

export default mongoose.model<IInvoice>('Invoice', InvoiceSchema);
