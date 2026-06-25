import mongoose, { Document, Schema } from 'mongoose';

export interface ITeacherProfile extends Document {
  user: mongoose.Types.ObjectId;
  employeeId: string;
  subjects: string[];
}

const TeacherProfileSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    employeeId: { type: String, required: true, unique: true },
    subjects: { type: [String], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model<ITeacherProfile>('TeacherProfile', TeacherProfileSchema);
