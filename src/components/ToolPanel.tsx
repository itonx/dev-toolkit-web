import { useState, useEffect, useRef, useCallback } from "react";
import type { ToolDefinition } from "./App";

interface ToolPanelProps {
  tool: ToolDefinition;
}

/**
 * Main content panel that renders the active tool.
 * Handles Slide+Fade content swap, skeleton loading placeholder,
 * scroll progress indicator, and animated gradient background.
 */
export function ToolPanel({ tool }: ToolPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentTool, setCurrentTool] = useState(tool);
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const prevToolId = useRef(tool.id);

  /** Show skeleton loader briefly when switching between tools */
  useEffect(() => {
    if (tool.id !== prevToolId.current) {
      setIsLoading(true);
      prevToolId.current = tool.id;
      const timer = setTimeout(() => {
        setCurrentTool(tool);
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
    setCurrentTool(tool);
  }, [tool]);

  /** Track scrollable content progress */
  const handleScroll = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const progress =
      scrollHeight <= clientHeight
        ? 0
        : (scrollTop / (scrollHeight - clientHeight)) * 100;
    setScrollProgress(progress);
  }, []);

  const ToolComponent = currentTool.component;

  return (
    <main className="flex-1 flex flex-col overflow-hidden relative content-reveal">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] via-transparent to-accent/[0.02] animate-[gradient-shift_15s_ease_infinite] bg-[length:200%_200%] pointer-events-none" />

      {/* Scroll progress bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 z-10">
        <div
          className="h-full bg-accent/60 rounded-r-full transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Scrollable content */}
      <div
        ref={contentRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-8 relative z-0"
      >
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <div
            key={currentTool.id}
            className="animate-[slide-in-right_0.4s_ease-out]"
          >
            {/* Tool header (appears first) */}
            <div className="mb-8 animate-[slide-in-right_0.3s_ease-out]">
              <h2 className="text-2xl font-bold text-white mb-1">
                {currentTool.name}
              </h2>
              <p className="text-sm text-muted">{currentTool.description}</p>
            </div>

            {/* Tool content (staggered 80ms) */}
            <div className="animate-[slide-in-right_0.4s_ease-out] [animation-delay:80ms] [animation-fill-mode:backwards]">
              <ToolComponent />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

/** Shimmer-animated skeleton blocks shown during tool transitions */
function SkeletonLoader() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-48 rounded-lg bg-surface shimmer" />
        <div className="h-4 w-72 rounded-md bg-surface shimmer" />
      </div>
      <div className="space-y-4">
        <div className="h-32 rounded-xl bg-surface shimmer" />
        <div className="h-32 rounded-xl bg-surface shimmer" />
      </div>
    </div>
  );
}
