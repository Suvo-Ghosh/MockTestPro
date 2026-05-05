// src/app/(user)/test/[id]/LiveTestEngine.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { submitTest } from "@/actions/userActions";

export default function LiveTestEngine({ testInfo, questions }) {
    const router = useRouter();

    // State Management
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState({}); // { "questionId": "optionId" }
    const [timeLeft, setTimeLeft] = useState(testInfo.durationInMinutes * 60);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [startTime] = useState(new Date().toISOString()); // Record when they started

    const currentQuestion = questions[currentIdx];

    // The Countdown Timer
    useEffect(() => {
        if (timeLeft <= 0) {
            handleFinalSubmit(); // Auto-submit when time is up
            return;
        }
        const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    // Format time (e.g., 90:00)
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    // Handle Radio Button Selection
    const handleOptionSelect = (optionId) => {
        setAnswers((prev) => ({
            ...prev,
            [currentQuestion._id]: optionId,
        }));
    };

    // Handle Test Submission
    const handleFinalSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            // Call the Server Action
            const attemptId = await submitTest(testInfo._id, answers, startTime);

            // Send them to their detailed result page
            router.push(`/result/${attemptId}`);
        } catch (error) {
            console.error("Submission failed", error);
            alert("Failed to submit test. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col ">

            {/* Top Navigation Bar */}
            <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <div>
                    <h1 className="font-bold text-sm sm:text-lg text-gray-900">{testInfo.title}</h1>
                    <p className="text-xs sm:text-sm text-gray-500">Negative Marking: {testInfo.negativeMarking}</p>
                </div>

                {/* Sticky Timer */}
                <div className={`text-sm sm:text-xl font-mono font-bold px-2 sm:px-4 py-2 rounded-lg ${timeLeft < 300 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-800'}`}>
                    ⏱ {formatTime(timeLeft)}
                </div>
            </header>

            <main className="flex-grow max-w-4xl mx-auto w-full p-4 sm:p-6 flex flex-col">
                {/* Question Area */}
                <div className="bg-white p-3 sm:p-8 rounded-xl shadow-sm border border-gray-200 flex-grow">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">
                            Question {currentIdx + 1} of {questions.length}
                        </span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            Marks: +{currentQuestion.marks || 1}
                        </span>
                    </div>

                    <h2 className="text-sm sm:text-xl text-gray-900 font-medium mb-4 sm:mb-8">
                        {currentQuestion.questionText}
                    </h2>

                    <div className="space-y-3">
                        {currentQuestion.options.map((option) => (
                            <label
                                key={option.id}
                                className={`flex items-center p-2 sm:p-4 border rounded-lg cursor-pointer transition-colors ${answers[currentQuestion._id] === option.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name={`question-${currentQuestion._id}`}
                                    value={option.id}
                                    checked={answers[currentQuestion._id] === option.id}
                                    onChange={() => handleOptionSelect(option.id)}
                                    className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-3 text-sm text-gray-700">
                                    <span className="font-bold mr-2">{option.id}.</span>
                                    {option.text}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Bottom Controls */}
                <div className="mt-6 flex justify-between items-center">
                    <button
                        onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                        disabled={currentIdx === 0}
                        className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                        ← Previous
                    </button>

                    {currentIdx < questions.length - 1 ? (
                        <button
                            onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                            className="px-4 sm:px-8 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                        >
                            Next →
                        </button>
                    ) : (
                        <button
                            onClick={handleFinalSubmit}
                            disabled={isSubmitting}
                            className="px-4 sm:px-8 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-md transition-transform active:scale-95 disabled:opacity-50"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Final Test"}
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
}