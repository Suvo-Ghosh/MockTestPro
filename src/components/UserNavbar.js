// src/components/UserNavbar.js
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // <-- Add this import

export default function UserNavbar({ user, onLogout }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname(); // <-- Get the current route

    if (pathname.startsWith("/test/")) {
        return null;
    }

    // Helper variables to check the active route
    const isDashboard = pathname === "/dashboard";
    const isMyResults = pathname === "/my-results";

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm relative z-999">
            <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/dashboard" className="flex items-center gap-1 font-extrabold text-xl md:text-2xl text-blue-600">
                            <img src="logo.png" className="h-8 md:h-10 w-8 md:w-10"/>
                            MockTest<span className="text-gray-900">Pro</span>
                        </Link>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex gap-6 items-center">
                        <Link
                            href="/dashboard"
                            className={`font-medium ${isDashboard ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}
                        >
                            Available Tests
                        </Link>
                        <Link
                            href="/my-results"
                            className={`font-medium ${isMyResults ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}
                        >
                            My Results
                        </Link>
                    </div>

                    {/* Desktop Profile & Logout */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                {user?.name?.charAt(0) || "U"}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                        </div>

                        <form action={onLogout}>
                            <button type="submit" className="cursor-pointer text-red-600 text-sm font-medium transition">
                                Logout
                            </button>
                        </form>
                    </div>

                    {/* Mobile Hamburger Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-600 hover:text-gray-900 focus:outline-none p-2"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
                    <div className="px-4 pt-2 pb-4 space-y-1">
                        <Link
                            href="/dashboard"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`block px-3 py-2 rounded-md text-base font-medium ${isDashboard ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}
                        >
                            Available Tests
                        </Link>
                        <Link
                            href="/my-results"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`block px-3 py-2 rounded-md text-base font-medium ${isMyResults ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}
                        >
                            My Results
                        </Link>
                    </div>

                    <div className="pt-4 pb-4 border-t border-gray-200">
                        <div className="flex items-center px-5 mb-4 gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                                {user?.name?.charAt(0) || "U"}
                            </div>
                            <div>
                                <div className="text-base font-medium text-gray-800">{user?.name}</div>
                                <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                            </div>
                        </div>
                        <div className="px-5">
                            <form action={onLogout}>
                                <button type="submit" className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">
                                    Log out
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}