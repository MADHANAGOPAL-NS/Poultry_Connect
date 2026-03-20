import mongoose from 'mongoose';

const userRoleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  role: { type: String, enum: ['buyer', 'seller'], required: true },
}, { timestamps: true });

export default mongoose.model('UserRole', userRoleSchema);
