// src/app/(user)/result/[id]/page.js
import { getTestResult } from "@/actions/userActions";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ResultPage({ params }) {
    const { id } = await params;

    let result;
    try {
        result = await getTestResult(id);
    } catch (error) {
        console.error(error);
        notFound(); // Redirects to a 404 page if unauthorized or invalid ID
    }

    const { testId: test, correctAnswersCount, wrongAnswersCount, unattemptedCount, score, responses } = result;

    const totalQuestions = correctAnswersCount + wrongAnswersCount + unattemptedCount;
    const accuracy = correctAnswersCount + wrongAnswersCount > 0
        ? Math.round((correctAnswersCount / (correctAnswersCount + wrongAnswersCount)) * 100)
        : 0;

    return (
        <div className="max-w-350 mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">

            {/* Header */}
            <div className="flex justify-between items-center mb-4 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-black">Performance Report</h1>
                <Link href="/dashboard" className="text-sm ml-auto sm:text-base text-blue-600 hover:underline font-medium">
                    &larr; Back to Dashboard
                </Link>
            </div>

            {/* Top Stats Cards */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-8 mb-4 sm:mb-8">
                <div className="text-center mb-3 sm:mb-6">
                    <h2 className="text-sm sm:text-xl text-gray-500 font-medium">{test.title}</h2>
                    <div className="text-4xl sm:text-6xl font-extrabold text-blue-600 mt-2">
                        {score.toFixed(2)} <span className="text-xl sm:text-2xl text-gray-400 font-medium">/ {test.totalMarks}</span>
                    </div>
                    <p className="text-gray-500 mt-2">Final Score</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-100">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-700 font-bold uppercase">Correct</p>
                        <p className="text-2xl font-black text-green-600">{correctAnswersCount}</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                        <p className="text-sm text-red-700 font-bold uppercase">Incorrect</p>
                        <p className="text-2xl font-black text-red-600">{wrongAnswersCount}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 font-bold uppercase">Skipped</p>
                        <p className="text-2xl font-black text-gray-700">{unattemptedCount}</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700 font-bold uppercase">Accuracy</p>
                        <p className="text-2xl font-black text-blue-600">{accuracy}%</p>
                    </div>
                </div>
            </div>

            {/* Detailed Analysis Section */}
            <h3 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-6">Detailed Analysis</h3>

            <div className="space-y-6">
                {responses.map((response, index) => {
                    const question = response.questionId;
                    if (!question) return null; // Fallback in case a question was deleted from the DB later

                    const isCorrect = response.isCorrect;
                    const isUnattempted = response.selectedOptionId === null;

                    // Determine border colors based on status
                    let borderClass = "border-gray-200";
                    let badgeClass = "bg-gray-100 text-gray-700";
                    let statusText = "Skipped";

                    if (!isUnattempted) {
                        if (isCorrect) {
                            borderClass = "border-green-300";
                            badgeClass = "bg-green-100 text-green-800";
                            statusText = "Correct (+1)"; // Adjust if you have dynamic marks
                        } else {
                            borderClass = "border-red-300";
                            badgeClass = "bg-red-100 text-red-800";
                            statusText = `Incorrect (-${test.negativeMarking})`;
                        }
                    }

                    return (
                        <div key={response._id} className={`bg-white rounded-lg shadow-sm border-l-4 ${borderClass} p-6`}>

                            <div className="flex justify-between items-start mb-2 sm:mb-4">
                                <span className="font-bold text-gray-900">Question {index + 1}</span>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${badgeClass}`}>
                                    {statusText}
                                </span>
                            </div>

                            <h4 className="text-sm sm:text-lg text-gray-800 font-medium mb-3 sm:mb-6">
                                {question.questionText}
                            </h4>

                            <div className="space-y-3 mb-3 sm:mb-6">
                                {question.options.map((option) => {
                                    const isUserChoice = response.selectedOptionId === option.id;
                                    const isActualCorrectChoice = question.correctOptionId === option.id;

                                    // Highlight logic for the options
                                    let optionStyle = "border-gray-200 text-gray-700";
                                    let icon = "";

                                    if (isActualCorrectChoice) {
                                        optionStyle = "bg-green-50 border-green-400 text-green-900 font-medium";
                                        icon = "✅";
                                    } else if (isUserChoice && !isActualCorrectChoice) {
                                        optionStyle = "bg-red-50 border-red-400 text-red-900";
                                        icon = "❌";
                                    }

                                    return (
                                        <div key={option.id} className={`flex items-center justify-between p-2 sm:p-4 border rounded-md ${optionStyle}`}>
                                            <span>
                                                <span className="font-bold mr-2">{option.id}.</span>
                                                {option.text}
                                            </span>
                                            <span>{icon}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Solution Explanation Box */}
                            {question.solutionExplanation && (
                                <div className="bg-blue-50 border border-blue-100 p-4 rounded-md">
                                    <p className="text-sm font-bold text-blue-900 mb-1">Explanation:</p>
                                    <p className="text-sm text-blue-800 whitespace-pre-line">
                                        {question.solutionExplanation}
                                    </p>
                                </div>
                            )}

                        </div>
                    );
                })}
            </div>

        </div>
    );
}