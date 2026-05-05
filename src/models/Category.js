import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., 'Staff Selection Commission (SSC)'
    shortName: { type: String, required: true }, // e.g., 'SSC'
    description: { type: String },
}, { timestamps: true });

export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);