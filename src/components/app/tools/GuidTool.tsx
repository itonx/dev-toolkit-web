import { Icon } from "@iconify/react";
import { useState } from "react";
import CopyButton from "../CopyButton";
import { ui } from "../uiClasses";
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
    <section className={`${ui.toolCard} animate-[result-pop_240ms_ease-out]`}>
      <header className={ui.toolHeader}>
        <h2 className={ui.toolTitle}>GUID Generator</h2>
        <p className={ui.toolDescription}>
          Create RFC 4122 UUID values instantly.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <div className={ui.optionCard}>
          <label className={ui.fieldLabel} htmlFor="guidCountInput">
            Count
          </label>
          <input
            id="guidCountInput"
            className={ui.compactInput}
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(event) => setCount(Number(event.target.value || 1))}
          />
        </div>

        <div className={ui.optionCard}>
          <label className={ui.fieldLabel} htmlFor="guidCaseMode">
            Case
          </label>
          <select
            id="guidCaseMode"
            className={ui.compactInput}
            value={caseMode}
            onChange={(event) =>
              setCaseMode(event.target.value as "lowercase" | "uppercase")
            }
          >
            <option value="lowercase">lower</option>
            <option value="uppercase">upper</option>
          </select>
        </div>

        <div className={ui.optionCard}>
          <label className={ui.fieldLabel} htmlFor="guidHyphenMode">
            Hyphens
          </label>
          <select
            id="guidHyphenMode"
            className={ui.compactInput}
            value={includeHyphens ? "with" : "without"}
            onChange={(event) =>
              setIncludeHyphens(event.target.value === "with")
            }
          >
            <option value="with">With hyphens</option>
            <option value="without">No hyphens</option>
          </select>
        </div>

        <div className={ui.optionCard}>
          <label className={ui.fieldLabel} htmlFor="guidBraceMode">
            Braces
          </label>
          <select
            id="guidBraceMode"
            className={ui.compactInput}
            value={includeBraces ? "with" : "without"}
            onChange={(event) =>
              setIncludeBraces(event.target.value === "with")
            }
          >
            <option value="without">No braces</option>
            <option value="with">With braces</option>
          </select>
        </div>
      </div>

      <div className={ui.toolActions}>
        <button
          type="button"
          className={`${ui.button} ${ui.buttonPrimary}`}
          onClick={generateGuid}
        >
          <Icon icon="tabler:wand" width="16" />
          Generate GUID
        </button>
      </div>

      <div className={ui.outputHead}>
        <label className={ui.fieldLabel} htmlFor="guidOutput">
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
        className={ui.textArea}
        value={guidOutput}
        readOnly
        placeholder="Generated GUID will appear here"
      />
    </section>
  );
}
