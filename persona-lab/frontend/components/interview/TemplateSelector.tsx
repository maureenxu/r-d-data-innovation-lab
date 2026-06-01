"use client";

import { INTERVIEW_TEMPLATES } from "@/lib/types";

interface TemplateSelectorProps {
  value: string;
  onChange: (key: string) => void;
}

export default function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
    >
      {Object.entries(INTERVIEW_TEMPLATES).map(([key, t]) => (
        <option key={key} value={key}>{t.label}</option>
      ))}
    </select>
  );
}
