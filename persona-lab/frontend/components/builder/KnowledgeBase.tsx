"use client";

import { useState, useRef, DragEvent } from "react";
import { Persona, Document } from "@/lib/types";
import { api } from "@/lib/api";

interface KnowledgeBaseProps {
  personaId: string | null;
  initial: Partial<Persona>;
  onBack: () => void;
  onSave: (notes: string, docs: Document[]) => void;
  saving: boolean;
  error: string | null;
}

export default function KnowledgeBase({
  personaId,
  initial,
  onBack,
  onSave,
  saving,
  error,
}: KnowledgeBaseProps) {
  const [notes, setNotes] = useState(initial.context_notes ?? "");
  const [docs, setDocs] = useState<Document[]>(initial.documents ?? []);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || !personaId) return;
    setUploading(true);
    setUploadError(null);
    try {
      for (const file of Array.from(files)) {
        const doc = await api.uploadDocument(personaId, file);
        setDocs((prev) => [...prev, doc as unknown as Document]);
      }
    } catch (e: unknown) {
      setUploadError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Knowledge base</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Documents</label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              dragging ? "border-indigo-400 bg-indigo-50" : "border-gray-300 hover:border-indigo-300 hover:bg-gray-50"
            }`}
          >
            <p className="text-sm text-gray-500">
              {personaId
                ? "Drop PDF, DOCX, or XLSX files here, or click to browse"
                : "Save the profile first to enable document upload"}
            </p>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.docx,.xlsx"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
              disabled={!personaId}
            />
          </div>
          {uploading && <p className="text-xs text-indigo-600 mt-2">Uploading…</p>}
          {uploadError && <p className="text-xs text-red-500 mt-2">{uploadError}</p>}
          {docs.length > 0 && (
            <ul className="mt-3 space-y-1">
              {docs.map((d) => (
                <li key={d.id} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-green-500">✓</span> {d.filename}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role knowledge & behaviours
          </label>
          <textarea
            rows={4}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            placeholder="Describe daily workflows, frustrations, attitudes toward new tools, key constraints…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          ← Back
        </button>
        <button
          onClick={() => onSave(notes, docs)}
          disabled={saving}
          className="px-5 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-40"
        >
          {saving ? "Saving…" : "Next →"}
        </button>
      </div>
    </div>
  );
}
