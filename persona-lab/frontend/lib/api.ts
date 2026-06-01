import { Persona, Session, InsightCard, Requirement } from "./types";

const BASE = "http://localhost:8000/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Personas
  getPersonas: () => request<Persona[]>("/personas"),
  getPersona: (id: string) => request<Persona>(`/personas/${id}`),
  createPersona: (data: Partial<Persona>) =>
    request<Persona>("/personas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  updatePersona: (id: string, data: Partial<Persona>) =>
    request<Persona>(`/personas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  deletePersona: (id: string) =>
    fetch(`${BASE}/personas/${id}`, { method: "DELETE" }),
  uploadDocument: (personaId: string, file: File) => {
    const form = new FormData();
    form.append("file", file);
    return request<{ id: string; filename: string }>(`/personas/${personaId}/documents`, {
      method: "POST",
      body: form,
    });
  },

  // Sessions
  listSessions: () => request<Session[]>("/sessions"),
  createSession: (personaId: string, template: string) =>
    request<Session>("/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ persona_id: personaId, template }),
    }),
  getSession: (id: string) => request<Session>(`/sessions/${id}`),
  switchPersona: (sessionId: string, personaId: string) =>
    request<Session>(`/sessions/${sessionId}/switch-persona`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ persona_id: personaId }),
    }),

  // Chat
  sendMessage: (sessionId: string, content: string) =>
    request<{ message_id: string; role: string; content: string; persona_id: string }>(
      `/chat/${sessionId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      }
    ),

  // Insights
  generateInsightCards: (sessionId: string) =>
    request<{ insights: InsightCard[] }>(`/insights/${sessionId}/generate-cards`, {
      method: "POST",
    }),
  generateRequirements: (sessionId: string) =>
    request<{ requirements: Requirement[] }>(`/insights/${sessionId}/generate-requirements`, {
      method: "POST",
    }),
  getInsights: (sessionId: string) =>
    request<{ insights: InsightCard[] | null; requirements: Requirement[] | null }>(
      `/insights/${sessionId}`
    ),
};
