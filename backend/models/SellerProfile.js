import mongoose from 'mongoose';

const sellerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  fullName: { type: String, required: true },
  phone: { type: String },
  farmName: { type: String },
  farmLocation: { type: String },
  farmSize: { type: String },
  poultryTypes: { type: String },
  experienceYears: { type: Number }
}, { timestamps: true });

export default mongoose.model('SellerProfile', sellerProfileSchema);
