import mongoose, { Document, Schema } from 'mongoose';

export enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent',
  LATE = 'Late'
}

export interface IAttendanceRecord {
  studentId: mongoose.Types.ObjectId;
  status: AttendanceStatus;
}

export interface IAttendance extends Document {
  classId: mongoose.Types.ObjectId;
  date: Date;
  records: IAttendanceRecord[];
}

const AttendanceRecordSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: Object.values(AttendanceStatus), required: true }
});

const AttendanceSchema: Schema = new Schema(
  {
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    date: { type: Date, required: true },
    records: [AttendanceRecordSchema]
  },
  { timestamps: true }
);

// Prevent multiple attendance records for the same class on the same day
AttendanceSchema.index({ classId: 1, date: 1 }, { unique: true });

export default mongoose.model<IAttendance>('Attendance', AttendanceSchema);
