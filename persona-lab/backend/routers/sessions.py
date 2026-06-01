from fastapi import APIRouter, HTTPException
from datetime import datetime
from uuid import uuid4
from models.schemas import SessionCreate, SwitchPersonaRequest
from storage import get_sessions, save_sessions, get_personas

router = APIRouter()


def _find_session(sessions: list, session_id: str) -> dict:
    for s in sessions:
        if s["id"] == session_id:
            return s
    return None


@router.get("")
def list_sessions():
    return get_sessions()


@router.post("", status_code=201)
def create_session(data: SessionCreate):
    personas = get_personas()
    if not any(p["id"] == data.persona_id for p in personas):
        raise HTTPException(status_code=404, detail=f"Persona {data.persona_id} not found")

    sessions = get_sessions()
    now = datetime.utcnow().isoformat() + "Z"
    session = {
        "id": f"session_{uuid4().hex[:8]}",
        "created_at": now,
        "active_persona_id": data.persona_id,
        "persona_sequence": [data.persona_id],
        "template": data.template,
        "messages": [],
        "insights": None,
        "requirements": None,
    }
    sessions.append(session)
    save_sessions(sessions)
    return session


@router.get("/{session_id}")
def get_session(session_id: str):
    session = _find_session(get_sessions(), session_id)
    if not session:
        raise HTTPException(status_code=404, detail=f"Session {session_id} not found")
    return session


@router.post("/{session_id}/switch-persona")
def switch_persona(session_id: str, data: SwitchPersonaRequest):
    sessions = get_sessions()
    session = _find_session(sessions, session_id)
    if not session:
        raise HTTPException(status_code=404, detail=f"Session {session_id} not found")

    personas = get_personas()
    target = next((p for p in personas if p["id"] == data.persona_id), None)
    if not target:
        raise HTTPException(status_code=404, detail=f"Persona {data.persona_id} not found")

    handoff_msg = {
        "id": f"msg_{uuid4().hex[:8]}",
        "role": "system",
        "content": f"Switched to {target['role']}",
        "persona_id": data.persona_id,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "is_handoff": True,
        "handoff_to_persona": data.persona_id,
    }
    session["messages"].append(handoff_msg)
    session["active_persona_id"] = data.persona_id
    if data.persona_id not in session["persona_sequence"]:
        session["persona_sequence"].append(data.persona_id)

    save_sessions(sessions)
    return session
