import mongoose, { Document, Schema } from 'mongoose';

export interface IStudentProfile extends Document {
  user: mongoose.Types.ObjectId;
  rollNo?: string;
  classId?: mongoose.Types.ObjectId;
  parentId?: mongoose.Types.ObjectId;
}

const StudentProfileSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    rollNo: { type: String },
    classId: { type: Schema.Types.ObjectId, ref: 'Class' },
    parentId: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export default mongoose.model<IStudentProfile>('StudentProfile', StudentProfileSchema);
