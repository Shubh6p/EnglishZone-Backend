import mongoose, { Document, Schema } from 'mongoose';

export interface ISystemLog extends Document {
  action: string;
  performedBy: mongoose.Types.ObjectId;
  target?: string;
  description: string;
  createdAt: Date;
}

const SystemLogSchema: Schema = new Schema(
  {
    action: { type: String, required: true },
    performedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    target: { type: String },
    description: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model<ISystemLog>('SystemLog', SystemLogSchema);
