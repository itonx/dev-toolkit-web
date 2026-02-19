import { useState, useCallback } from "react";

interface CopyButtonProps {
  /** The text to copy to the clipboard */
  text: string;
  /** Optional button label */
  label?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Reusable copy-to-clipboard button with animated confirmation.
 * Shows a checkmark morph animation and a toast notification on copy.
 */
export function CopyButton({
  text,
  label = "Copy",
  className = "",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  /** Copy text to clipboard with fallback support */
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <>
      <button
        onClick={handleCopy}
        className={`
          inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
          cursor-pointer transition-all duration-200 active:scale-95
          ${
            copied
              ? "bg-accent/20 text-accent border border-accent/30"
              : "bg-surface text-muted hover:text-white border border-border hover:border-accent/50 hover:shadow-[0_0_8px_rgba(36,228,167,0.15)]"
          }
          ${className}
        `}
      >
        {copied ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-4 h-4 animate-[check-morph_0.3s_ease-out]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-4 h-4"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
        )}
        {(label || copied) && <span>{copied ? "Copied!" : label}</span>}
      </button>

      {/* Toast notification */}
      {copied && (
        <div className="fixed bottom-6 left-1/2 z-50 animate-[toast-in_0.3s_ease-out]">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-accent/30 shadow-lg shadow-accent/10">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4 text-accent"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
            <span className="text-sm text-white">Copied to clipboard</span>
          </div>
        </div>
      )}
    </>
  );
}
