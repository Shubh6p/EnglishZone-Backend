import mongoose, { Document, Schema } from 'mongoose';

export interface IPayroll extends Document {
  teacherId: mongoose.Types.ObjectId;
  month: string;
  year: number;
  baseSalary: number;
  leaveDeductions: number;
  netSalary: number;
  status: 'Paid' | 'Pending';
}

const PayrollSchema: Schema = new Schema(
  {
    teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    month: { type: String, required: true },
    year: { type: Number, required: true },
    baseSalary: { type: Number, required: true },
    leaveDeductions: { type: Number, required: true, default: 0 },
    netSalary: { type: Number, required: true },
    status: { type: String, enum: ['Paid', 'Pending'], default: 'Pending' }
  },
  { timestamps: true }
);

export default mongoose.model<IPayroll>('Payroll', PayrollSchema);
