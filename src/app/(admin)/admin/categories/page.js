// src/app/(admin)/admin/categories/page.js
"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { createCategory, getCategories } from "@/actions/categoryActions";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="w-full bg-slate-900 text-white py-2 px-4 rounded-md font-medium hover:bg-slate-800 disabled:opacity-50">
            {pending ? "Adding..." : "Add Category"}
        </button>
    );
}

export default function CategoriesPage() {
    const [state, formAction] = useActionState(createCategory, null);
    const [categories, setCategories] = useState([]);

    // Fetch categories on mount and when state.success triggers
    useEffect(() => {
        async function fetchCategories() {
            const data = await getCategories();
            setCategories(data);
        }
        fetchCategories();
    }, [state?.success]);

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="md:col-span-1 bg-white p-6 rounded-lg shadow h-fit">
                <h2 className="text-xl font-bold mb-4">Add New Category</h2>

                {state?.success && <p className="text-green-600 text-sm mb-4 bg-green-50 p-2 rounded">{state.success}</p>}
                {state?.error && <p className="text-red-600 text-sm mb-4 bg-red-50 p-2 rounded">{state.error}</p>}

                <form action={formAction} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" name="name" required placeholder="Staff Selection Commission" className="mt-1 block w-full rounded-md border border-gray-300 p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Short Name</label>
                        <input type="text" name="shortName" required placeholder="SSC" className="mt-1 block w-full rounded-md border border-gray-300 p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea name="description" rows={2} className="mt-1 block w-full rounded-md border border-gray-300 p-2" />
                    </div>
                    <SubmitButton />
                </form>
            </div>

            {/* List Section */}
            <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Existing Categories</h2>
                <div className="space-y-4">
                    {categories.length === 0 ? <p className="text-gray-500">No categories found.</p> : null}
                    {categories.map((cat) => (
                        <div key={cat._id} className="border border-gray-200 p-4 rounded-md flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-gray-900">{cat.name}</h3>
                                <p className="text-sm text-gray-500">{cat.description}</p>
                            </div>
                            <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-bold">
                                {cat.shortName}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}