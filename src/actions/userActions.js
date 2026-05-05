// src/actions/userActions.js
"use server";

import { connectDB } from "@/lib/db";
import { MockTest } from "@/models/MockTest";
import { Question } from "@/models/Question";
import { TestAttempt } from "@/models/TestAttempt";
import { auth } from "@/auth";

// 1. Fetch available tests for the dashboard
export async function getAvailableTests() {
    await connectDB();
    const tests = await MockTest.find({ status: "PUBLISHED" })
        .populate("category", "shortName")
        .sort({ createdAt: -1 })
        .lean();

    return tests.map(t => ({ ...t, _id: t._id.toString(), categoryId: t.category?._id?.toString() }));
}

// 2. Fetch questions securely (NO ANSWERS SENT TO CLIENT)
export async function getLiveTestQuestions(testId) {
    await connectDB();

    // Notice we explicitly EXCLUDE correctOptionId and solutionExplanation
    const questions = await Question.find({ testId })
        .select("-correctOptionId -solutionExplanation")
        .lean();

    return questions.map(q => ({
        ...q,
        _id: q._id.toString(),
        testId: q.testId.toString(),
    }));
}

export async function getTestMetadata(testId) {
    await connectDB();
    const test = await MockTest.findById(testId).lean();
    return { ...test, _id: test._id.toString() };
}

// 3. Evaluate and grade the test
export async function submitTest(testId, userAnswers, startTime) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await connectDB();

    // Fetch the REAL questions with the correct answers from the DB
    const actualQuestions = await Question.find({ testId }).lean();
    const testInfo = await MockTest.findById(testId).lean();

    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;
    let totalScore = 0;

    const responseLog = actualQuestions.map((q) => {
        // Find what the user picked for this question
        const userAnswer = userAnswers[q._id.toString()];

        if (!userAnswer) {
            unattemptedCount++;
            return { questionId: q._id, selectedOptionId: null, isCorrect: false };
        }

        const isCorrect = userAnswer === q.correctOptionId;

        if (isCorrect) {
            correctCount++;
            totalScore += (q.marks || 1);
        } else {
            wrongCount++;
            totalScore -= testInfo.negativeMarking; // Apply negative marking securely on the server
        }

        return { questionId: q._id, selectedOptionId: userAnswer, isCorrect };
    });

    // Save the attempt to the database
    const attempt = await TestAttempt.create({
        userId: session.user.id,
        testId: testId,
        startTime: new Date(startTime),
        endTime: new Date(),
        score: totalScore,
        correctAnswersCount: correctCount,
        wrongAnswersCount: wrongCount,
        unattemptedCount: unattemptedCount,
        responses: responseLog
    });

    // Return the attempt ID so we can redirect them to their result page
    return attempt._id.toString();
}


export async function getTestResult(attemptId) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await connectDB();

    // Fetch the attempt and populate the test details and the actual questions
    const attempt = await TestAttempt.findById(attemptId)
        .populate("testId", "title totalMarks negativeMarking")
        .populate({
            path: "responses.questionId",
            select: "questionText options correctOptionId solutionExplanation marks"
        })
        .lean();

    if (!attempt) {
        throw new Error("Test result not found.");
    }

    // Security Verification: Only the owner (or an Admin) can view this result
    if (attempt.userId.toString() !== session.user.id && session.user.role !== "ADMIN") {
        throw new Error("You do not have permission to view this result.");
    }

    // Sanitize the Mongoose ObjectIds for Next.js Server Components
    return {
        ...attempt,
        _id: attempt._id.toString(),
        userId: attempt.userId.toString(),
        testId: {
            ...attempt.testId,
            _id: attempt.testId._id.toString(),
        },
        responses: attempt.responses.map(r => ({
            ...r,
            _id: r._id.toString(),
            questionId: r.questionId ? {
                ...r.questionId,
                _id: r.questionId._id.toString(),
            } : null
        }))
    };
}