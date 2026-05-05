// src/app/(user)/dashboard/page.js
import { getAvailableTests } from "@/actions/userActions";
import Link from "next/link";

export default async function UserDashboard() {
    const tests = await getAvailableTests();

    return (
        <div className="max-w-350 mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Mock Tests</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tests.length === 0 ? (
                    <p className="text-gray-500">No tests available right now.</p>
                ) : (
                    tests.map((test) => (
                        <div key={test._id} className="bg-white rounded-lg shadow border border-gray-200 p-6 flex flex-col">
                            <div className="mb-4">
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2 inline-block font-bold">
                                    {test.category?.shortName || "General"}
                                </span>
                                <h2 className="text-xl font-bold text-gray-900">{test.title}</h2>
                            </div>

                            <div className="text-sm text-gray-600 mb-6 space-y-1">
                                <p>⏱️ Duration: {test.durationInMinutes} mins</p>
                                <p>📝 Questions: {test.totalQuestions}</p>
                                <p>🎯 Marks: {test.totalMarks} (Negative: -{test.negativeMarking})</p>
                            </div>

                            <div className="mt-auto">
                                <Link
                                    href={`/test/${test._id}`}
                                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition"
                                >
                                    Start Test
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}