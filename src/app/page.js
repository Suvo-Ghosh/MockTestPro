// src/app/page.js
import { auth } from "@/auth";
import TransitionButton from "@/components/TransitionButton"; // Import the new component

export default async function LandingPage() {
  const session = await auth();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white">
      <div className="max-w-3xl mx-auto text-center px-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight sm:text-6xl mb-6">
          Master Your Exams with <span className="text-blue-600">Confidence</span>
        </h1>
        <p className="text-sm sm:text-xl text-gray-500 mb-10">
          The ultimate mock test platform for SSC, RRB, and other competitive government exams. Real-time timers, negative marking, and detailed performance analytics.
        </p>

        <div className="flex justify-center gap-4">
          {session ? (
            <TransitionButton
              href={session.user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"}
              className="bg-blue-600 text-white cursor-pointer px-4 sm:px-8 py-2 sm:py-3 rounded-sm sm:rounded-lg font-bold text-sm sm:text-lg hover:bg-blue-700 transition"
            >
              Go to Dashboard
            </TransitionButton>
          ) : (
            <>
              <TransitionButton
                href="/login"
                className="bg-blue-600 text-white cursor-pointer px-4 sm:px-8 py-2 sm:py-3 rounded-sm sm:rounded-lg font-bold text-sm sm:text-lg hover:bg-blue-700 transition"
              >
                Log In to Start
              </TransitionButton>

              <TransitionButton
                href="/register"
                className="bg-gray-100 text-gray-800 cursor-pointer px-4 sm:px-8 py-2 sm:py-3 rounded-sm sm:rounded-lg font-bold text-sm sm:text-lg hover:bg-gray-200 transition text-center"
              >
                Create Account
              </TransitionButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
}