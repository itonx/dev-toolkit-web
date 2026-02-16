import { useState, useCallback } from "react";
import { CopyButton } from "../CopyButton";

/** Generate a cryptographically random UUID v4 */
function generateUuid(): string {
  return crypto.randomUUID();
}

/**
 * GUID Generator tool.
 * Generates one or more random UUID v4 values with configurable
 * formatting options (uppercase, hyphens).
 */
export function GuidGenerator() {
  const [guids, setGuids] = useState<string[]>([generateUuid()]);
  const [count, setCount] = useState(1);
  const [uppercase, setUppercase] = useState(false);
  const [noHyphens, setNoHyphens] = useState(false);
  const [animateResults, setAnimateResults] = useState(false);

  /** Format a GUID string based on current display options */
  const formatGuid = useCallback(
    (guid: string): string => {
      let result = guid;
      if (noHyphens) result = result.replace(/-/g, "");
      if (uppercase) result = result.toUpperCase();
      return result;
    },
    [uppercase, noHyphens],
  );

  /** Generate a fresh batch of GUIDs */
  const handleGenerate = useCallback(() => {
    const newGuids = Array.from({ length: count }, () => generateUuid());
    setGuids(newGuids);
    setAnimateResults(true);
    setTimeout(() => setAnimateResults(false), 400);
  }, [count]);

  const allGuidsText = guids.map(formatGuid).join("\n");

  return (
    <div className="space-y-6">
      {/* Options panel */}
      <div className="flex flex-wrap items-end gap-6 p-5 rounded-xl bg-surface border border-border">
        {/* Count */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-medium text-muted uppercase tracking-wider">
            Count
          </label>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) =>
              setCount(Math.max(1, Math.min(100, Number(e.target.value))))
            }
            className="w-24 px-3 py-2 rounded-lg bg-bg border border-border text-white text-sm
              outline-none focus:border-accent focus:shadow-[0_0_8px_rgba(36,228,167,0.2)]
              transition-all duration-200"
          />
        </div>

        {/* Uppercase toggle */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-medium text-muted uppercase tracking-wider">
            Case
          </label>
          <button
            onClick={() => setUppercase(!uppercase)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border cursor-pointer transition-all duration-200
              ${
                uppercase
                  ? "bg-accent/15 text-accent border-accent/30"
                  : "bg-bg text-muted border-border hover:text-white hover:border-muted/50"
              }`}
          >
            {uppercase ? "UPPER" : "lower"}
          </button>
        </div>

        {/* Hyphens toggle */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-medium text-muted uppercase tracking-wider">
            Hyphens
          </label>
          <button
            onClick={() => setNoHyphens(!noHyphens)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border cursor-pointer transition-all duration-200
              ${
                noHyphens
                  ? "bg-accent/15 text-accent border-accent/30"
                  : "bg-bg text-muted border-border hover:text-white hover:border-muted/50"
              }`}
          >
            {noHyphens ? "No hyphens" : "With hyphens"}
          </button>
        </div>

        {/* Generate action */}
        <div className="flex flex-col gap-1.5 ml-auto">
          <label className="text-[11px] font-medium text-transparent select-none">
            Action
          </label>
          <button
            onClick={handleGenerate}
            className="px-6 py-2 rounded-lg bg-accent text-bg text-sm font-semibold cursor-pointer
              hover:shadow-[0_0_16px_rgba(36,228,167,0.35)] active:scale-95
              transition-all duration-200"
          >
            Generate
          </button>
        </div>
      </div>

      {/* Results */}
      <div
        className={`rounded-xl bg-surface border border-border overflow-hidden
          ${animateResults ? "animate-[pop-in_0.3s_ease-out]" : ""}`}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <span className="text-xs font-medium text-muted uppercase tracking-wider">
            Generated {guids.length} GUID{guids.length > 1 ? "s" : ""}
          </span>
          <CopyButton text={allGuidsText} label="Copy all" />
        </div>

        <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
          {guids.map((guid, i) => (
            <div
              key={`${guid}-${i}`}
              className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg
                bg-bg/50 border border-border/50 group
                ${animateResults ? "animate-[pop-in_0.3s_ease-out]" : ""}`}
              style={
                animateResults
                  ? {
                      animationDelay: `${i * 50}ms`,
                      animationFillMode: "backwards",
                    }
                  : undefined
              }
            >
              <code className="text-sm text-accent font-mono flex-1 select-all">
                {formatGuid(guid)}
              </code>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <CopyButton
                  text={formatGuid(guid)}
                  label=""
                  className="!px-2"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
