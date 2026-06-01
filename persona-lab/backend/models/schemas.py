from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class DocumentSchema(BaseModel):
    id: str
    filename: str
    extracted_text: str
    uploaded_at: str


class PersonaCreate(BaseModel):
    role: str
    department: str
    years_experience: int
    expertise_tags: list[str] = []
    context_notes: str = ""


class PersonaUpdate(BaseModel):
    role: Optional[str] = None
    department: Optional[str] = None
    years_experience: Optional[int] = None
    expertise_tags: Optional[list[str]] = None
    context_notes: Optional[str] = None


class PersonaSchema(BaseModel):
    id: str
    role: str
    department: str
    years_experience: int
    expertise_tags: list[str]
    context_notes: str
    documents: list[DocumentSchema] = []
    created_at: str
    updated_at: str


class MessageSchema(BaseModel):
    id: str
    role: str
    content: str
    persona_id: str
    timestamp: str
    is_handoff: bool = False
    handoff_to_persona: Optional[str] = None


class SessionCreate(BaseModel):
    persona_id: str
    template: str = "freeform"


class SwitchPersonaRequest(BaseModel):
    persona_id: str


class SessionSchema(BaseModel):
    id: str
    created_at: str
    active_persona_id: str
    persona_sequence: list[str]
    template: str
    messages: list[MessageSchema] = []
    insights: Optional[list[dict]] = None
    requirements: Optional[list[dict]] = None


class ChatRequest(BaseModel):
    content: str


class ChatResponse(BaseModel):
    message_id: str
    role: str
    content: str
    persona_id: str
