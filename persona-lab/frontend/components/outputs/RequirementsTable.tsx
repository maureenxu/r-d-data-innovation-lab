"use client";

import { useState } from "react";
import { Requirement, Priority } from "@/lib/types";

const PRIORITY_STYLES: Record<Priority, string> = {
  high:   "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low:    "bg-gray-100 text-gray-600",
};

interface RequirementsTableProps {
  requirements: Requirement[];
}

export default function RequirementsTable({ requirements }: RequirementsTableProps) {
  const [sortAsc, setSortAsc] = useState(false);

  const ORDER: Priority[] = ["high", "medium", "low"];
  const sorted = [...requirements].sort((a, b) => {
    const diff = ORDER.indexOf(a.priority) - ORDER.indexOf(b.priority);
    return sortAsc ? diff : -diff;
  });

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-3 text-left font-medium text-gray-600 w-20">ID</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Requirement</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600 w-32">Category</th>
            <th
              className="px-4 py-3 text-left font-medium text-gray-600 w-28 cursor-pointer hover:text-gray-900 select-none"
              onClick={() => setSortAsc(!sortAsc)}
            >
              Priority {sortAsc ? "↑" : "↓"}
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-600 w-28">Source</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((req, i) => (
            <tr key={req.id} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
              <td className="px-4 py-3 font-mono text-xs text-gray-500">{req.req_id}</td>
              <td className="px-4 py-3 text-gray-800 leading-relaxed">{req.statement}</td>
              <td className="px-4 py-3 text-gray-600">{req.category}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${PRIORITY_STYLES[req.priority] ?? PRIORITY_STYLES.low}`}>
                  {req.priority}
                </span>
              </td>
              <td className="px-4 py-3 text-xs text-gray-500">{req.source_type?.replace("_", " ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
