import mongoose, { Document, Schema } from 'mongoose';

export interface IClass extends Document {
  name: string; // e.g. "Grade 10-A"
  grade: string;
  section: string;
  classTeacher: mongoose.Types.ObjectId;
  students: mongoose.Types.ObjectId[];
}

const ClassSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    grade: { type: String, required: true },
    section: { type: String, required: true },
    classTeacher: { type: Schema.Types.ObjectId, ref: 'User' },
    students: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

export default mongoose.model<IClass>('Class', ClassSchema);
