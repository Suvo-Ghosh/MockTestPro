import mongoose from 'mongoose';

const testAttemptSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'MockTest', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    score: { type: Number, default: 0 },
    correctAnswersCount: { type: Number, default: 0 },
    wrongAnswersCount: { type: Number, default: 0 },
    unattemptedCount: { type: Number, default: 0 },
    // Store the exact options the user picked so you can show a detailed report
    responses: [{
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        selectedOptionId: { type: String, default: null }, // null if unattempted
        isCorrect: { type: Boolean, default: false },
        timeSpentInSeconds: { type: Number, default: 0 } // Optional: For advanced analytics
    }]
}, { timestamps: true });

export const TestAttempt = mongoose.models.TestAttempt || mongoose.model('TestAttempt', testAttemptSchema); 