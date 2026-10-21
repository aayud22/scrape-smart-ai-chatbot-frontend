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
      <div
        className={cn(
          "flex gap-3 max-w-full",
          isUser ? "flex-row-reverse max-w-[85%] sm:max-w-[75%]" : "flex-row w-full max-w-[68ch]"
        )}
      >
        {/* Avatar */}
        <div className="shrink-0 mt-0.5">
          {isUser ? (
            <div className="w-7 h-7 rounded-full bg-accent border border-border flex items-center justify-center text-muted-foreground">
              <User className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Cpu className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        {/* Content */}
        <div
          className={cn(
            "min-w-0 flex flex-col space-y-1",
            isUser ? "items-end" : "items-start w-full"
          )}
        >
          <div
            className={cn(
              "text-xs font-medium text-muted-foreground px-0.5",
              isUser ? "text-right" : "text-left"
            )}
          >
            {isUser ? "You" : "ScrapeSmart AI"}
          </div>

          {isUser ? (
            <div className="bg-accent text-foreground border border-border/60 rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm leading-relaxed max-w-[65ch] whitespace-pre-wrap break-words">
              {message.text}
            </div>
          ) : (
            <div className="text-foreground text-sm sm:text-base leading-relaxed max-w-[65ch] w-full pt-0.5">
              <MarkdownRenderer content={message.text} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
