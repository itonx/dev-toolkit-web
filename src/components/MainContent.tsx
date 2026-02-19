import { type ReactNode } from "react";
import type { Tool } from "../types/tool";

interface MainContentProps {
  tool?: Tool;
  children: ReactNode;
}

/**
 * MainContent - Main content area for displaying active tool
 * Implements animated gradient background and content transitions
 */
export function MainContent({ tool, children }: MainContentProps) {
  return (
    <main
      className="flex-1 h-full overflow-hidden relative animate-gradient"
      style={{
        backgroundColor: "var(--color-background)",
      }}
    >
      {/* Scroll Progress Indicator */}
      <div
        className="absolute top-0 left-0 right-0 h-1 z-10"
        style={{ backgroundColor: "var(--color-border)" }}
      >
        <div
          id="scroll-progress"
          className="h-full transition-all duration-150"
          style={{
            backgroundColor: "var(--color-accent)",
            width: "0%",
          }}
        />
      </div>

      {/* Content Container */}
      <div
        className="h-full overflow-y-auto px-8 py-6"
        onScroll={(e) => {
          const target = e.currentTarget;
          const scrollProgress =
            (target.scrollTop / (target.scrollHeight - target.clientHeight)) *
            100;
          const progressBar = document.getElementById("scroll-progress");
          if (progressBar) {
            progressBar.style.width = `${Math.min(scrollProgress, 100)}%`;
          }
        }}
      >
        {/* Tool Header */}
        {tool && (
          <header className="mb-8 animate-slide-in-right stagger-1">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{tool.icon}</span>
              <div>
                <h1
                  className="text-2xl font-bold"
                  style={{ color: "var(--color-text)" }}
                >
                  {tool.name}
                </h1>
                <p style={{ color: "var(--color-muted)" }}>
                  {tool.description}
                </p>
              </div>
            </div>
          </header>
        )}

        {/* Tool Content */}
        <div className="animate-slide-in-right stagger-2">{children}</div>
      </div>
    </main>
  );
}
