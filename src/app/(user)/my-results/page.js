// src/app/(user)/my-results/page.js
import { getUserResults } from "@/actions/userActions";
import Link from "next/link";

export default async function MyResultsPage() {
    const results = await getUserResults();

    // Format date to something readable like "May 5, 2026"
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="max-w-350 mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-8">My Results</h1>

            {results.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <p className="text-gray-500 text-lg mb-4">You haven't taken any tests yet.</p>
                    <Link href="/dashboard" className="text-blue-600 font-medium hover:underline">
                        Go browse available tests &rarr;
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((result) => {
                        const totalAttempted = result.correctAnswersCount + result.wrongAnswersCount;
                        const accuracy = totalAttempted > 0
                            ? Math.round((result.correctAnswersCount / totalAttempted) * 100)
                            : 0;

                        return (
                            <div key={result._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-6 flex flex-col">
                                <div className="mb-4">
                                    <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">
                                        {formatDate(result.createdAt)}
                                    </p>
                                    <h2 className="text-sm sm:text-xl font-bold text-gray-900 leading-tight">
                                        {result.testId?.title || "Deleted Test"}
                                    </h2>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-blue-50 p-3 rounded-md text-center">
                                        <p className="text-xs text-blue-800 font-bold uppercase">Score</p>
                                        <p className="text-xl font-black text-blue-600">
                                            {result.score.toFixed(2)} <span className="text-sm font-medium text-blue-400">/ {result.testId?.totalMarks}</span>
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-md text-center">
                                        <p className="text-xs text-gray-600 font-bold uppercase">Accuracy</p>
                                        <p className="text-xl font-black text-gray-800">{accuracy}%</p>
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <Link
                                        href={`/result/${result._id}`}
                                        className="block w-full text-center border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 rounded-md font-medium transition"
                                    >
                                        View Detailed Report
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}