import { Icon } from "@iconify/react";
import { useState } from "react";
import CopyButton from "../CopyButton";
import { createFormattedGuids } from "../utils/guid";

type GuidToolProps = {
  onToast: () => void;
};

export default function GuidTool({ onToast }: GuidToolProps) {
  const [guidOutput, setGuidOutput] = useState("");
  const [count, setCount] = useState(1);
  const [caseMode, setCaseMode] = useState<"lowercase" | "uppercase">(
    "lowercase",
  );
  const [includeHyphens, setIncludeHyphens] = useState(true);
  const [includeBraces, setIncludeBraces] = useState(false);

  const generateGuid = () => {
    const result = createFormattedGuids({
      count,
      caseMode,
      includeHyphens,
      includeBraces,
    });
    setGuidOutput(result.join("\n"));
  };

  return (
    <section className="tool-card tool-result-pop">
      <header className="tool-header stagger-1">
        <h2>GUID Generator</h2>
        <p>Create RFC 4122 UUID values instantly.</p>
      </header>

      <div className="tool-actions stagger-2">
        <button
          type="button"
          className="action-button primary"
          onClick={generateGuid}
        >
          <Icon icon="tabler:wand" width="16" />
          Generate GUID
        </button>
      </div>

      <div className="guid-options stagger-3">
        <label className="field-label" htmlFor="guidCountInput">
          Number of GUIDs
        </label>
        <input
          id="guidCountInput"
          className="compact-input"
          type="number"
          min={1}
          max={100}
          value={count}
          onChange={(event) => setCount(Number(event.target.value || 1))}
        />

        <label className="field-label" htmlFor="guidCaseMode">
          Case
        </label>
        <select
          id="guidCaseMode"
          className="compact-input"
          value={caseMode}
          onChange={(event) =>
            setCaseMode(event.target.value as "lowercase" | "uppercase")
          }
        >
          <option value="lowercase">Lowercase</option>
          <option value="uppercase">Uppercase</option>
        </select>

        <label className="check-row">
          <input
            type="checkbox"
            checked={includeHyphens}
            onChange={(event) => setIncludeHyphens(event.target.checked)}
          />
          Include hyphens
        </label>

        <label className="check-row">
          <input
            type="checkbox"
            checked={includeBraces}
            onChange={(event) => setIncludeBraces(event.target.checked)}
          />
          Include braces
        </label>
      </div>

      <div className="output-head stagger-4">
        <label className="field-label" htmlFor="guidOutput">
          Result
        </label>
        <CopyButton
          value={guidOutput}
          onCopied={onToast}
          disabled={!guidOutput}
        />
      </div>
      <textarea
        id="guidOutput"
        className="result-area"
        value={guidOutput}
        readOnly
        placeholder="Generated GUID will appear here"
      />
    </section>
  );
}
