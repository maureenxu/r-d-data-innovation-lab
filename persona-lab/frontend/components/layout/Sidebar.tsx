"use client";

import { Persona } from "@/lib/types";

interface SidebarProps {
  personas: Persona[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
}

function avatar(role: string) {
  return role
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export default function Sidebar({ personas, activeId, onSelect, onNew }: SidebarProps) {
  return (
    <aside className="w-64 shrink-0 bg-white border-r border-gray-200 flex flex-col">
      <div className="px-4 py-3 border-b border-gray-100">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Personas</span>
      </div>
      <ul className="flex-1 overflow-y-auto py-2">
        {personas.map((p) => (
          <li key={p.id}>
            <button
              onClick={() => onSelect(p.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors ${
                activeId === p.id ? "bg-indigo-50" : ""
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
                {avatar(p.role)}
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-medium truncate ${activeId === p.id ? "text-indigo-700" : "text-gray-900"}`}>
                  {p.role}
                </p>
                <p className="text-xs text-gray-500 truncate">{p.department}</p>
              </div>
            </button>
          </li>
        ))}
      </ul>
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={onNew}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-indigo-600 border border-indigo-200 rounded-md hover:bg-indigo-50 transition-colors"
        >
          <span>+</span> New persona
        </button>
      </div>
    </aside>
  );
}
