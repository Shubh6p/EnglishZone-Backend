import mongoose, { Document, Schema } from 'mongoose';

export enum Role {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN',
  PARENT = 'PARENT',
  SUPERADMIN = 'SUPERADMIN'
}

export interface IUser extends Document {
  email: string;
  password?: string;
  fullName: string;
  phone?: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String }, // optional because OAuth or OTP might not require it
    fullName: { type: String, required: true },
    phone: { type: String },
    role: { 
      type: String, 
      enum: Object.values(Role), 
      default: Role.STUDENT 
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
