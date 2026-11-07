import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    dueAt: { type: Date, required: true },
    endAt: { type: Date },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed'],
      default: 'in_progress',
    },
    sessionKey: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

taskSchema.index({ sessionKey: 1, dueAt: -1 });
taskSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Task', taskSchema);
