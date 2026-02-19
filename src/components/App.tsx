import { useState, type ReactNode } from "react";
import { Sidebar, type SidebarTool } from "./Sidebar";
import { ToolPanel } from "./ToolPanel";
import { GuidGenerator } from "./tools/GuidGenerator";
import { Base64Converter } from "./tools/Base64Converter";

/** Extends the sidebar tool shape with the renderable component */
export interface ToolDefinition extends SidebarTool {
  component: React.ComponentType;
}

/** SVG icon for the GUID generator (hash / identifier symbol) */
const GuidIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5"
    />
  </svg>
);

/** SVG icon for the Base64 converter (code brackets) */
const Base64Icon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
    />
  </svg>
);

/** Registry of all available developer tools */
const tools: ToolDefinition[] = [
  {
    id: "guid",
    name: "GUID Generator",
    description: "Generate random GUIDs / UUIDs v4",
    icon: <GuidIcon />,
    component: GuidGenerator,
  },
  {
    id: "base64",
    name: "Base64 Converter",
    description: "Encode and decode text or files to Base64",
    icon: <Base64Icon />,
    component: Base64Converter,
  },
];

/**
 * Root application shell.
 * Manages active tool state, search filtering, and renders the
 * sidebar + main content panel layout.
 */
export function App() {
  const [activeToolId, setActiveToolId] = useState(tools[0].id);
  const [searchQuery, setSearchQuery] = useState("");

  const activeTool = tools.find((t) => t.id === activeToolId) ?? tools[0];

  const filteredTools = searchQuery
    ? tools.filter((t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : tools;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg text-white">
      <Sidebar
        tools={filteredTools}
        activeToolId={activeToolId}
        onSelectTool={setActiveToolId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <ToolPanel tool={activeTool} />
    </div>
  );
}
