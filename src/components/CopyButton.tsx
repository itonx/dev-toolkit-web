import { useState, useCallback } from "react";

interface CopyButtonProps {
  text: string;
  label?: string;
}

/**
 * CopyButton - Copies text to clipboard with visual feedback
 * Implements copy confirmation animation with icon morph and toast
 */
export function CopyButton({ text, label = "Copy" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setShowToast(true);

      // Reset after animation
      setTimeout(() => {
        setCopied(false);
      }, 2000);

      setTimeout(() => {
        setShowToast(false);
      }, 2500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [text]);

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        style={{
          backgroundColor: copied
            ? "var(--color-accent)"
            : "var(--color-border)",
          color: copied ? "#202833" : "var(--color-text)",
        }}
      >
        <span
          className="transition-transform duration-300"
          style={{
            transform: copied ? "scale(1.2)" : "scale(1)",
          }}
        >
          {copied ? "✓" : "📋"}
        </span>
        <span>{copied ? "Copied!" : label}</span>
      </button>

      {/* Toast Notification */}
      {showToast && (
        <div
          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
            showToast && !copied ? "toast-exit" : "toast"
          }`}
          style={{
            backgroundColor: "var(--color-accent)",
            color: "#202833",
          }}
        >
          Copied to clipboard!
        </div>
      )}
    </div>
  );
}
