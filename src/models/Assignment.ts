import mongoose, { Document, Schema } from 'mongoose';

export interface IAssignment extends Document {
  title: string;
  classId: mongoose.Types.ObjectId;
  type: string;
  link: string;
  teacherId: mongoose.Types.ObjectId;
}

const AssignmentSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    type: { type: String, required: true },
    link: { type: String, required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);
