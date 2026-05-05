// src/app/(admin)/admin/dashboard/page.js
import { connectDB } from "@/lib/db";
import { MockTest } from "@/models/MockTest";
import { Category } from "@/models/Category"; // Adjust path
import Link from "next/link";

export default async function AdminDashboard() {
    await connectDB();

    // Fetch all tests and populate their category names
    const tests = await MockTest.find({})
        .populate("category", "shortName")
        .sort({ createdAt: -1 })
        .lean();

    const categoriesCount = await Category.countDocuments();
    const publishedTestsCount = tests.filter(t => t.status === "PUBLISHED").length;

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-2 sm:flex-row justify-between sm:items-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <div className="flex gap-4">
                    <Link href="/admin/categories" className="text-sm sm:text-base bg-white border border-gray-300 text-gray-700 py-2 px-2 sm:px-4 rounded-sm sm:rounded-md font-medium hover:bg-gray-50 transition">
                        Manage Categories
                    </Link>
                    <Link href="/admin/tests/create" className="text-sm sm:text-base bg-slate-900 text-white py-2 px-2 sm:px-4 rounded-sm sm:rounded-md font-medium hover:bg-slate-800 transition">
                        + Create New Test
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 md:grid-cols-3 gap-3 sm:gap-6 mb-8">
                <div className="bg-white p-2 sm:p-6 rounded-lg shadow border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Mock Tests</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{tests.length}</p>
                </div>
                <div className="bg-white p-2 sm:p-6 rounded-lg shadow border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Published Tests</h3>
                    <p className="text-3xl font-bold text-green-600 mt-2">{publishedTestsCount}</p>
                </div>
                <div className="bg-white p-2 sm:p-6 rounded-lg shadow border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Exam Categories</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{categoriesCount}</p>
                </div>
            </div>

            {/* Tests Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tests.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">No mock tests found. Create one to get started!</td>
                            </tr>
                        ) : (
                            tests.map((test) => (
                                <tr key={test._id.toString()}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{test.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                            {test.category?.shortName || "Unknown"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{test.totalQuestions} Qs</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${test.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {test.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {/* Add edit/delete links later if needed */}
                                        <button className="text-blue-600 hover:text-blue-900">Edit</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}