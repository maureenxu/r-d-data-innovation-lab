"use client";

import { useRef, useEffect } from "react";
import { Message, Persona } from "@/lib/types";
import MessageBubble from "./MessageBubble";
import PersonaHandoff from "./PersonaHandoff";

interface ChatWindowProps {
  messages: Message[];
  personas: Persona[];
  loading: boolean;
}

export default function ChatWindow({ messages, personas, loading }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function personaFor(id: string) {
    return personas.find((p) => p.id === id);
  }

  function shouldShowLabel(messages: Message[], index: number) {
    if (messages[index].role === "user") return false;
    if (index === 0) return true;
    const prev = messages[index - 1];
    return prev.is_handoff || prev.persona_id !== messages[index].persona_id || prev.role === "user";
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4">
      {messages.map((msg, i) => {
        if (msg.is_handoff) {
          return (
            <PersonaHandoff
              key={msg.id}
              persona={personaFor(msg.handoff_to_persona ?? msg.persona_id)}
            />
          );
        }
        return (
          <MessageBubble
            key={msg.id}
            message={msg}
            personaRole={personaFor(msg.persona_id)?.role}
            showLabel={shouldShowLabel(messages, i)}
          />
        );
      })}
      {loading && (
        <div className="flex justify-start mb-3">
          <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
            <div className="flex gap-1 items-center h-4">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
