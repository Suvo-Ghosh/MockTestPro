// src/middleware.js
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server"; // Fixed import!

// Initialize NextAuth with ONLY the edge-safe configuration
const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const userRole = req.auth?.user?.role;

    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
    const isAuthRoute = nextUrl.pathname === "/login" || nextUrl.pathname === "/register";
    const isAdminRoute = nextUrl.pathname.startsWith("/admin");
    const isUserRoute = nextUrl.pathname.startsWith("/dashboard") || nextUrl.pathname.startsWith("/test") || nextUrl.pathname.startsWith("/result");

    if (isApiAuthRoute) return NextResponse.next();

    if (isAuthRoute) {
        if (isLoggedIn) {
            const redirectUrl = userRole === "ADMIN" ? "/admin/dashboard" : "/dashboard";
            return NextResponse.redirect(new URL(redirectUrl, nextUrl));
        }
        return NextResponse.next();
    }

    if (isAdminRoute) {
        if (!isLoggedIn) return NextResponse.redirect(new URL("/login", nextUrl));
        if (userRole !== "ADMIN") return NextResponse.redirect(new URL("/dashboard", nextUrl));
        return NextResponse.next();
    }

    if (isUserRoute) {
        if (!isLoggedIn) return NextResponse.redirect(new URL("/login", nextUrl));
        return NextResponse.next();
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};