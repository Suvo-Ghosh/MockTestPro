// src/app/layout.js
import "./globals.css";

export const metadata = {
  title: "MockTestPro",
  description: "Prepare for SSC, RRB, and Government Exams",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Prevents mobile browsers from zooming in when tapping inputs
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}