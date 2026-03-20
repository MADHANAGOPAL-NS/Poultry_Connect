import mongoose from 'mongoose';

const measurementSchema = new mongoose.Schema({
  sensorType: { type: String, required: true },
  value: { type: Number, required: true },
  unit: { type: String, default: '' },
  recordedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Measurement', measurementSchema);
