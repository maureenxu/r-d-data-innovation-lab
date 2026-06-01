def build_persona_context(persona: dict) -> str:
    doc_context = "\n\n".join([
        f"--- Document: {doc['filename']} ---\n{doc['extracted_text']}"
        for doc in persona.get("documents", [])
    ])
    tags = ", ".join(persona.get("expertise_tags", []))
    return (
        f"Role: {persona['role']} | Department: {persona['department']} | "
        f"Experience: {persona['years_experience']} years | Expertise: {tags}\n"
        f"Context: {persona.get('context_notes', '')}\n"
        f"Documents:\n{doc_context}"
    )
