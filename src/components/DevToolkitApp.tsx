import React, { useEffect, useMemo, useRef, useState } from "react";
import { GuidTool } from "./tools/GuidTool";
import { Base64Tool } from "./tools/Base64Tool";

/**
 * Definition for a tool displayed in the sidebar.
 */
interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  render: (props: ToolRenderProps) => React.ReactNode;
}

/**
 * Props provided to tool renderers.
 */
interface ToolRenderProps {
  onCopied: (message: string) => void;
}

/**
 * Props for the ToolButton component.
 */
interface ToolButtonProps {
  tool: ToolDefinition;
  isActive: boolean;
  onSelect: (id: string) => void;
}

/**
 * Renders the icon made of two square blocks.
 */
const ToolIcon: React.FC = () => {
  return (
    <div className="tool-icon">
      <span />
      <span />
    </div>
  );
};

/**
 * Renders a sidebar tool button with ripple feedback.
 */
const ToolButton: React.FC<ToolButtonProps> = ({
  tool,
  isActive,
  onSelect,
}) => {
  const [ripple, setRipple] = useState<{
    x: number;
    y: number;
    key: number;
  } | null>(null);

  /**
   * Triggers the ripple animation and selects the tool.
   */
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setRipple({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      key: Date.now(),
    });
    onSelect(tool.id);
  };

  return (
    <button
      className={`tool-button ${isActive ? "is-active" : ""}`.trim()}
      type="button"
      onClick={handleClick}
    >
      {ripple ? (
        <span
          key={ripple.key}
          className="tool-ripple"
          style={{ left: ripple.x, top: ripple.y }}
        />
      ) : null}
      <ToolIcon />
      <span className="tool-label">{tool.name}</span>
    </button>
  );
};

/**
 * Skeleton placeholder for tool content transitions.
 */
const ToolSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="skeleton h-8 w-48" />
      <div className="skeleton h-24 w-full" />
      <div className="skeleton h-16 w-full" />
      <div className="skeleton h-20 w-full" />
    </div>
  );
};

/**
 * Main application shell for the Dev Toolkit.
 */
const DevToolkitApp: React.FC = () => {
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState("guid");
  const [renderId, setRenderId] = useState("guid");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const transitionRef = useRef<number | null>(null);
  const typingRef = useRef<number | null>(null);

  const tools = useMemo<ToolDefinition[]>(
    () => [
      {
        id: "guid",
        name: "GUID Generator",
        description:
          "Fast, compliant GUID creation for workflows and API testing.",
        keywords: ["guid", "uuid", "id"],
        render: ({ onCopied }) => <GuidTool onCopied={onCopied} />,
      },
      {
        id: "base64",
        name: "Base64 Studio",
        description: "Convert text and files into clean Base64 payloads.",
        keywords: ["base64", "encode", "file"],
        render: ({ onCopied }) => <Base64Tool onCopied={onCopied} />,
      },
    ],
    [],
  );

  const filteredTools = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return tools;
    }
    return tools.filter((tool) => {
      return (
        tool.name.toLowerCase().includes(query) ||
        tool.keywords.some((keyword) => keyword.includes(query))
      );
    });
  }, [search, tools]);

  const activeTool = tools.find((tool) => tool.id === renderId) ?? tools[0];
  const activeIndex = Math.max(
    0,
    filteredTools.findIndex((tool) => tool.id === activeId),
  );

  /**
   * Handles tool selection with skeleton transitions.
   */
  const handleSelectTool = (id: string) => {
    if (id === activeId) {
      return;
    }
    setActiveId(id);
    setLoading(true);
    if (transitionRef.current) {
      window.clearTimeout(transitionRef.current);
    }
    transitionRef.current = window.setTimeout(() => {
      setRenderId(id);
      setLoading(false);
    }, 320);
  };

  /**
   * Shows a short toast notification.
   */
  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2100);
  };

  /**
   * Tracks typing for the search animation.
   */
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setTyping(true);
    if (typingRef.current) {
      window.clearTimeout(typingRef.current);
    }
    typingRef.current = window.setTimeout(() => setTyping(false), 500);
  };

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setLoaded(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (filteredTools.length === 0) {
      return;
    }
    if (!filteredTools.some((tool) => tool.id === activeId)) {
      handleSelectTool(filteredTools[0].id);
    }
  }, [activeId, filteredTools]);

  useEffect(() => {
    const node = contentRef.current;
    if (!node) {
      return;
    }

    /**
     * Updates the scroll progress indicator based on the content scroll.
     */
    const handleScroll = () => {
      const max = node.scrollHeight - node.clientHeight;
      const ratio = max > 0 ? node.scrollTop / max : 0;
      setProgress(Math.min(1, Math.max(0, ratio)));
    };

    handleScroll();
    node.addEventListener("scroll", handleScroll);
    return () => node.removeEventListener("scroll", handleScroll);
  }, [renderId]);

  return (
    <div className="app-shell" data-loaded={loaded}>
      <aside className="sidebar">
        <div className="sidebar-header">Tools</div>
        <div
          className="tool-list"
          style={{ ["--active-offset" as string]: `${activeIndex * 64}px` }}
        >
          {filteredTools.length > 0 ? (
            <div className="tool-active-indicator" />
          ) : null}
          {filteredTools.map((tool) => (
            <ToolButton
              key={tool.id}
              tool={tool}
              isActive={tool.id === activeId}
              onSelect={handleSelectTool}
            />
          ))}
        </div>
      </aside>
      <main className="main-panel">
        <div className="main-content" ref={contentRef}>
          <div
            className="scroll-progress"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
          <div className="search-wrap" data-typing={typing}>
            <svg
              className="search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input
              className="search-input"
              type="search"
              placeholder="Search tools"
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
            />
          </div>
          <div className="tool-header" key={activeTool.id}>
            <div className="tool-title">{activeTool.name}</div>
            <div className="tool-subtitle">{activeTool.description}</div>
          </div>
          <div className="tool-body">
            {loading ? (
              <ToolSkeleton />
            ) : (
              activeTool.render({ onCopied: notify })
            )}
          </div>
        </div>
      </main>
      {toast ? <div className="toast">{toast}</div> : null}
    </div>
  );
};

export default DevToolkitApp;
