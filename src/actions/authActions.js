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

    try {
        // We don't need to specify a redirect path here because your middleware.js 
        // will automatically route them to /admin/dashboard or /dashboard based on their role!
        await signIn("credentials", {
            email,
            password,
            redirect: true,
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
    await signOut({ redirectTo: "/" }); // Send them back to the landing page
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

        // 1. Check if user already exists
        const existingUser = await User.findOne({ email }).lean();
        if (existingUser) {
            return { error: "An account with this email already exists." };
        }

        // 2. Hash the password securely
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create the user in the database
        await User.create({
            name,
            email,
            password: hashedPassword,
            role: "USER", // By default, everyone who signs up is a standard user
        });

    } catch (error) {
        console.error("Registration error:", error);
        return { error: "Something went wrong. Please try again." };
    }

    // Next.js requires redirect() to be called OUTSIDE the try-catch block!
    redirect("/login");
}