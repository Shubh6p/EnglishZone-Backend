import mongoose, { Document, Schema } from 'mongoose';

export interface IExam extends Document {
  title: string;
  classId: mongoose.Types.ObjectId;
  subject: string;
  date: Date;
  totalMarks: number;
}

const ExamSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    subject: { type: String, required: true },
    date: { type: Date, required: true },
    totalMarks: { type: Number, required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IExam>('Exam', ExamSchema);
