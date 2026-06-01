"use client";

import { Persona } from "@/lib/types";

interface PersonaReviewProps {
  draft: Partial<Persona>;
  saving: boolean;
  error: string | null;
  onEdit: (step: 1 | 2) => void;
  onConfirm: () => void;
}

function Section({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{title}</h3>
        <button
          onClick={onEdit}
          className="text-xs text-indigo-600 hover:underline"
        >
          Edit
        </button>
      </div>
      {children}
    </div>
  );
}

export default function PersonaReview({ draft, saving, error, onEdit, onConfirm }: PersonaReviewProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Review persona</h2>
      <div className="space-y-4">
        <Section title="Profile" onEdit={() => onEdit(1)}>
          <div className="space-y-2 text-sm">
            <div className="flex gap-2">
              <span className="text-gray-500 w-36 shrink-0">Role</span>
              <span className="text-gray-900 font-medium">{draft.role || <em className="text-gray-400">—</em>}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-500 w-36 shrink-0">Department</span>
              <span className="text-gray-900">{draft.department || <em className="text-gray-400">—</em>}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-500 w-36 shrink-0">Experience</span>
              <span className="text-gray-900">{draft.years_experience != null ? `${draft.years_experience} years` : <em className="text-gray-400">—</em>}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-500 w-36 shrink-0">Expertise tags</span>
              <div className="flex flex-wrap gap-1">
                {(draft.expertise_tags ?? []).length > 0
                  ? draft.expertise_tags!.map((t) => (
                      <span key={t} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">{t}</span>
                    ))
                  : <em className="text-gray-400 text-xs">No tags</em>}
              </div>
            </div>
          </div>
        </Section>

        <Section title="Knowledge base" onEdit={() => onEdit(2)}>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Documents</p>
              {(draft.documents ?? []).length > 0 ? (
                <ul className="space-y-1">
                  {draft.documents!.map((d) => (
                    <li key={d.id} className="flex items-center gap-2 text-gray-700">
                      <span className="text-green-500">✓</span> {d.filename}
                    </li>
                  ))}
                </ul>
              ) : (
                <em className="text-gray-400">No documents uploaded</em>
              )}
            </div>
            <div>
              <p className="text-gray-500 mb-1">Context notes</p>
              {draft.context_notes ? (
                <p className="text-gray-800 leading-relaxed bg-gray-50 rounded-lg p-3">{draft.context_notes}</p>
              ) : (
                <em className="text-gray-400">No notes added</em>
              )}
            </div>
          </div>
        </Section>
      </div>

      {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

      <div className="mt-8 flex justify-between">
        <button
          onClick={() => onEdit(2)}
          className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          ← Back
        </button>
        <button
          onClick={onConfirm}
          disabled={saving}
          className="px-5 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-40"
        >
          {saving ? "Saving…" : "Confirm & save"}
        </button>
      </div>
    </div>
  );
}
