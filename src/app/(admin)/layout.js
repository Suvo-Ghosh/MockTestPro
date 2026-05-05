// src/app/(admin)/layout.js
import Link from "next/link";
import { auth } from "@/auth";
import { handleLogout } from "@/actions/authActions";

export default async function AdminLayout({ children }) {
    const session = await auth();

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Admin Navbar */}
            <nav className="bg-slate-900 text-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">

                        {/* Left side Links */}
                        <div className="flex items-center gap-8">
                            <span className="font-bold text-xl tracking-wider">ADMIN PORTAL</span>
                            <div className="hidden md:flex gap-4">
                                <Link href="/admin/dashboard" className="text-gray-300 hover:text-white font-medium">Dashboard</Link>
                                <Link href="/admin/categories" className="text-gray-300 hover:text-white font-medium">Categories</Link>
                                <Link href="/admin/tests/create" className="text-gray-300 hover:text-white font-medium">Create Test</Link>
                            </div>
                        </div>

                        {/* Right side Profile & Logout */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-400">Hi, {session?.user?.name}</span>
                            <form action={handleLogout}>
                                <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-bold transition">
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