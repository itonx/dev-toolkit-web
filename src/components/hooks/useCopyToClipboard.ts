import { useCallback, useState } from "react";

/**
 * Result of a clipboard copy attempt.
 */
export interface CopyState {
  ok: boolean;
}

/**
 * Provides a safe clipboard copy helper with UI-friendly state.
 */
export const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);

  /**
   * Resets the copied state after a short delay.
   */
  const resetCopied = useCallback(() => {
    const timeout = window.setTimeout(() => setIsCopied(false), 1800);
    return () => window.clearTimeout(timeout);
  }, []);

  /**
   * Copies a string into the clipboard using the best available API.
   */
  const copy = useCallback(
    async (value: string): Promise<CopyState> => {
      if (!value) {
        return { ok: false };
      }

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
        } else {
          const textarea = document.createElement("textarea");
          textarea.value = value;
          textarea.setAttribute("readonly", "true");
          textarea.style.position = "absolute";
          textarea.style.left = "-9999px";
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
        }

        setIsCopied(true);
        resetCopied();
        return { ok: true };
      } catch {
        return { ok: false };
      }
    },
    [resetCopied],
  );

  return { isCopied, copy };
};
