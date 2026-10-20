import React from "react";
import ReactMarkdown from "react-markdown";

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        p: (props) => (
          <p className="mb-2.5 leading-relaxed text-foreground" {...props} />
        ),
        strong: (props) => (
          <strong className="font-semibold text-foreground" {...props} />
        ),
        ul: (props) => (
          <ul
            className="list-disc pl-5 mb-3 space-y-1 text-foreground"
            {...props}
          />
        ),
        ol: (props) => (
          <ol
            className="list-decimal pl-5 mb-3 space-y-1 text-foreground"
            {...props}
          />
        ),
        li: (props) => <li className="leading-relaxed" {...props} />,
        h1: (props) => (
          <h1
            className="text-lg font-bold text-foreground mt-4 mb-2 tracking-tight"
            {...props}
          />
        ),
        h2: (props) => (
          <h2
            className="text-base font-bold text-foreground mt-3 mb-1.5 tracking-tight"
            {...props}
          />
        ),
        h3: (props) => (
          <h3
            className="text-sm font-semibold text-foreground mt-3 mb-1 tracking-tight"
            {...props}
          />
        ),
        a: (props) => (
          <a
            className="text-primary hover:underline font-medium"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
        code: ({ className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || "");
          const isInline = !className;
          return isInline ? (
            <code
              className="bg-accent text-foreground px-1.5 py-0.5 rounded text-xs font-mono font-medium border border-border"
              {...props}
            >
              {children}
            </code>
          ) : (
            <div className="my-3 rounded-xl overflow-hidden bg-accent/40 border border-border">
              <div className="flex items-center px-3.5 py-1.5 bg-muted/60 text-xs font-mono text-muted-foreground border-b border-border">
                {match ? match[1] : "code"}
              </div>
              <pre className="p-3.5 overflow-x-auto text-xs font-mono text-foreground">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            </div>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
