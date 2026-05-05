// src/app/(admin)/admin/tests/create/page.js
"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { createMockTest } from "@/actions/adminActions";
import { getCategories } from "@/actions/categoryActions";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-slate-900 text-white py-3 px-4 rounded-md font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50 transition-colors"
        >
            {pending ? "Parsing and Uploading..." : "Publish Mock Test"}
        </button>
    );
}

export default function CreateTestPage() {
    const [state, formAction] = useActionState(createMockTest, null);
    const [categories, setCategories] = useState([]);

    // Fetch available categories for the dropdown
    useEffect(() => {
        async function fetchAvailableCategories() {
            const data = await getCategories();
            setCategories(data);
        }
        fetchAvailableCategories();
    }, []);

    // A quick template showing the exact structure the admin needs to follow
    const jsonTemplate = `[
  {
    "questionText": "If a train travels at 90 km/hr, what distance will it cover in 10 minutes?",
    "options": [
      { "id": "A", "text": "10 km" },
      { "id": "B", "text": "15 km" },
      { "id": "C", "text": "20 km" },
      { "id": "D", "text": "25 km" }
    ],
    "correctOptionId": "B",
    "marks": 1,
    "solutionExplanation": "Speed = 90 km/hr. Time = 10/60 hrs. Distance = 90 * (1/6) = 15 km."
  }
]`;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow px-3 sm:px-6 py-4 sm:py-8 text-black">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Mock Test</h1>

                {state?.error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
                        {state.error}
                    </div>
                )}

                {state?.success && (
                    <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md border border-green-200">
                        {state.success}
                    </div>
                )}

                <form action={formAction} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Exam Title</label>
                            <input type="text" name="title" required placeholder="e.g., RRB JE CBT-1 Full Mock" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500" />
                        </div>

                        {/* Added Category Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Exam Category</label>
                            <select name="categoryId" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500 bg-white">
                                <option value="" disabled selected>Select a category...</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>{cat.name} ({cat.shortName})</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Duration (Minutes)</label>
                            <input type="number" name="duration" required defaultValue={90} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Total Marks</label>
                            <input type="number" name="totalMarks" required defaultValue={100} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Negative Marking</label>
                            <input type="number" step="0.01" name="negativeMarking" required defaultValue={0.33} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Instructions (Optional)</label>
                        <textarea name="instructions" rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500" placeholder="Enter any specific exam rules..." />
                    </div>

                    <div>
                        <div className="flex justify-between">
                            <label className="block text-sm font-medium text-gray-700">Questions (JSON Array)</label>
                            <span className="text-xs text-gray-500">Must be a valid JSON array</span>
                        </div>
                        <textarea
                            name="questionsJson"
                            required
                            rows={15}
                            defaultValue={jsonTemplate}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border font-mono text-sm bg-gray-50 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <SubmitButton />
                </form>
            </div>
        </div>
    );
}