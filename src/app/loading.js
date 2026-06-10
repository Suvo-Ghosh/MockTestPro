// src/app/loading.js

export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="flex flex-col items-center">
                {/* The Spinner */}
                <div className="w-12 h-12 rounded-full animate-spin border-4 border-solid border-blue-600 border-t-transparent shadow-md"></div>

                {/* Loading Text */}
                <p className="mt-4 text-sm font-semibold text-gray-700 tracking-wide animate-pulse">
                    Loading...
                </p>
            </div>
        </div>
    );
}