// src/app/(user)/layout.js
import { auth } from "@/auth";
import { handleLogout } from "@/actions/authActions";
import UserNavbar from "@/components/UserNavbar";

export default async function UserLayout({ children }) {
    const session = await auth();

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">

            {/* 
        Pass the user object and the server action down to the Client Component 
      */}
            <UserNavbar user={session?.user} onLogout={handleLogout} />

            {/* Main Content */}
            <main className="flex-grow">
                {children}
            </main>
        </div>
    );
}