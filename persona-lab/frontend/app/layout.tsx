import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Persona Lab",
  description: "R&D co-design tool for interviewing digital personas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
