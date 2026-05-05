import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'MockTest', required: true },
    questionText: { type: String, required: true },
    // For government exams, images in questions/options are common
    imageUrl: { type: String, default: null },
    options: [{
        id: { type: String, required: true }, // e.g., 'A', 'B', 'C', 'D'
        text: { type: String, required: true }
    }],
    correctOptionId: { type: String, required: true }, // Matches one of the option IDs
    marks: { type: Number, default: 1 },
    solutionExplanation: { type: String } // Crucial for post-test analysis
});

// Indexing for fast retrieval during the live test
questionSchema.index({ testId: 1 });

export const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);