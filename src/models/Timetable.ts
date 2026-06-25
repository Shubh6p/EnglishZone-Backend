import mongoose, { Document, Schema } from 'mongoose';

export interface ITimetable extends Document {
  classId: mongoose.Types.ObjectId;
  dayOfWeek: string; // e.g., "Monday"
  subject: string;
  teacherId: mongoose.Types.ObjectId;
  startTime: string; // e.g., "09:00 AM"
  endTime: string;
  room: string;
}

const TimetableSchema: Schema = new Schema(
  {
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    dayOfWeek: { type: String, required: true },
    subject: { type: String, required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: 'User' },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    room: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<ITimetable>('Timetable', TimetableSchema);
