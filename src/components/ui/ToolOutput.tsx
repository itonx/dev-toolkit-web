import React, { useEffect, useMemo, useState } from "react";
import { CopyButton } from "./CopyButton";

/**
 * Props for the ToolOutput component.
 */
export interface ToolOutputProps {
  label: string;
  value: string;
  placeholder?: string;
  onCopied?: (message: string) => void;
}

/**
 * Displays tool output with copy support and animated feedback.
 */
export const ToolOutput: React.FC<ToolOutputProps> = ({
  label,
  value,
  placeholder = "No output yet",
  onCopied,
}) => {
  const [pop, setPop] = useState(false);

  const displayValue = useMemo(
    () => (value?.length ? value : placeholder),
    [value, placeholder],
  );

  /**
   * Triggers the pop animation when the output updates.
   */
  useEffect(() => {
    if (!value) {
      return;
    }
    setPop(true);
    const timeout = window.setTimeout(() => setPop(false), 350);
    return () => window.clearTimeout(timeout);
  }, [value]);

  return (
    <div>
      <div className="field-label">{label}</div>
      <div className={`output-block ${pop ? "output-pop" : ""}`.trim()}>
        {displayValue}
        <CopyButton value={value} onCopied={onCopied} disabled={!value} />
      </div>
    </div>
  );
};
