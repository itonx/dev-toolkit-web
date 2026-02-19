import React, { useEffect, useState } from "react";
import { ToolSection } from "../ui/ToolSection";
import { ToolOutput } from "../ui/ToolOutput";

/**
 * Props for the GuidTool component.
 */
export interface GuidToolProps {
  onCopied?: (message: string) => void;
}

/**
 * Creates a GUID using the best available browser API.
 */
const createGuid = (): string => {
  if (crypto?.randomUUID) {
    return crypto.randomUUID();
  }

  const template = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
  return template.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
};

/**
 * Renders the GUID generator tool.
 */
export const GuidTool: React.FC<GuidToolProps> = ({ onCopied }) => {
  const [guid, setGuid] = useState("");

  /**
   * Generates a new GUID and updates the output.
   */
  const generateGuid = () => {
    setGuid(createGuid());
  };

  useEffect(() => {
    generateGuid();
  }, []);

  return (
    <div className="tool-content">
      <ToolSection title="Generator">
        <p className="tool-subtitle">
          Create compliant GUIDs with a single click.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            className="primary-button"
            type="button"
            onClick={generateGuid}
          >
            Generate GUID
          </button>
        </div>
      </ToolSection>
      <ToolSection title="Output">
        <ToolOutput label="GUID" value={guid} onCopied={onCopied} />
      </ToolSection>
    </div>
  );
};
