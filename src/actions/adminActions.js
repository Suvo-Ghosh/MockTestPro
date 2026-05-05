// src/actions/adminActions.js
"use server";

import { connectDB } from "@/lib/db";
import { MockTest } from "@/models/MockTest";
import { Question } from "@/models/Question";
import { auth } from "@/auth";
import { z } from "zod"; // 1. Import Zod

// 2. Define the Zod Schema for a SINGLE question
// This strictly enforces the types and required fields
const optionSchema = z.object({
    id: z.string().min(1, "Option ID is required (e.g., A, B, C)"),
    text: z.string().min(1, "Option text cannot be empty"),
});

const questionSchema = z.object({
    questionText: z.string().min(5, "Question text must be at least 5 characters long"),
    options: z.array(optionSchema).min(2, "At least 2 options are required").max(6, "Maximum 6 options allowed"),
    correctOptionId: z.string().min(1, "Correct Option ID is required"),
    marks: z.number().optional().default(1),
    solutionExplanation: z.string().optional(),
});

// Define the schema for the ENTIRE array of questions
const questionsArraySchema = z.array(questionSchema).min(1, "You must upload at least one question.");

export async function createMockTest(prevState, formData) {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
        return { error: "Unauthorized access." };
    }

    await connectDB();

    try {
        const title = formData.get("title");
        const categoryId = formData.get("categoryId");
        const duration = formData.get("duration");
        const totalMarks = formData.get("totalMarks");
        const negativeMarking = formData.get("negativeMarking");
        const instructions = formData.get("instructions");
        const questionsString = formData.get("questionsJson");

        // 3. Step One: Parse the JSON string into a JavaScript Object
        let rawParsedQuestions;
        try {
            rawParsedQuestions = JSON.parse(questionsString);
        } catch (e) {
            return { error: "Invalid JSON format. Please check for missing commas or quotes." };
        }

        // 4. Step Two: Validate the object against our Zod Schema
        // safeParse doesn't throw an error; it returns a success boolean and the data or errors
        const validationResult = questionsArraySchema.safeParse(rawParsedQuestions);

        if (!validationResult.success) {
            // If validation fails, extract the first error message to show the admin
            // e.g., "Error at question 2, options: At least 2 options are required"
            const firstError = validationResult.error.errors[0];
            const errorPath = firstError.path.join(" -> ");
            return {
                error: `Validation Error in your JSON (${errorPath || 'root'}): ${firstError.message}`
            };
        }

        // If success is true, Zod gives us the perfectly typed and validated data
        const validatedQuestions = validationResult.data;

        // 5. Proceed with Database Insertion using the validated data
        const newTest = await MockTest.create({
            title,
            category: categoryId,
            durationInMinutes: Number(duration),
            totalMarks: Number(totalMarks),
            negativeMarking: Number(negativeMarking),
            instructions,
            totalQuestions: validatedQuestions.length,
            status: "PUBLISHED"
        });

        // Add the testId to the validated questions before inserting
        const questionsToInsert = validatedQuestions.map((q) => ({
            testId: newTest._id,
            questionText: q.questionText,
            options: q.options,
            correctOptionId: q.correctOptionId,
            marks: q.marks,
            solutionExplanation: q.solutionExplanation || ""
        }));

        await Question.insertMany(questionsToInsert);

        return { success: `Successfully created "${title}" and uploaded ${validatedQuestions.length} questions.` };

    } catch (error) {
        console.error("Test creation error:", error);
        return { error: "Failed to create the test. Please check server logs." };
    }
}