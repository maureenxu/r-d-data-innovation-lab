Scaffold a new lab persona — seed data entry + matching chat cache file.

Usage: /new-persona "<role>" "<department>"

Example: /new-persona "Analytical Chemist" "QC Testing"

## What to do

1. Read `persona-lab/backend/data/personas.json` to see existing personas and determine the next ID (e.g. `persona_004`)
2. Read existing cache files in `persona-lab/backend/cache/chat/` to understand the response style and depth expected
3. Create a realistic persona object and append it to `personas.json`:
   - `id`: next sequential ID (`persona_004`, etc.)
   - `role`: from argument
   - `department`: from argument
   - `years_experience`: realistic number for the role (5–12 range typical)
   - `expertise_tags`: 4–5 domain-specific tags relevant to the role
   - `context_notes`: 2–3 sentences describing daily work, primary frustrations, and attitude toward new tools
   - `documents`: empty array `[]`
   - `created_at` / `updated_at`: current ISO timestamp

4. Create `persona-lab/backend/cache/chat/<new_id>.json` with at least 8 pre-written in-character responses covering:
   - Daily workflow description
   - A pain point with concrete detail (time lost, manual steps)
   - A tool or system they depend on and its limitations
   - A workaround they've developed
   - What they'd want from a better system
   - A constraint or compliance requirement they work under
   - A positive aspect of their current process (not everything is broken)
   - A response to a data/reporting question

5. Report the new persona ID, a summary of the persona profile, and the number of cache responses written.

## Quality bar
- Expertise tags must be real domain terms for the role, not generic words
- context_notes must contain at least one named tool or process (e.g. "LIMS", "ICH Q1A", "GC-MS")
- Cache responses must feel distinct from other personas in vocabulary and concerns
