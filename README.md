# Persona Lab

An internal R&D co-design prototype that lets data scientists interview AI-powered digital personas of lab technicians — gathering workflow requirements without needing real technician time. Personas are grounded in uploaded documents and free-text knowledge notes.

## How it works

1. **Build** a persona — define a lab technician's role, department, experience, expertise tags, and knowledge notes. Optionally upload PDF documents for context.
2. **Interview** — start a session and chat with the persona in character. Switch between multiple personas mid-session with a handoff divider.
3. **Synthesise** — generate structured insight cards (pain points, unmet needs, constraints, opportunities) and formal requirements (REQ-01…) exportable from the outputs page.

Responses come from a pre-seeded local JSON cache — no LLM, no API key needed.

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 · TypeScript · Tailwind CSS |
| Backend | Python FastAPI · Uvicorn |
| AI responses | Local JSON cache (no LLM) |
| Storage | Local JSON files (`backend/data/`) |
| Doc parsing | PyMuPDF for PDF text extraction |

## Project layout

```
persona-lab/
├── frontend/                    # Next.js app (port 3000)
│   ├── app/
│   │   ├── builder/             # Persona Builder (admin)
│   │   ├── interview/           # Interview Workspace
│   │   └── outputs/             # Insights + Requirements
│   ├── components/
│   │   ├── layout/              # AppShell, Sidebar
│   │   ├── builder/             # PersonaForm, KnowledgeBase, StepIndicator
│   │   ├── interview/           # ChatWindow, MessageBubble, PersonaHandoff, TemplateSelector
│   │   └── outputs/             # InsightCard, RequirementsTable
│   └── lib/
│       ├── api.ts               # Typed fetch wrappers
│       └── types.ts             # Shared TypeScript interfaces
│
└── backend/                     # FastAPI app (port 8000)
    ├── main.py                  # App entry, CORS, router registration
    ├── routers/                 # personas, sessions, chat, insights
    ├── services/                # persona_service, document_service, cache_service
    ├── models/schemas.py        # Pydantic v2 models
    ├── storage.py               # JSON read/write helpers
    ├── data/                    # Runtime JSON store (personas, sessions)
    └── cache/                   # Pre-seeded AI response cache
        ├── chat/                # Per-persona response arrays
        ├── insights.json        # Static insight cards
        └── requirements.json    # Static requirements
```

## Running the app

**Backend** (port 8000):
```bash
cd persona-lab/backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend** (port 3000):
```bash
cd persona-lab/frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Health check: `curl http://localhost:8000/health`

Three personas are seeded automatically on first run — no setup required.

## Cache system

All AI responses come from `backend/cache/` — there is no LLM involved.

- **`cache/chat/persona_XXX.json`** — array of pre-written in-character responses, cycled per session
- **`cache/insights.json`** — static insight cards returned for any generate-cards request
- **`cache/requirements.json`** — static requirements returned for any generate-requirements request

To add new cached responses, use the `/add-cache-response` Claude Code command or the `cache-curator` subagent.

## Data model

| Entity | Key fields |
|---|---|
| Persona | role, department, years_experience, expertise_tags, context_notes, documents[] |
| Session | active_persona_id, persona_sequence[], template, messages[], insights, requirements |
| Message | role (user\|assistant), content, persona_id, is_handoff |
| InsightCard | type (pain_point\|unmet_need\|constraint\|opportunity), title, body, source_persona_id |
| Requirement | req_id (REQ-01…), statement, category, priority, source_insight_id |
