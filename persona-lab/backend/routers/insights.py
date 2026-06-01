from fastapi import APIRouter, HTTPException
from uuid import uuid4
from storage import get_sessions, save_sessions
from services.cache_service import get_insight_cards, get_requirements

router = APIRouter()


@router.post("/{session_id}/generate-cards")
def generate_cards(session_id: str):
    sessions = get_sessions()
    session = next((s for s in sessions if s["id"] == session_id), None)
    if not session:
        raise HTTPException(status_code=404, detail=f"Session {session_id} not found")

    cards = get_insight_cards()
    # Stamp each card with a fresh ID so multiple sessions don't share IDs
    stamped = [
        {**card, "id": f"insight_{uuid4().hex[:8]}"}
        for card in cards
    ]
    session["insights"] = stamped
    save_sessions(sessions)
    return {"insights": stamped}


@router.post("/{session_id}/generate-requirements")
def generate_requirements(session_id: str):
    sessions = get_sessions()
    session = next((s for s in sessions if s["id"] == session_id), None)
    if not session:
        raise HTTPException(status_code=404, detail=f"Session {session_id} not found")

    if not session.get("insights"):
        raise HTTPException(
            status_code=400,
            detail="Generate insight cards before synthesising requirements",
        )

    reqs = get_requirements()
    stamped = [
        {**req, "id": f"req_{uuid4().hex[:8]}"}
        for req in reqs
    ]
    session["requirements"] = stamped
    save_sessions(sessions)
    return {"requirements": stamped}


@router.get("/{session_id}")
def get_insights(session_id: str):
    sessions = get_sessions()
    session = next((s for s in sessions if s["id"] == session_id), None)
    if not session:
        raise HTTPException(status_code=404, detail=f"Session {session_id} not found")
    return {
        "insights": session.get("insights"),
        "requirements": session.get("requirements"),
    }
