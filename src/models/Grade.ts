import mongoose, { Document, Schema } from 'mongoose';

export interface IGrade extends Document {
  studentId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  examName: string;
  subject: string;
  score: number;
}

const GradeSchema: Schema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    examName: { type: String, required: true },
    subject: { type: String, required: true },
    score: { type: Number, required: true, min: 0, max: 100 }
  },
  { timestamps: true }
);

// Prevent multiple grades for the same student, subject and exam
GradeSchema.index({ studentId: 1, examName: 1, subject: 1 }, { unique: true });

export default mongoose.model<IGrade>('Grade', GradeSchema);
