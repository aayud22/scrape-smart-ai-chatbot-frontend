"use client";

import { cn } from "@/utils/helpers";
import { User, Cpu } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";
import { ChatItem } from "@/types/chat";

interface ChatMessageProps {
  message: ChatItem;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "w-full flex mb-6",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn(
        "flex max-w-[95%] sm:max-w-[85%] md:max-w-[75%] gap-2 sm:gap-3.5",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        {/* Avatar */}
        <div className="shrink-0 mt-0.5">
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-accent border border-border flex items-center justify-center text-muted-foreground">
              <User className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm shadow-primary/20">
              <Cpu className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className={cn(
          "space-y-1.5 min-w-0 flex flex-col",
          isUser ? "items-end" : "items-start"
        )}>
          <div className={cn(
            "text-xs font-medium text-muted-foreground px-1",
            isUser ? "text-right" : "text-left"
          )}>
            {isUser ? "You" : "ScrapeSmart AI"}
          </div>
          
          <div
            className={cn(
              "rounded-2xl px-4 py-3 text-sm leading-relaxed transition-colors",
              isUser
                ? "bg-primary text-primary-foreground rounded-tr-sm shadow-sm"
                : "bg-card text-foreground border border-border rounded-tl-sm shadow-xs"
            )}
          >
            {message.role === "bot" ? (
              <div className="prose-sm max-w-full overflow-x-auto text-foreground">
                <MarkdownRenderer content={message.text} />
              </div>
            ) : (
              <div className="whitespace-pre-wrap break-words">
                {message.text}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
