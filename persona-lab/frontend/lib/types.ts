export type InsightType = "pain_point" | "unmet_need" | "constraint" | "opportunity";
export type Priority = "high" | "medium" | "low";

export interface Document {
  id: string;
  filename: string;
  extracted_text: string;
  uploaded_at: string;
}

export interface Persona {
  id: string;
  role: string;
  department: string;
  years_experience: number;
  expertise_tags: string[];
  context_notes: string;
  documents: Document[];
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  persona_id: string;
  timestamp: string;
  is_handoff?: boolean;
  handoff_to_persona?: string;
}

export interface Session {
  id: string;
  created_at: string;
  active_persona_id: string;
  persona_sequence: string[];
  template: string;
  messages: Message[];
  insights: InsightCard[] | null;
  requirements: Requirement[] | null;
}

export interface InsightCard {
  id: string;
  type: InsightType;
  title: string;
  body: string;
  source_persona_id: string;
}

export interface Requirement {
  id: string;
  req_id: string;
  statement: string;
  category: string;
  priority: Priority;
  source_insight_id: string;
  source_type: string;
}

export interface InterviewTemplate {
  label: string;
  starter_questions: string[];
}

export const INTERVIEW_TEMPLATES: Record<string, InterviewTemplate> = {
  workflow_pain_points: {
    label: "Workflow pain points",
    starter_questions: [
      "Walk me through your typical day-to-day documentation workflow.",
      "Where do you lose the most time in your current process?",
      "What tools do you use and which ones frustrate you most?",
    ],
  },
  tool_and_system_needs: {
    label: "Tool & system needs",
    starter_questions: [
      "What systems do you interact with daily?",
      "What's missing from your current toolset?",
      "If you could change one thing about your digital tools, what would it be?",
    ],
  },
  data_requirements: {
    label: "Data requirements",
    starter_questions: [
      "What data do you generate that isn't being captured digitally today?",
      "Who consumes the data you produce, and how?",
      "What reports or dashboards would make your job easier?",
    ],
  },
  freeform: {
    label: "Freeform",
    starter_questions: [],
  },
};
