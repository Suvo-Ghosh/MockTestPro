// src/actions/categoryActions.js
"use server";

import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
import { revalidatePath } from "next/cache";

export async function createCategory(prevState, formData) {
    await connectDB();

    const name = formData.get("name");
    const shortName = formData.get("shortName");
    const description = formData.get("description");

    try {
        await Category.create({ name, shortName, description });

        // This tells Next.js to clear the cache for the dashboard/categories pages 
        // so the new category shows up instantly without refreshing
        revalidatePath("/admin/dashboard");
        revalidatePath("/admin/categories");
        revalidatePath("/admin/tests/create");

        return { success: `Category "${shortName}" created successfully.` };
    } catch (error) {
        return { error: "Failed to create category. It might already exist." };
    }
}

export async function getCategories() {
    await connectDB();
    // .lean() is crucial here so we can pass the data from Server to Client components safely
    const categories = await Category.find({}).sort({ createdAt: -1 }).lean();

    // Convert MongoDB ObjectIds to strings to prevent Next.js serialization errors
    return categories.map(cat => ({
        ...cat,
        _id: cat._id.toString()
    }));
}