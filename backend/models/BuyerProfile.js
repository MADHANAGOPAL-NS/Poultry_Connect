import mongoose from 'mongoose';

const buyerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  fullName: { type: String, required: true },
  phone: { type: String },
  location: { type: String },
  businessName: { type: String },
  preferredProducts: { type: String }
}, { timestamps: true });

export default mongoose.model('BuyerProfile', buyerProfileSchema);
