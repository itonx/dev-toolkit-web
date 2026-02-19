import { Icon } from "@iconify/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { APP_NAME, tools } from "./constants";
import type { ToolKey } from "./types";

type SidebarProps = {
  activeTool: ToolKey;
  searchValue: string;
  isTyping: boolean;
  onToolChange: (tool: ToolKey) => void;
  onSearchChange: (value: string) => void;
  onOpenSettings: () => void;
};

type IndicatorStyle = {
  top: number;
  height: number;
};

export default function Sidebar({
  activeTool,
  searchValue,
  isTyping,
  onToolChange,
  onSearchChange,
  onOpenSettings,
}: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<ToolKey, HTMLButtonElement | null>>({
    guid: null,
    base64: null,
  });
  const [indicatorStyle, setIndicatorStyle] = useState<IndicatorStyle | null>(
    null,
  );

  const filteredTools = useMemo(
    () =>
      tools.filter((tool) =>
        tool.label.toLowerCase().includes(searchValue.toLowerCase()),
      ),
    [searchValue],
  );

  useEffect(() => {
    const activeToolVisible = filteredTools.some(
      (tool) => tool.key === activeTool,
    );
    if (!activeToolVisible) {
      setIndicatorStyle(null);
      return;
    }

    const target = itemRefs.current[activeTool];
    const container = sidebarRef.current;
    if (!target || !container) {
      setIndicatorStyle(null);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    setIndicatorStyle({
      top: targetRect.top - containerRect.top,
      height: targetRect.height,
    });
  }, [activeTool, filteredTools]);

  return (
    <aside className="sidebar">
      <header className="brand-wrap">
        <div className="logo-mark">
          <Icon icon="tabler:flask-2" width="18" />
        </div>
        <h1 className="app-logo">{APP_NAME}</h1>
      </header>

      <div className={`search-shell ${isTyping ? "typing" : ""}`}>
        <Icon icon="tabler:search" width="16" className="search-icon" />
        <input
          type="text"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search tools"
          aria-label="Search tools"
        />
      </div>

      <div className="tool-list" ref={sidebarRef}>
        {indicatorStyle ? (
          <div
            className="active-indicator"
            style={{ top: indicatorStyle.top, height: indicatorStyle.height }}
          />
        ) : null}

        {filteredTools.map((tool) => (
          <button
            key={tool.key}
            type="button"
            ref={(node) => {
              itemRefs.current[tool.key] = node;
            }}
            className={`tool-item ${activeTool === tool.key ? "active" : ""}`}
            onClick={() => onToolChange(tool.key)}
          >
            <Icon icon={tool.icon} width="18" />
            <span>{tool.label}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="settings-button"
        onClick={onOpenSettings}
      >
        <Icon icon="tabler:settings" width="18" />
        Settings
      </button>
    </aside>
  );
}
