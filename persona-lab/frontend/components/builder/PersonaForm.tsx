"use client";

import { useState, KeyboardEvent } from "react";
import { Persona } from "@/lib/types";

interface PersonaFormProps {
  initial: Partial<Persona>;
  onNext: (data: Partial<Persona>) => void;
}

export default function PersonaForm({ initial, onNext }: PersonaFormProps) {
  const [role, setRole] = useState(initial.role ?? "");
  const [department, setDepartment] = useState(initial.department ?? "");
  const [years, setYears] = useState<number>(initial.years_experience ?? 0);
  const [tags, setTags] = useState<string[]>(initial.expertise_tags ?? []);
  const [tagInput, setTagInput] = useState("");

  function addTag() {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  }

  function handleTagKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") { e.preventDefault(); addTag(); }
  }

  function handleNext() {
    if (!role || !department) return;
    onNext({ role, department, years_experience: years, expertise_tags: tags });
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Persona profile</h2>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <input
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="e.g. Senior Lab Technician"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <input
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="e.g. Formulation R&D"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Years of experience</label>
          <input
            type="number"
            min={0}
            max={50}
            className="w-32 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expertise tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((t) => (
              <span key={t} className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                {t}
                <button onClick={() => setTags(tags.filter((x) => x !== t))} className="hover:text-indigo-900 ml-0.5">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Type a tag and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKey}
            />
            <button
              type="button"
              onClick={addTag}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Add
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleNext}
          disabled={!role || !department}
          className="px-5 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
