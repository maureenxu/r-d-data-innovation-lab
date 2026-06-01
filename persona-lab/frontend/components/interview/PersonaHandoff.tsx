import { Persona } from "@/lib/types";

interface PersonaHandoffProps {
  persona: Persona | undefined;
}

export default function PersonaHandoff({ persona }: PersonaHandoffProps) {
  if (!persona) return null;
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-gray-200" />
      <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
        <span>Switched to:</span>
        <span className="font-semibold text-gray-800">{persona.role}</span>
        {persona.expertise_tags.slice(0, 2).map((t) => (
          <span key={t} className="px-1.5 py-0.5 bg-white border border-gray-200 rounded-full text-gray-500">
            {t}
          </span>
        ))}
      </div>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}
