"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/builder", label: "Persona Builder" },
  { href: "/interview", label: "Interview" },
  { href: "/outputs", label: "Outputs" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-8 sticky top-0 z-10">
        <span className="font-semibold text-indigo-600 text-lg tracking-tight">Persona Lab</span>
        <nav className="flex gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                pathname.startsWith(href)
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="flex-1 flex">{children}</main>
    </div>
  );
}
