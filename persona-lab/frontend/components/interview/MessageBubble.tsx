import { Message } from "@/lib/types";

interface MessageBubbleProps {
  message: Message;
  personaRole?: string;
  showLabel: boolean;
}

export default function MessageBubble({ message, personaRole, showLabel }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div className={`max-w-[72%] ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        {!isUser && showLabel && personaRole && (
          <span className="text-xs text-gray-500 font-medium mb-1 ml-1">{personaRole}</span>
        )}
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? "bg-indigo-600 text-white rounded-br-sm"
              : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"
          }`}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}
