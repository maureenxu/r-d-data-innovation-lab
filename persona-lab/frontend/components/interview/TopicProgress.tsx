import { Message, INTERVIEW_TEMPLATES } from "@/lib/types";

interface TopicProgressProps {
  templateKey: string;
  messages: Message[];
}

export default function TopicProgress({ templateKey, messages }: TopicProgressProps) {
  const template = INTERVIEW_TEMPLATES[templateKey];
  if (!template || template.starter_questions.length === 0) return null;

  const transcript = messages.map((m) => m.content.toLowerCase()).join(" ");

  const keywords: Record<string, string[]> = {
    workflow_pain_points: ["workflow", "document", "time", "frustrat", "tool", "process"],
    tool_and_system_needs: ["system", "tool", "software", "missing", "change", "digital"],
    data_requirements: ["data", "report", "dashboard", "capture", "digital", "export"],
  };
  const kws = keywords[templateKey] ?? [];

  const covered = template.starter_questions.filter((_, i) => {
    const kw = kws[i] ?? kws[0] ?? "";
    return transcript.includes(kw);
  });

  return (
    <div className="flex gap-2 flex-wrap">
      {template.starter_questions.map((q, i) => {
        const done = covered.includes(q);
        return (
          <span
            key={i}
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              done ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
            }`}
            title={q}
          >
            Topic {i + 1}
          </span>
        );
      })}
    </div>
  );
}
