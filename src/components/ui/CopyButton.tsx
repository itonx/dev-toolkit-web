import React from "react";
import { useCopyToClipboard } from "../hooks/useCopyToClipboard";

/**
 * Props for the CopyButton component.
 */
export interface CopyButtonProps {
  value: string;
  label?: string;
  disabled?: boolean;
  onCopied?: (message: string) => void;
}

/**
 * Renders a copy-to-clipboard button with animated feedback.
 */
export const CopyButton: React.FC<CopyButtonProps> = ({
  value,
  label = "Copy",
  disabled,
  onCopied,
}) => {
  const { isCopied, copy } = useCopyToClipboard();

  /**
   * Handles the copy click and triggers toast feedback.
   */
  const handleCopy = async () => {
    if (disabled) {
      return;
    }
    const result = await copy(value);
    if (result.ok) {
      onCopied?.("Copied to clipboard");
    }
  };

  return (
    <button
      className="copy-button"
      type="button"
      disabled={disabled || !value}
      onClick={handleCopy}
      data-copied={isCopied}
    >
      <svg
        className="copy-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        {isCopied ? (
          <path d="M5 13l4 4L19 7" />
        ) : (
          <path d="M9 9h10v10H9zM5 5h10v10H5z" />
        )}
      </svg>
      {label}
    </button>
  );
};
