import { useState, useCallback, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { MainContent } from "./MainContent";
import { GuidGenerator } from "./tools/GuidGenerator";
import { Base64Converter } from "./tools/Base64Converter";
import type { Tool } from "../types/tool";

/**
 * Available tools in the application
 */
const tools: Tool[] = [
  {
    id: "guid-generator",
    name: "GUID Generator",
    description: "Generate unique identifiers (UUIDs/GUIDs)",
    icon: "🔑",
  },
  {
    id: "base64-converter",
    name: "Base64 Converter",
    description: "Encode and decode text or files to Base64",
    icon: "🔄",
  },
];

/**
 * Maps tool IDs to their respective components
 */
const toolComponents: Record<string, ReactNode> = {
  "guid-generator": <GuidGenerator />,
  "base64-converter": <Base64Converter />,
};

/**
 * AppShell - Main application shell component
 * Manages the layout with sidebar and main content area
 */
export function AppShell() {
  const [activeToolId, setActiveToolId] = useState<string>(tools[0].id);
  const [searchQuery, setSearchQuery] = useState("");

  const handleToolSelect = useCallback((toolId: string) => {
    setActiveToolId(toolId);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const activeTool = tools.find((t) => t.id === activeToolId);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar
        tools={filteredTools}
        activeToolId={activeToolId}
        searchQuery={searchQuery}
        onToolSelect={handleToolSelect}
        onSearchChange={handleSearchChange}
      />
      <MainContent tool={activeTool} key={activeToolId}>
        {toolComponents[activeToolId]}
      </MainContent>
    </div>
  );
}
