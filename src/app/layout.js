// src/app/layout.js
import "./globals.css";

export const metadata = {
  title: "Mock Test Platform",
  description: "Prepare for SSC, RRB, and Government Exams",
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