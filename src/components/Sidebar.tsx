import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
  type MouseEvent,
} from "react";

/** Describes a single tool entry rendered in the sidebar */
export interface SidebarTool {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
}

interface SidebarProps {
  tools: SidebarTool[];
  activeToolId: string;
  onSelectTool: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

/**
 * Application sidebar with search bar and animated tool navigation.
 * Implements Layout Reveal, Expandable Search, Active Highlight Pill,
 * Ripple, Hover Lift/Glow, Left Accent Bar, Icon Pop, and Text Slide animations.
 */
export function Sidebar({
  tools,
  activeToolId,
  onSelectTool,
  searchQuery,
  onSearchChange,
}: SidebarProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef<ReturnType<typeof setTimeout>>();

  /* ── Floating pill positioning ── */
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [pillStyle, setPillStyle] = useState({ top: 0, height: 0 });

  /* ── Ripple state ── */
  const [ripples, setRipples] = useState<
    { id: number; x: number; y: number; toolId: string }[]
  >([]);

  /** Recalculate the active-indicator pill position */
  useEffect(() => {
    const el = itemRefs.current.get(activeToolId);
    const container = listRef.current;
    if (el && container) {
      setPillStyle({
        top: el.offsetTop - container.offsetTop,
        height: el.offsetHeight,
      });
    }
  }, [activeToolId, tools]);

  /** Handle search input with typing-pulse feedback */
  const handleSearchInput = useCallback(
    (value: string) => {
      onSearchChange(value);
      setIsTyping(true);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => setIsTyping(false), 500);
    },
    [onSearchChange],
  );

  /** Handle tool click with ripple + press-down effect */
  const handleToolClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>, toolId: string) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      setRipples((prev) => [...prev, { id, x, y, toolId }]);
      setTimeout(
        () => setRipples((prev) => prev.filter((r) => r.id !== id)),
        600,
      );
      onSelectTool(toolId);
    },
    [onSelectTool],
  );

  return (
    <aside className="sidebar-reveal flex flex-col w-72 min-w-72 bg-sidebar border-r border-border h-full">
      {/* ── Logo / Title ── */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-4">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent/15">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-accent">
            <path
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-base font-semibold text-white tracking-tight">
            DEV Toolkit
          </h1>
          <p className="text-[11px] text-muted">Developer utilities</p>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="px-4 pb-3 search-reveal">
        <div
          className={`relative flex items-center rounded-lg border transition-all duration-300 ease-out bg-surface
            ${
              isSearchFocused
                ? "border-accent shadow-[0_0_12px_rgba(36,228,167,0.25)] scale-[1.02]"
                : "border-border hover:border-muted/50"
            }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`w-4 h-4 ml-3 text-muted transition-transform duration-300
              ${isSearchFocused ? "rotate-[10deg] scale-110" : ""}`}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search tools…"
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="w-full bg-transparent text-sm text-white placeholder-muted px-3 py-2.5 outline-none"
          />
          {/* Typing-pulse underline */}
          {isTyping && (
            <div className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-gradient-to-r from-accent/0 via-accent to-accent/0 animate-[typing-wave_1s_ease-in-out_infinite] bg-[length:200%_100%]" />
          )}
        </div>
      </div>

      {/* ── Tool list ── */}
      <div className="flex-1 overflow-y-auto px-3 pb-4" ref={listRef}>
        <p className="text-[11px] font-medium text-muted/60 uppercase tracking-wider px-2 mb-2">
          Tools
        </p>

        <div className="relative">
          {/* Animated floating pill background */}
          <div
            className="absolute left-0 right-0 rounded-lg bg-surface/80 transition-all duration-300 ease-out pointer-events-none"
            style={{ top: pillStyle.top, height: pillStyle.height }}
          />

          {tools.map((tool) => {
            const isActive = tool.id === activeToolId;
            return (
              <button
                key={tool.id}
                ref={(el) => {
                  if (el) itemRefs.current.set(tool.id, el);
                }}
                onClick={(e) => handleToolClick(e, tool.id)}
                className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left
                  cursor-pointer transition-all duration-200 ease-out overflow-hidden group
                  ${
                    isActive
                      ? "text-white scale-[1.03]"
                      : "text-muted hover:text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/5"
                  }
                  active:scale-[0.97]`}
              >
                {/* Left accent bar */}
                <div
                  className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 rounded-full bg-accent
                    transition-all duration-300 ease-out
                    ${
                      isActive
                        ? "h-full opacity-100"
                        : "h-0 opacity-0 group-hover:h-full group-hover:opacity-60"
                    }`}
                />

                {/* Tool icon */}
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200
                    ${
                      isActive
                        ? "bg-accent/15 text-accent"
                        : "bg-surface text-muted group-hover:text-accent group-hover:scale-110 group-hover:rotate-[5deg]"
                    }`}
                >
                  {tool.icon}
                </div>

                {/* Tool label */}
                <div
                  className={`flex flex-col min-w-0 transition-transform duration-200
                    ${!isActive ? "group-hover:translate-x-1.5" : ""}`}
                >
                  <span className="text-sm font-medium truncate">
                    {tool.name}
                  </span>
                  <span className="text-[11px] text-muted/70 truncate">
                    {tool.description}
                  </span>
                </div>

                {/* Ripple circles */}
                {ripples
                  .filter((r) => r.toolId === tool.id)
                  .map((r) => (
                    <span
                      key={r.id}
                      className="absolute rounded-full bg-accent/20 animate-[ripple_0.6s_ease-out]"
                      style={{
                        left: r.x - 5,
                        top: r.y - 5,
                        width: 10,
                        height: 10,
                      }}
                    />
                  ))}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="px-5 py-4 border-t border-border">
        <p className="text-[11px] text-muted/50 text-center">
          DEV Toolkit v1.0
        </p>
      </div>
    </aside>
  );
}
