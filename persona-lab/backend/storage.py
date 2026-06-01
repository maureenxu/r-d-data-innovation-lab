import json
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data"

SEED_PERSONAS = [
    {
        "id": "persona_001",
        "role": "Senior Lab Technician",
        "department": "Formulation R&D",
        "years_experience": 8,
        "expertise_tags": ["HPLC", "pH analysis", "Stability testing", "DOE campaigns"],
        "context_notes": "Works on daily stability runs and documents results in LIMS. Primary concern is throughput and reducing manual steps. Skeptical of new tools unless they integrate with existing systems. Prefers visual dashboards over raw data exports.",
        "documents": [
            {
                "id": "doc_001",
                "filename": "Stability-SOP-v4.pdf",
                "extracted_text": "Standard Operating Procedure: Stability Testing. Version 4. Section 1: Scope. This SOP applies to all stability studies conducted in the Formulation R&D laboratory. Results must be logged within 24 hours of test completion. Section 2: Equipment. HPLC system, pH meter, viscometer. Section 3: Documentation. Results must be entered into LIMS using Form ST-22. Current turnaround target is 30 minutes per batch.",
                "uploaded_at": "2025-05-01T10:00:00Z"
            },
            {
                "id": "doc_002",
                "filename": "Decision-Matrix-2024.pdf",
                "extracted_text": "Formulation Decision Matrix 2024. Go/No-Go criteria: pH 4.5–7.5, viscosity 50–500 cP, stability at 40C for 6 months. Priority escalation: any out-of-spec result triggers immediate supervisor review. Common failure modes: pH drift, particulate formation, viscosity changes beyond 15%.",
                "uploaded_at": "2025-05-01T10:00:00Z"
            }
        ],
        "created_at": "2025-05-01T10:00:00Z",
        "updated_at": "2025-05-01T10:00:00Z"
    },
    {
        "id": "persona_002",
        "role": "Formulation Scientist",
        "department": "Process Chemistry",
        "years_experience": 5,
        "expertise_tags": ["API synthesis", "Excipient selection", "Scale-up", "QbD"],
        "context_notes": "Focuses on early-stage formulation development. Comfortable with data analysis tools. Main frustration is lack of visibility into upstream raw material quality before it affects formulation work. Interested in predictive modelling but lacks the time to set it up.",
        "documents": [
            {
                "id": "doc_003",
                "filename": "Formulation-Development-Guide.pdf",
                "extracted_text": "Formulation Development Guide. Stage 1: Preformulation. Physicochemical characterisation of API. Stage 2: Prototype development. Selection of excipients based on compatibility studies. Stage 3: Optimisation. DOE-driven parameter optimisation. Key decision points: solubility threshold, stability profile at accelerated conditions, manufacturability assessment.",
                "uploaded_at": "2025-05-02T10:00:00Z"
            }
        ],
        "created_at": "2025-05-02T10:00:00Z",
        "updated_at": "2025-05-02T10:00:00Z"
    },
    {
        "id": "persona_003",
        "role": "QA Analyst",
        "department": "Regulatory & Audit",
        "years_experience": 6,
        "expertise_tags": ["GMP compliance", "Audit management", "CAPA", "Documentation review"],
        "context_notes": "Responsible for review and sign-off of all stability reports before regulatory submission. Main pain point is receiving incomplete or non-compliant reports that require multiple revision cycles. Values standardisation and traceability above all else.",
        "documents": [
            {
                "id": "doc_004",
                "filename": "QA-Review-Checklist.pdf",
                "extracted_text": "QA Review Checklist for Stability Reports. Required fields: batch number, test date, operator ID, equipment calibration reference, raw data attachment, out-of-spec justification if applicable. Common non-conformances: missing calibration reference (34% of rejections), raw data not attached (28%), incorrect form version (18%).",
                "uploaded_at": "2025-05-03T10:00:00Z"
            }
        ],
        "created_at": "2025-05-03T10:00:00Z",
        "updated_at": "2025-05-03T10:00:00Z"
    }
]


def _ensure_data_dir():
    DATA_DIR.mkdir(exist_ok=True)


def read_json(filename: str) -> list | dict:
    path = DATA_DIR / filename
    if not path.exists():
        return []
    with open(path, "r") as f:
        return json.load(f)


def write_json(filename: str, data: list | dict) -> None:
    _ensure_data_dir()
    path = DATA_DIR / filename
    with open(path, "w") as f:
        json.dump(data, f, indent=2, default=str)


def get_personas() -> list:
    data = read_json("personas.json")
    if not data:
        save_personas(SEED_PERSONAS)
        return SEED_PERSONAS
    return data


def save_personas(personas: list) -> None:
    write_json("personas.json", personas)


DEMO_SESSION_ID = "session_demo"

