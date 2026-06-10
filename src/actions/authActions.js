// src/actions/authActions.js
"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { redirect } from "next/navigation";

export async function loginUser(prevState, formData) {
    const email = formData.get("email");
    const password = formData.get("password");

    let finalRedirectUrl = "/dashboard"; // Default for standard users

    try {
        await connectDB();

        // 1. Check the user's role BEFORE we call signIn
        // This prevents the middleware from having to "double bounce" the redirect
        const existingUser = await User.findOne({ email }).lean();

        if (existingUser && existingUser.role === "ADMIN") {
            finalRedirectUrl = "/admin/dashboard";
        }

        // 2. Pass the exact final URL to NextAuth v5
        await signIn("credentials", {
            email,
            password,
            redirectTo: finalRedirectUrl, // Use redirectTo, not redirect: true
        });

    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid email or password." };
                default:
                    return { error: "Something went wrong. Please try again." };
            }
        }
        // Next.js requires you to throw the error if it's a redirect error (which signIn throws on success)
        throw error;
    }
}

export async function handleLogout() {
    await signOut({ redirectTo: "/" });
}

export async function registerUser(prevState, formData) {
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    if (!name || !email || !password) {
        return { error: "All fields are required." };
    }

    if (password.length < 6) {
        return { error: "Password must be at least 6 characters long." };
    }

    try {
        await connectDB();

        const existingUser = await User.findOne({ email }).lean();
        if (existingUser) {
            return { error: "An account with this email already exists." };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
            role: "USER",
        });

    } catch (error) {
        console.error("Registration error:", error);
        return { error: "Something went wrong. Please try again." };
    }

    redirect("/login");
}