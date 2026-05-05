// src/app/page.js
import Link from "next/link";
import { auth } from "@/auth";

export default async function LandingPage() {
  const session = await auth();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white">
      <div className="max-w-3xl mx-auto text-center px-4">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight sm:text-6xl mb-6">
          Master Your Exams with <span className="text-blue-600">Confidence</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10">
          The ultimate mock test platform for SSC, RRB, and other competitive government exams. Real-time timers, negative marking, and detailed performance analytics.
        </p>

        <div className="flex justify-center gap-4">
          {session ? (
            <Link
              href={session.user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition"
              >
                Log In to Start
              </Link>
              {/* You can build a /register page later! */}
              <Link href="/register" className="bg-gray-100 text-gray-800 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-200 transition text-center">
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}