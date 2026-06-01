from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import personas, sessions, chat, insights

app = FastAPI(title="Persona Lab API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(personas.router, prefix="/api/personas", tags=["personas"])
app.include_router(sessions.router, prefix="/api/sessions", tags=["sessions"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(insights.router, prefix="/api/insights", tags=["insights"])


@app.get("/health")
def health():
    return {"status": "ok"}
