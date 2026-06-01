"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import InsightCard from "@/components/outputs/InsightCard";
import RequirementsTable from "@/components/outputs/RequirementsTable";
import { InsightCard as InsightCardType, Requirement, Session } from "@/lib/types";
import { api } from "@/lib/api";

const SESSION_KEY = "active_session_id";

function OutputsContent() {
  const searchParams = useSearchParams();
  const paramSessionId = searchParams.get("session");

  const [sessionId, setSessionId] = useState<string>("");
  const [session, setSession] = useState<Session | null>(null);
  const [insights, setInsights] = useState<InsightCardType[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loadingReqs, setLoadingReqs] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const resolveSessionId = async () => {
      if (paramSessionId) return paramSessionId;
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) return stored;
      const sessions = await api.listSessions().catch(() => [] as Session[]);
      if (sessions.length > 0) return sessions[sessions.length - 1].id;
      return "";
    };

    resolveSessionId().then((id) => {
      if (!id) { setError("No session found. Start an interview first."); return; }
      setSessionId(id);
      localStorage.setItem(SESSION_KEY, id);
      api.getSession(id).then(setSession).catch(() => setError("Session not found"));
      api.getInsights(id).then(({ insights: ins, requirements: reqs }) => {
        if (ins) setInsights(ins);
        if (reqs) setRequirements(reqs);
      }).catch(() => {});
    });
  }, [paramSessionId]);

  async function handleGenerateRequirements() {
    if (!sessionId) return;
    setLoadingReqs(true);
    setError(null);
    try {
      const { requirements: reqs } = await api.generateRequirements(sessionId);
      setRequirements(reqs);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to generate requirements");
    } finally {
      setLoadingReqs(false);
    }
  }

  function handleExport() {
    const data = { session_id: sessionId, insights, requirements };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `persona-lab-session-${sessionId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const exchangeCount = session?.messages.filter((m) => !m.is_handoff).length ?? 0;
  const personaCount = session?.persona_sequence.length ?? 0;

  return (
    <AppShell>
      <div className="flex-1 overflow-y-auto px-10 py-8 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/interview" className="text-sm text-indigo-600 hover:underline mb-2 block">
              ← Back to session
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">Session Insights</h1>
            {session && (
              <p className="text-sm text-gray-500 mt-1">
                Interview session · {exchangeCount} exchanges · {personaCount} persona{personaCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <button
            onClick={handleExport}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Export ↗
          </button>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Insight cards */}
        {insights.length > 0 ? (
          <section className="mb-10">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
              Insight cards ({insights.length})
            </h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
              {insights.map((card) => (
                <InsightCard key={card.id} card={card} />
              ))}
            </div>
          </section>
        ) : (
          <div className="mb-10 p-6 bg-gray-50 rounded-xl border border-gray-200 text-center text-sm text-gray-500">
            No insights yet. Go back to the interview and click "Generate insights".
          </div>
        )}

        {/* Requirements */}
        {insights.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Requirements {requirements.length > 0 ? `(${requirements.length})` : ""}
              </h2>
              {requirements.length === 0 && (
                <button
                  onClick={handleGenerateRequirements}
                  disabled={loadingReqs}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-40"
                >
                  {loadingReqs ? "Synthesising…" : "Synthesise requirements ↗"}
                </button>
              )}
            </div>
            {requirements.length > 0 ? (
              <RequirementsTable requirements={requirements} />
            ) : (
              <p className="text-sm text-gray-400">Click the button above to generate requirements from your insight cards.</p>
            )}
          </section>
        )}
      </div>
    </AppShell>
  );
}

export default function OutputsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-sm text-gray-400">Loading…</div>}>
      <OutputsContent />
    </Suspense>
  );
}
