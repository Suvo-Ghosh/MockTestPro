// src/app/(auth)/login/page.js
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginUser } from "@/actions/authActions";
import Link from "next/link";

// A separate component is required to use useFormStatus() 
// It automatically detects when the parent <form> is submitting
function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
            {pending ? "Signing in..." : "Sign in"}
        </button>
    );
}

export default function LoginPage() {
    // Hook up our Server Action to the form state
    const [state, formAction] = useActionState(loginUser, null);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">

                {/* Header */}
                <div>
                    <h2 className="mt-2 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                            Sign up here
                        </Link>
                    </p>
                </div>

                {/* Form */}
                <form className="mt-8 space-y-6" action={formAction}>

                    {/* Error Message Display */}
                    {state?.error && (
                        <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-md text-sm text-center font-medium">
                            {state.error}
                        </div>
                    )}

                    <div className="space-y-4 text-black">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div>
                        <SubmitButton />
                    </div>
                </form>

            </div>
        </div>
    );
}