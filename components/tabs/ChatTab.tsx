import React, { RefObject } from "react";
import ChatMessage from "@/components/ChatMessage";
import LoadingIndicator from "@/components/LoadingIndicator";
import { MessageSquarePlus } from "lucide-react";
import { ChatItem } from "@/types/chat";

interface ChatTabProps {
  chatHistory: ChatItem[];
  isLoading: boolean;
  suggestedQuestions: string[];
  handleAskQuestion: (q: string) => void;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

export default function ChatTab({
  chatHistory,
  isLoading,
  suggestedQuestions,
  handleAskQuestion,
  messagesEndRef,
}: ChatTabProps) {
  return (
    <div className="flex flex-col flex-1 min-h-0 w-full">
      {chatHistory.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-fade-in max-w-4xl mx-auto px-4 md:px-0 w-full">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-2">
            <MessageSquarePlus className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Ask anything about this website
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Ask questions to understand the content, audience, and key information extracted from the page.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-2xl px-4 pt-4">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleAskQuestion(q)}
                className="group relative flex flex-col items-center justify-center p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-accent/40 transition-all cursor-pointer shadow-sm active:scale-95 text-left"
              >
                <div className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                  {q}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 py-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="max-w-4xl mx-auto px-4 md:px-0 w-full space-y-4">
            {chatHistory.map((chat) => (
              <ChatMessage key={chat.id} message={chat} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-6">
                <LoadingIndicator />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}
    </div>
  );
}
