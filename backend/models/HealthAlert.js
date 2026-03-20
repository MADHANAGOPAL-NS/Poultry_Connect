import mongoose from 'mongoose';

const healthAlertSchema = new mongoose.Schema({
  predictionId: { type: mongoose.Schema.Types.ObjectId, ref: 'PredictionHistory' },
  healthStatus: { type: String, required: true },
  stressLevel: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('HealthAlert', healthAlertSchema);
