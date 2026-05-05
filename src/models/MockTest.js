import mongoose from 'mongoose';

const mockTestSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    totalMarks: { type: Number, required: true },
    durationInMinutes: { type: Number, required: true },
    negativeMarking: { type: Number, default: 0 }, // e.g., 0.25 or 0.33
    instructions: { type: String },
    status: { type: String, enum: ['DRAFT', 'PUBLISHED'], default: 'DRAFT' },
    totalQuestions: { type: Number, default: 0 } // Updated automatically when JSON is uploaded
}, { timestamps: true });

export const MockTest = mongoose.models.MockTest || mongoose.model('MockTest', mockTestSchema);