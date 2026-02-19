import { useState, useCallback } from "react";
import { OutputPanel } from "../OutputPanel";
import { CopyButton } from "../CopyButton";

/**
 * Generates a random UUID v4 string
 */
function generateGuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * GuidGenerator - Tool for generating unique identifiers (UUIDs/GUIDs)
 */
export function GuidGenerator() {
  const [guids, setGuids] = useState<string[]>([generateGuid()]);
  const [count, setCount] = useState(1);
  const [uppercase, setUppercase] = useState(false);
  const [includeHyphens, setIncludeHyphens] = useState(true);
  const [includeBraces, setIncludeBraces] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleGenerate = useCallback(() => {
    const newGuids: string[] = [];
    for (let i = 0; i < count; i++) {
      let guid = generateGuid();

      if (!includeHyphens) {
        guid = guid.replace(/-/g, "");
      }

      if (uppercase) {
        guid = guid.toUpperCase();
      }

      if (includeBraces) {
        guid = `{${guid}}`;
      }

      newGuids.push(guid);
    }
    setGuids(newGuids);
    setShowResult(true);
  }, [count, uppercase, includeHyphens, includeBraces]);

  const formattedOutput = guids.join("\n");

  return (
    <div className="space-y-6">
      {/* Options Section */}
      <section
        className="p-6 rounded-xl stagger-3 animate-slide-in-right"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--color-text)" }}
        >
          Options
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Count Input */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--color-muted)" }}
            >
              Number of GUIDs
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) =>
                setCount(
                  Math.max(1, Math.min(100, parseInt(e.target.value) || 1)),
                )
              }
              className="w-full px-4 py-2.5 rounded-lg outline-none transition-all duration-200 focus:ring-2"
              style={{
                backgroundColor: "var(--color-background)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
              }}
            />
          </div>

          {/* Format Options */}
          <div className="space-y-3">
            <label
              className="block text-sm font-medium"
              style={{ color: "var(--color-muted)" }}
            >
              Format Options
            </label>

            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={uppercase}
                  onChange={(e) => setUppercase(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#24e4a7]"
                />
                <span style={{ color: "var(--color-text)" }}>Uppercase</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeHyphens}
                  onChange={(e) => setIncludeHyphens(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#24e4a7]"
                />
                <span style={{ color: "var(--color-text)" }}>
                  Include hyphens
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeBraces}
                  onChange={(e) => setIncludeBraces(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#24e4a7]"
                />
                <span style={{ color: "var(--color-text)" }}>
                  Include braces
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          className="mt-6 px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            backgroundColor: "var(--color-accent)",
            color: "#202833",
            boxShadow: "0 0 20px var(--color-accent-glow)",
          }}
        >
          Generate GUID{count > 1 ? "s" : ""}
        </button>
      </section>

      {/* Output Section */}
      {showResult && (
        <OutputPanel title="Generated GUIDs">
          <div className="flex justify-end mb-2">
            <CopyButton text={formattedOutput} />
          </div>
          <div
            className="font-mono text-sm p-4 rounded-lg overflow-x-auto"
            style={{
              backgroundColor: "var(--color-background)",
              border: "1px solid var(--color-border)",
              color: "var(--color-accent)",
            }}
          >
            {guids.map((guid, index) => (
              <div
                key={index}
                className="py-1 hover:bg-[#344154] px-2 rounded transition-colors"
              >
                {guid}
              </div>
            ))}
          </div>
        </OutputPanel>
      )}
    </div>
  );
}
