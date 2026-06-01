from fastapi import APIRouter, HTTPException
from datetime import datetime
from uuid import uuid4
from models.schemas import ChatRequest, ChatResponse
from storage import get_sessions, save_sessions, get_personas
from services.cache_service import get_chat_response

router = APIRouter()


@router.post("/{session_id}")
def send_message(session_id: str, data: ChatRequest) -> ChatResponse:
    sessions = get_sessions()
    session = next((s for s in sessions if s["id"] == session_id), None)
    if not session:
        raise HTTPException(status_code=404, detail=f"Session {session_id} not found")

    personas = get_personas()
    persona = next((p for p in personas if p["id"] == session["active_persona_id"]), None)
    if not persona:
        raise HTTPException(status_code=404, detail="Active persona not found")

    now = datetime.utcnow().isoformat() + "Z"

    user_msg = {
        "id": f"msg_{uuid4().hex[:8]}",
        "role": "user",
        "content": data.content,
        "persona_id": session["active_persona_id"],
        "timestamp": now,
        "is_handoff": False,
    }
    session["messages"].append(user_msg)

    response_text = get_chat_response(session["active_persona_id"], session_id)

    assistant_msg = {
        "id": f"msg_{uuid4().hex[:8]}",
        "role": "assistant",
        "content": response_text,
        "persona_id": session["active_persona_id"],
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "is_handoff": False,
    }
    session["messages"].append(assistant_msg)
    save_sessions(sessions)

    return ChatResponse(
        message_id=assistant_msg["id"],
        role="assistant",
        content=response_text,
        persona_id=session["active_persona_id"],
    )
