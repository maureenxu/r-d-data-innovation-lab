Add a new pre-written response to a persona's chat cache file.

Usage: /add-cache-response <persona_id> "<response text>"

Example: /add-cache-response persona_001 "The HPLC calibration logs are the biggest source of rework for us..."

## What to do

1. Read the target cache file at `persona-lab/backend/cache/chat/<persona_id>.json`
2. Read the persona profile from `persona-lab/backend/data/personas.json` to understand their role, expertise, and tone
3. If the user provided response text as an argument, validate that it sounds in-character for this persona (matches their domain language, frustrations, and communication style described in context_notes)
4. If no text was provided, write a new realistic in-character response yourself based on the persona's profile and the existing responses in their cache file as style reference
5. Append the new response string to the JSON array
6. Write the updated file back
7. Report: which file was updated, what was added, and the new total response count

## Quality bar for cached responses
- Reference specific tools, systems, or procedures from the persona's documents or expertise tags
- Include concrete details: numbers, time estimates, named systems (LIMS, HPLC, etc.)
- Reflect the persona's attitude (skeptical, frustrated, pragmatic, detail-oriented) from context_notes
- 2–5 sentences — busy professional, not academic
- Never break character or sound like a generic AI assistant
