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
        <div className="flex-1 flex flex-col items-center justify-center min-h-[55vh] text-center space-y-6 animate-fade-in max-w-3xl mx-auto px-4 md:px-0 w-full py-12">
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-primary mb-1">
            <MessageSquarePlus className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-serif font-normal tracking-tight text-foreground">
              Ask anything about this website
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Ask questions to understand the content, audience, and key information extracted from the page.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-2xl px-2 pt-2">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleAskQuestion(q)}
                className="group relative flex flex-col items-center justify-center p-3.5 rounded-lg bg-card border border-border hover:border-primary/50 hover:bg-accent transition-colors cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
          <div className="max-w-3xl mx-auto px-4 md:px-0 w-full space-y-4">
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
