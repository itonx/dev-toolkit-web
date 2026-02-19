import { Icon } from "@iconify/react";
import { useState } from "react";

type CopyButtonProps = {
  value: string;
  onCopied: () => void;
  disabled?: boolean;
};

export default function CopyButton({
  value,
  onCopied,
  disabled = false,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyValue = async () => {
    if (!value || disabled) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    onCopied();
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <button
      type="button"
      className={`action-button ${copied ? "copied" : ""}`}
      onClick={() => {
        void copyValue();
      }}
      disabled={disabled || !value}
    >
      <Icon icon={copied ? "tabler:check" : "tabler:copy"} width="16" />
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
