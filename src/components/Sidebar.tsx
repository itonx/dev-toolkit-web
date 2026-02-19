import { useState, useRef, useCallback, type ChangeEvent } from "react";
import type { Tool } from "../types/tool";
import { ToolButton } from "./ToolButton";

interface SidebarProps {
  tools: Tool[];
  activeToolId: string;
  searchQuery: string;
  onToolSelect: (toolId: string) => void;
  onSearchChange: (query: string) => void;
}

/**
 * Sidebar component with search and tool list
 * Implements expandable search with focus glow and typing pulse animations
 */
export function Sidebar({
  tools,
  activeToolId,
  searchQuery,
  onToolSelect,
  onSearchChange,
}: SidebarProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchFocus = useCallback(() => {
    setIsSearchFocused(true);
  }, []);

  const handleSearchBlur = useCallback(() => {
    setIsSearchFocused(false);
  }, []);

  const handleSearchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onSearchChange(e.target.value);
      setIsTyping(true);

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing animation after 500ms of inactivity
      typingTimeoutRef.current = window.setTimeout(() => {
        setIsTyping(false);
      }, 500);
    },
    [onSearchChange],
  );

  return (
    <aside
      className="flex flex-col h-full w-72 animate-slide-in-left"
      style={{ backgroundColor: "var(--color-sidebar)" }}
    >
      {/* Logo/Brand */}
      <div
        className="p-4 border-b"
        style={{ borderColor: "var(--color-border)" }}
      >
        <h1
          className="text-xl font-bold tracking-tight"
          style={{ color: "var(--color-accent)" }}
        >
          DEV Toolkit
        </h1>
        <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>
          Developer utilities for web
        </p>
      </div>

      {/* Search Bar */}
      <div className="p-4 stagger-2 animate-fade-in">
        <div
          className="relative transition-all duration-300 ease-out"
          style={{
            transform: isSearchFocused ? "scale(1.02)" : "scale(1)",
          }}
        >
          {/* Search Icon */}
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-sm transition-transform duration-200"
            style={{
              color: "var(--color-muted)",
              transform: isSearchFocused
                ? "translateY(-50%) rotate(5deg) scale(1.1)"
                : "translateY(-50%) rotate(0) scale(1)",
            }}
          >
            🔍
          </span>

          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all duration-300"
            style={{
              backgroundColor: "var(--color-surface)",
              border: `1px solid ${isSearchFocused ? "var(--color-accent)" : "var(--color-border)"}`,
              color: "var(--color-text)",
              boxShadow: isSearchFocused
                ? "0 0 20px var(--color-accent-glow), 0 0 40px var(--color-accent-glow)"
                : "none",
            }}
          />

          {/* Typing Wave Indicator */}
          {isTyping && (
            <div
              className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full overflow-hidden"
              style={{
                background: `linear-gradient(90deg, transparent, var(--color-accent), transparent)`,
                backgroundSize: "200% 100%",
                animation: "typingWave 1s ease infinite",
              }}
            />
          )}
        </div>
      </div>

      {/* Tool List */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <div className="space-y-1">
          {tools.map((tool, index) => (
            <ToolButton
              key={tool.id}
              tool={tool}
              isActive={tool.id === activeToolId}
              onClick={() => onToolSelect(tool.id)}
              style={{ animationDelay: `${(index + 2) * 80}ms` }}
            />
          ))}
          {tools.length === 0 && (
            <p
              className="text-center py-8 text-sm"
              style={{ color: "var(--color-muted)" }}
            >
              No tools found
            </p>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div
        className="p-4 border-t text-center"
        style={{ borderColor: "var(--color-border)" }}
      >
        <p className="text-xs" style={{ color: "var(--color-muted)" }}>
          Built with Astro + React
        </p>
      </div>
    </aside>
  );
}
