import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  // Additional fields for exam prep
  targetExams: [{ type: String }], 
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', userSchema);