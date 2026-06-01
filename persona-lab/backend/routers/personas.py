from fastapi import APIRouter, HTTPException, UploadFile, File
from datetime import datetime
from uuid import uuid4
from models.schemas import PersonaCreate, PersonaUpdate
from storage import get_personas, save_personas
from services.document_service import extract_text

router = APIRouter()


def _find_persona(personas: list, persona_id: str) -> dict:
    for p in personas:
        if p["id"] == persona_id:
            return p
    return None


@router.get("")
def list_personas():
    return get_personas()


@router.get("/{persona_id}")
def get_persona(persona_id: str):
    persona = _find_persona(get_personas(), persona_id)
    if not persona:
        raise HTTPException(status_code=404, detail=f"Persona {persona_id} not found")
    return persona


@router.post("", status_code=201)
def create_persona(data: PersonaCreate):
    personas = get_personas()
    now = datetime.utcnow().isoformat() + "Z"
    persona = {
        "id": f"persona_{uuid4().hex[:8]}",
        "role": data.role,
        "department": data.department,
        "years_experience": data.years_experience,
        "expertise_tags": data.expertise_tags,
        "context_notes": data.context_notes,
        "documents": [],
        "created_at": now,
        "updated_at": now,
    }
    personas.append(persona)
    save_personas(personas)
    return persona


@router.put("/{persona_id}")
def update_persona(persona_id: str, data: PersonaUpdate):
    personas = get_personas()
    persona = _find_persona(personas, persona_id)
    if not persona:
        raise HTTPException(status_code=404, detail=f"Persona {persona_id} not found")
    update = data.model_dump(exclude_none=True)
    persona.update(update)
    persona["updated_at"] = datetime.utcnow().isoformat() + "Z"
    save_personas(personas)
    return persona


@router.delete("/{persona_id}", status_code=204)
def delete_persona(persona_id: str):
    personas = get_personas()
    filtered = [p for p in personas if p["id"] != persona_id]
    if len(filtered) == len(personas):
        raise HTTPException(status_code=404, detail=f"Persona {persona_id} not found")
    save_personas(filtered)


@router.post("/{persona_id}/documents", status_code=201)
async def upload_document(persona_id: str, file: UploadFile = File(...)):
    personas = get_personas()
    persona = _find_persona(personas, persona_id)
    if not persona:
        raise HTTPException(status_code=404, detail=f"Persona {persona_id} not found")

    file_bytes = await file.read()
    extracted = extract_text(file.filename, file_bytes)

    doc = {
        "id": f"doc_{uuid4().hex[:8]}",
        "filename": file.filename,
        "extracted_text": extracted,
        "uploaded_at": datetime.utcnow().isoformat() + "Z",
    }
    persona["documents"].append(doc)
    persona["updated_at"] = datetime.utcnow().isoformat() + "Z"
    save_personas(personas)
    return doc
