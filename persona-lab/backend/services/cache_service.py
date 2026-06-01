import json
from pathlib import Path

CACHE_DIR = Path(__file__).parent.parent / "cache"

# Per-session message index: {session_id: {persona_id: int}}
_session_counters: dict[str, dict[str, int]] = {}


def _load_chat_responses(persona_id: str) -> list[str]:
    path = CACHE_DIR / "chat" / f"{persona_id}.json"
    if not path.exists():
        return [
            "I'd need a bit more context to answer that properly.",
            "That's an interesting question — let me think about how it relates to my day-to-day.",
            "In my experience, the answer depends heavily on which system we're talking about.",
        ]
    with open(path) as f:
        return json.load(f)


def get_chat_response(persona_id: str, session_id: str) -> str:
    responses = _load_chat_responses(persona_id)
    counters = _session_counters.setdefault(session_id, {})
    idx = counters.get(persona_id, 0)
    response = responses[idx % len(responses)]
    counters[persona_id] = idx + 1
    return response


def get_insight_cards() -> list[dict]:
    path = CACHE_DIR / "insights.json"
    with open(path) as f:
        return json.load(f)


def get_requirements() -> list[dict]:
    path = CACHE_DIR / "requirements.json"
    with open(path) as f:
        return json.load(f)
