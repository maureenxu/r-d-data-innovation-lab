# Persona Lab — Claude Code Guide

## What this project is
An internal R&D co-design prototype. Data scientists interview AI-powered digital personas of lab technicians to gather workflow requirements — without needing real technician time. Personas are grounded in uploaded documents and free-text knowledge notes.

## Stack
| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) · TypeScript · Tailwind CSS |
| Backend | Python FastAPI · Uvicorn |
| AI responses | Local JSON cache — **no LLM, no API key needed** |
| Storage | Local JSON files (`backend/data/`) |
| Doc parsing | PyMuPDF (`fitz`) for PDF text extraction |

## Project layout
```
persona-lab/
├── frontend/                    # Next.js app (port 3000)
│   ├── app/
│   │   ├── builder/page.tsx     # Persona Builder (admin)
│   │   ├── interview/page.tsx   # Interview Workspace
│   │   └── outputs/page.tsx     # Insights + Requirements
│   ├── components/
│   │   ├── layout/              # AppShell, Sidebar
│   │   ├── builder/             # PersonaForm, KnowledgeBase, StepIndicator
│   │   ├── interview/           # ChatWindow, MessageBubble, PersonaHandoff, TemplateSelector
│   │   └── outputs/             # InsightCard, RequirementsTable
│   └── lib/
│       ├── api.ts               # Typed fetch wrappers (BASE = http://localhost:8000/api)
│       └── types.ts             # Shared TypeScript interfaces
│
└── backend/                     # FastAPI app (port 8000)
    ├── main.py                  # App entry, CORS, router registration
    ├── routers/
    │   ├── personas.py          # CRUD + document upload
    │   ├── sessions.py          # Session management + persona switch
    │   ├── chat.py              # Interview chat (reads from cache)
    │   └── insights.py          # Insight cards + requirements (reads from cache)
    ├── services/
    │   ├── persona_service.py   # Builds persona context string (no LLM call)
    │   ├── document_service.py  # PyMuPDF PDF text extraction
    │   └── cache_service.py     # Replaces claude_service — reads from cache/
    ├── models/schemas.py        # Pydantic v2 models
    ├── storage.py               # JSON read/write helpers
    ├── data/
    │   ├── personas.json        # Runtime persona store (seeded on first run)
    │   └── sessions.json        # Session + message store
    ├── cache/                   # Pre-seeded AI response cache
    │   ├── chat/
    │   │   ├── persona_001.json # Array of in-character responses — cycled per session
    │   │   ├── persona_002.json
    │   │   └── persona_003.json
    │   ├── insights.json        # Static InsightCard array
    │   └── requirements.json    # Static Requirement array
    └── requirements.txt
```

## Running the app

### Backend
```bash
cd persona-lab/backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd persona-lab/frontend
npm install
npm run dev
```

Health check: `curl http://localhost:8000/health`

## Cache system (critical — read this)
There is no LLM. All AI-generated content comes from `backend/cache/`.

### Chat responses (`cache/chat/persona_XXX.json`)
Each file is a JSON array of pre-written in-character responses. `cache_service.py` uses a per-session in-memory counter to cycle through them sequentially. When the end of the array is reached it wraps back to index 0.

```json
[
  "After each stability batch I log results into LIMS using Form ST-22...",
  "The biggest bottleneck for me is the manual transfer from our Excel worksheets..."
]
```

### Insight cards (`cache/insights.json`)
Static array of `InsightCard` objects. Returned for any generate-cards request regardless of session content.

### Requirements (`cache/requirements.json`)
Static array of `Requirement` objects. Returned for any generate-requirements request.

To extend the cache: see `/add-cache-response` command or use the `cache-curator` subagent.

## Key conventions
- **No `anthropic` import anywhere** — `cache_service.py` is the only AI service layer
- All persistent state in `backend/data/*.json` — no database, no ORM
- Frontend calls backend at `http://localhost:8000/api` (hardcoded in `lib/api.ts`)
- Active session ID stored in `localStorage` as `active_session_id`
- Handoff marker messages (`is_handoff: true`) are UI-only — filter them before passing message history to cache service
- Three personas are seeded into `data/personas.json` on first run if the file is empty

## Data model summary
- **Persona** — role, department, years_experience, expertise_tags, context_notes, documents[]
- **Session** — active_persona_id, persona_sequence[], template, messages[], insights, requirements
- **Message** — role (user|assistant), content, persona_id, is_handoff (optional)
- **InsightCard** — type (pain_point|unmet_need|constraint|opportunity), title, body, source_persona_id
- **Requirement** — req_id (REQ-01…), statement, category, priority, source_insight_id

## Build order
1. Backend skeleton + CORS + health endpoint
2. `storage.py` + seed `data/personas.json`
3. Personas CRUD router
4. `cache_service.py` + `cache/` directory with seeded responses
5. Sessions router (create, get, switch-persona)
6. Chat router (uses cache_service)
7. Insights router (uses cache_service)
8. Frontend scaffold — Tailwind, `types.ts`, `api.ts`
9. Sidebar + persona list
10. Persona builder form (steps 1 + 2)
11. Interview workspace (chat, handoff, template selector)
12. Outputs page (insight cards, requirements table, export)

## Acceptance criteria
- Three seeded personas load in sidebar without setup
- Create a new persona with tags, notes, and a PDF upload
- Start interview session, send/receive 5+ messages in character
- Persona switch works — handoff divider appears, next persona responds in its own voice
- Generate insights → at least 3 typed insight cards
- Synthesise requirements → at least 3 REQ-xx rows
- Session persists on page refresh
- API errors shown as inline messages, not silent failures
