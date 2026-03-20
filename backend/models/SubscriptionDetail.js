import mongoose from 'mongoose';

const subscriptionDetailSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  plan: { type: String, default: 'free' },
  status: { type: String, default: 'active' },
  amountPaid: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  paymentMethod: { type: String },
  paymentGateway: { type: String },
  transactionId: { type: String },
  receiptUrl: { type: String }
}, { timestamps: true });

export default mongoose.model('SubscriptionDetail', subscriptionDetailSchema);
