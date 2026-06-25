import mongoose, { Document, Schema } from 'mongoose';

export interface ITransit extends Document {
  busNumber: string;
  driverName: string;
  driverPhone: string;
  route: string;
  capacity: number;
  occupancy: number;
  status: 'Active' | 'Maintenance' | 'Off-Duty';
}

const TransitSchema: Schema = new Schema(
  {
    busNumber: { type: String, required: true, unique: true },
    driverName: { type: String, required: true },
    driverPhone: { type: String, required: true },
    route: { type: String, required: true },
    capacity: { type: Number, required: true, default: 40 },
    occupancy: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ['Active', 'Maintenance', 'Off-Duty'], default: 'Active' }
  },
  { timestamps: true }
);

export default mongoose.model<ITransit>('Transit', TransitSchema);
