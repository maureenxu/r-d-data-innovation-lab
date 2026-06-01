"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import ChatWindow from "@/components/interview/ChatWindow";
import TemplateSelector from "@/components/interview/TemplateSelector";
import TopicProgress from "@/components/interview/TopicProgress";
import { Persona, Session, Message } from "@/lib/types";
import { api } from "@/lib/api";

const SESSION_KEY = "active_session_id";

export default function InterviewPage() {
  const router = useRouter();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [showStartModal, setShowStartModal] = useState(false);
  const [showSwitchPanel, setShowSwitchPanel] = useState(false);
  const [selectedPersonaId, setSelectedPersonaId] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("workflow_pain_points");
  const [generatingInsights, setGeneratingInsights] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.getPersonas().then((ps) => {
      setPersonas(ps);
      if (ps.length > 0) setSelectedPersonaId(ps[0].id);
    });

    const savedId = localStorage.getItem(SESSION_KEY);
    if (savedId) {
      api.getSession(savedId)
        .then(setSession)
        .catch(() => {
          localStorage.removeItem(SESSION_KEY);
          loadLatestOrShowModal();
        });
    } else {
      loadLatestOrShowModal();
    }
  }, []);

  function loadLatestOrShowModal() {
    api.listSessions().then((sessions) => {
      if (sessions.length > 0) {
        const latest = sessions[sessions.length - 1];
        setSession(latest);
        localStorage.setItem(SESSION_KEY, latest.id);
      } else {
        setShowStartModal(true);
      }
    }).catch(() => setShowStartModal(true));
  }

  async function startSession() {
    if (!selectedPersonaId) return;
    setError(null);
    try {
      const s = await api.createSession(selectedPersonaId, selectedTemplate);
      setSession(s);
      localStorage.setItem(SESSION_KEY, s.id);
      setShowStartModal(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create session");
    }
  }

  async function sendMessage() {
    if (!input.trim() || !session || loading) return;
    const content = input.trim();
    setInput("");
    setLoading(true);
    setError(null);

    const optimisticUser: Message = {
      id: `tmp_${Date.now()}`,
      role: "user",
      content,
      persona_id: session.active_persona_id,
      timestamp: new Date().toISOString(),
    };
    setSession((s) => s ? { ...s, messages: [...s.messages, optimisticUser] } : s);

    try {
      const res = await api.sendMessage(session.id, content);
      const assistantMsg: Message = {
        id: res.message_id,
        role: "assistant",
        content: res.content,
        persona_id: res.persona_id,
        timestamp: new Date().toISOString(),
      };
      setSession((s) => s ? { ...s, messages: [...s.messages, assistantMsg] } : s);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Message failed");
      setSession((s) => s ? { ...s, messages: s.messages.filter((m) => m.id !== optimisticUser.id) } : s);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  async function handleSwitchPersona(personaId: string) {
    if (!session) return;
    setError(null);
    try {
      const updated = await api.switchPersona(session.id, personaId);
      setSession(updated);
      setShowSwitchPanel(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Switch failed");
    }
  }

  async function handleGenerateInsights() {
    if (!session) return;
    setGeneratingInsights(true);
    setError(null);
    try {
      await api.generateInsightCards(session.id);
      localStorage.setItem(SESSION_KEY, session.id);
      router.push(`/outputs?session=${session.id}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to generate insights");
    } finally {
      setGeneratingInsights(false);
    }
  }

  const activePersona = personas.find((p) => p.id === session?.active_persona_id);
  const realMessages = session?.messages.filter((m) => !m.is_handoff) ?? [];
  const canGenerateInsights = realMessages.length >= 4;

  return (
    <AppShell>
      <div className="flex-1 flex flex-col min-h-0">
        {/* Chrome bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div>
            {activePersona && (
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-900">{activePersona.role}</span>
                <div className="flex gap-1">
                  {activePersona.expertise_tags.slice(0, 3).map((t) => (
                    <span key={t} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-xs">{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {session && (
              <TemplateSelector
                value={session.template}
                onChange={(key) => setSession((s) => s ? { ...s, template: key } : s)}
              />
            )}
            <button
              onClick={() => setShowSwitchPanel(!showSwitchPanel)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Switch persona
            </button>
          </div>
        </div>

        {/* Switch persona panel */}
        {showSwitchPanel && (
          <div className="bg-white border-b border-gray-200 px-6 py-3 flex gap-2 flex-wrap">
            {personas
              .filter((p) => p.id !== session?.active_persona_id)
              .map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSwitchPersona(p.id)}
                  className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-indigo-50 hover:border-indigo-300"
                >
                  <span className="font-medium">{p.role}</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-500">{p.department}</span>
                </button>
              ))}
          </div>
        )}

        {/* Chat area */}
        <ChatWindow
          messages={session?.messages ?? []}
          personas={personas}
          loading={loading}
        />

        {/* Error */}
        {error && (
          <div className="mx-6 mb-2 px-3 py-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Input bar */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex gap-3 items-center mb-3">
            <input
              ref={inputRef}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Ask the next question…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={!session || loading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || !session || loading}
              className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-40"
            >
              Send
            </button>
            {canGenerateInsights && (
              <button
                onClick={handleGenerateInsights}
                disabled={generatingInsights}
                className="px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-40 whitespace-nowrap"
              >
                {generatingInsights ? "Generating…" : "Generate insights ↗"}
              </button>
            )}
          </div>
          {session && (
            <TopicProgress templateKey={session.template} messages={session.messages} />
          )}
        </div>
      </div>

      {/* Start session modal */}
      {showStartModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Start new session</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Persona</label>
                <select
                  value={selectedPersonaId}
                  onChange={(e) => setSelectedPersonaId(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  {personas.map((p) => (
                    <option key={p.id} value={p.id}>{p.role} — {p.department}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
                <TemplateSelector value={selectedTemplate} onChange={setSelectedTemplate} />
              </div>
            </div>
            {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={startSession}
                disabled={!selectedPersonaId}
                className="px-5 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-40"
              >
                Start
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
