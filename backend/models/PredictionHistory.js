import mongoose from 'mongoose';

const predictionHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  ammonia: { type: Number, required: true },
  co2: { type: Number, required: true },
  movement: { type: Number, required: true },
  sound: { type: Number, required: true },
  healthStatus: { type: String, required: true },
  stressLevel: { type: String, required: true },
  confidence: { type: Number, required: true },
  analysis: { type: String },
  recommendations: [{ type: String }],
}, { timestamps: true });

export default mongoose.model('PredictionHistory', predictionHistorySchema);