SEED_SESSION = {
    "id": DEMO_SESSION_ID,
    "created_at": "2025-05-28T09:00:00Z",
    "active_persona_id": "persona_003",
    "persona_sequence": ["persona_001", "persona_003"],
    "template": "workflow_pain_points",
    "messages": [
        {
            "id": "msg_d001",
            "role": "user",
            "content": "Walk me through your typical day-to-day documentation workflow.",
            "persona_id": "persona_001",
            "timestamp": "2025-05-28T09:01:00Z",
            "is_handoff": False
        },
        {
            "id": "msg_d002",
            "role": "assistant",
            "content": "After each stability batch I log results into LIMS using Form ST-22. That's the mandatory step — results must be entered within 24 hours per our SOP. What kills me is that I've already written everything down on the bench sheet, so I'm basically transcribing the same numbers twice. On a heavy day with three batches running, that's close to an hour of just copying data.",
            "persona_id": "persona_001",
            "timestamp": "2025-05-28T09:01:05Z",
            "is_handoff": False
        },
        {
            "id": "msg_d003",
            "role": "user",
            "content": "Where do you lose the most time in your current process?",
            "persona_id": "persona_001",
            "timestamp": "2025-05-28T09:03:00Z",
            "is_handoff": False
        },
        {
            "id": "msg_d004",
            "role": "assistant",
            "content": "Honestly? The biggest bottleneck is the Excel-to-LIMS transfer. We have a spreadsheet template we've been using for years, everyone knows it, the calculations are all built in. But LIMS won't accept a direct import — every field has to be entered manually through the web interface. I've raised this three times in the last two years. The answer is always 'it's on the roadmap.'",
            "persona_id": "persona_001",
            "timestamp": "2025-05-28T09:03:08Z",
            "is_handoff": False
        },
        {
            "id": "msg_d005",
            "role": "user",
            "content": "What happens when you get an out-of-spec result during a stability run?",
            "persona_id": "persona_001",
            "timestamp": "2025-05-28T09:05:00Z",
            "is_handoff": False
        },
        {
            "id": "msg_d006",
            "role": "assistant",
            "content": "pH drift is the most common failure mode we see. The Decision Matrix sets the go/no-go threshold at pH 4.5 to 7.5, and anything outside that triggers a supervisor review. When that happens I have to stop everything, write up a deviation report, and wait for sign-off before the batch can proceed. The whole process can take half a day if the supervisor is in meetings.",
            "persona_id": "persona_001",
            "timestamp": "2025-05-28T09:05:06Z",
            "is_handoff": False
        },
        {
            "id": "msg_d007",
            "role": "user",
            "content": "How do you currently track which stability samples are due for testing?",
            "persona_id": "persona_001",
            "timestamp": "2025-05-28T09:07:00Z",
            "is_handoff": False
        },
        {
            "id": "msg_d008",
            "role": "assistant",
            "content": "I maintain a manual tracker in Excel to know which samples are due for which timepoint. If a sample gets missed, I only find out when the timepoint window closes. An automated alert system would save us from at least two near-misses a month. It's not in any SOP — that knowledge just lives in my spreadsheet.",
            "persona_id": "persona_001",
            "timestamp": "2025-05-28T09:07:09Z",
            "is_handoff": False
        },
        {
            "id": "msg_d009",
            "role": "system",
            "content": "Switched to QA Analyst",
            "persona_id": "persona_003",
            "timestamp": "2025-05-28T09:10:00Z",
            "is_handoff": True,
            "handoff_to_persona": "persona_003"
        },
        {
            "id": "msg_d010",
            "role": "user",
            "content": "From the QA side, what are the most common reasons a stability report gets rejected on first review?",
            "persona_id": "persona_003",
            "timestamp": "2025-05-28T09:11:00Z",
            "is_handoff": False
        },
        {
            "id": "msg_d011",
            "role": "assistant",
            "content": "The most common reason is a missing or mismatched calibration reference — that's 34% of our rejections. The calibration reference number must match the current service record. Scientists forget it, or copy it from a previous report and it's out of date. Every rejection adds at least two days to the submission timeline.",
            "persona_id": "persona_003",
            "timestamp": "2025-05-28T09:11:07Z",
            "is_handoff": False
        },
        {
            "id": "msg_d012",
            "role": "user",
            "content": "What would an ideal submission process look like from your end?",
            "persona_id": "persona_003",
            "timestamp": "2025-05-28T09:13:00Z",
            "is_handoff": False
        },
        {
            "id": "msg_d013",
            "role": "assistant",
            "content": "A system that validates required fields before submission, flags missing attachments, and confirms the form version is current. I'd only receive complete, validated reports for substantive review. Right now I'm doing all that validation manually, which is slow and introduces human error.",
            "persona_id": "persona_003",
            "timestamp": "2025-05-28T09:13:05Z",
            "is_handoff": False
        },
        {
            "id": "msg_d014",
            "role": "user",
            "content": "How much time does audit preparation currently take you?",
            "persona_id": "persona_003",
            "timestamp": "2025-05-28T09:15:00Z",
            "is_handoff": False
        },
        {
            "id": "msg_d015",
            "role": "assistant",
            "content": "Two weeks of full-time effort, because the audit trail is fragmented across systems. If I could generate a complete, traceable record for any batch in one click, that drops to two days. That's the single most valuable thing I can imagine from a digital tools perspective.",
            "persona_id": "persona_003",
            "timestamp": "2025-05-28T09:15:08Z",
            "is_handoff": False
        }
    ],
    "insights": [
        {
            "id": "insight_d001",
            "type": "pain_point",
            "title": "Manual LIMS data transcription",
            "body": "Lab technicians transcribe the same results twice — bench sheets then LIMS Form ST-22. On heavy days with 3 batches running, this costs close to an hour of non-value work per technician.",
            "source_persona_id": "persona_001"
        },
        {
            "id": "insight_d002",
            "type": "pain_point",
            "title": "No direct Excel-to-LIMS import",
            "body": "A widely used Excel template with built-in calculations exists, but LIMS requires manual field-by-field re-entry. Direct bulk import has been requested for 2+ years without delivery.",
            "source_persona_id": "persona_001"
        },
        {
            "id": "insight_d003",
            "type": "pain_point",
            "title": "Out-of-spec sign-off halts workflows",
            "body": "Any pH result outside 4.5–7.5 triggers a deviation report and supervisor sign-off, which can take half a day. The wait is entirely unstructured — no SLA or automated escalation.",
            "source_persona_id": "persona_001"
        },
        {
            "id": "insight_d004",
            "type": "unmet_need",
            "title": "Automated stability timepoint alerts",
            "body": "Sample due-dates are tracked in a personal Excel sheet with no automated reminders. Missed timepoint windows occur at least twice a month and are only caught after the window closes.",
            "source_persona_id": "persona_001"
        },
        {
            "id": "insight_d005",
            "type": "pain_point",
            "title": "Calibration mismatch causes 34% of rejections",
            "body": "Missing or out-of-date calibration reference numbers are the top rejection reason. Scientists copy stale references from prior reports; the system provides no warning at submission time.",
            "source_persona_id": "persona_003"
        },
        {
            "id": "insight_d006",
            "type": "opportunity",
            "title": "Pre-submission validation cuts rework cycles",
            "body": "A gate that validates required fields, checks form version, and confirms attachments before submission could eliminate the majority of first-review rejections, each of which costs at least two days.",
            "source_persona_id": "persona_003"
        },
        {
            "id": "insight_d007",
            "type": "constraint",
            "title": "Audit trail fragmented across systems",
            "body": "Generating a traceable batch record requires pulling data from at least three systems. Audit preparation currently takes two full weeks; a unified view would reduce this to two days.",
            "source_persona_id": "persona_003"
        }
    ],
    "requirements": [
        {
            "id": "req_d001",
            "req_id": "REQ-01",
            "statement": "System must support bulk import from existing Excel templates into LIMS, eliminating manual field-by-field re-entry for stability batch results.",
            "category": "Integration",
            "priority": "high",
            "source_insight_id": "insight_d002",
            "source_type": "pain_point"
        },
        {
            "id": "req_d002",
            "req_id": "REQ-02",
            "statement": "System must validate equipment calibration reference numbers against current service records at submission time and block submission if a mismatch is detected.",
            "category": "Quality",
            "priority": "high",
            "source_insight_id": "insight_d005",
            "source_type": "pain_point"
        },
        {
            "id": "req_d003",
            "req_id": "REQ-03",
            "statement": "System must perform pre-submission validation of stability reports — checking required fields, form version currency, and raw data attachment — and prevent submission of incomplete records.",
            "category": "Quality",
            "priority": "high",
            "source_insight_id": "insight_d006",
            "source_type": "opportunity"
        },
        {
            "id": "req_d004",
            "req_id": "REQ-04",
            "statement": "System must send automated alerts to assigned technicians when a stability sample timepoint window opens, with a configurable lead time before the window closes.",
            "category": "Automation",
            "priority": "high",
            "source_insight_id": "insight_d004",
            "source_type": "unmet_need"
        },
        {
            "id": "req_d005",
            "req_id": "REQ-05",
            "statement": "System must route out-of-spec deviation reports to supervisors with a defined SLA and automated escalation if sign-off is not completed within the SLA window.",
            "category": "Automation",
            "priority": "medium",
            "source_insight_id": "insight_d003",
            "source_type": "pain_point"
        },
        {
            "id": "req_d006",
            "req_id": "REQ-06",
            "statement": "System must generate a complete, auditable batch record — including instrument data, operator history, and active SOP version — in a single exportable view within 2 minutes.",
            "category": "Reporting",
            "priority": "medium",
            "source_insight_id": "insight_d007",
            "source_type": "constraint"
        }
    ]
}


def get_sessions() -> list:
    data = read_json("sessions.json")
    if not data:
        seed = [SEED_SESSION]
        save_sessions(seed)
        return seed
    return data


def save_sessions(sessions: list) -> None:
    write_json("sessions.json", sessions)
