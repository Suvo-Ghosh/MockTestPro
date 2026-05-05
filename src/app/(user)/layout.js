// src/app/(user)/layout.js
import Link from "next/link";
import { auth } from "@/auth";
import { handleLogout } from "@/actions/authActions";

export default async function UserLayout({ children }) {
    const session = await auth();

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* User Navbar */}
            <nav className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">

                        {/* Left side Links */}
                        <div className="flex items-center gap-8">
                            <Link href="/dashboard" className="font-extrabold text-2xl text-blue-600">
                                MockTest<span className="text-gray-900">Pro</span>
                            </Link>
                            <div className="hidden md:flex gap-4">
                                <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium">Available Tests</Link>
                                <Link href="#" className="text-gray-600 hover:text-blue-600 font-medium">My Results</Link> {/* You can build a history page later */}
                            </div>
                        </div>

                        {/* Right side Profile & Logout */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                    {session?.user?.name?.charAt(0) || "U"}
                                </div>
                                <span className="text-sm font-medium text-gray-700 hidden sm:block">{session?.user?.name}</span>
                            </div>

                            <form action={handleLogout}>
                                <button type="submit" className="text-gray-500 hover:text-red-600 text-sm font-medium transition">
                                    Logout
                                </button>
                            </form>
                        </div>

                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow">
                {children}
            </main>
        </div>
    );
}