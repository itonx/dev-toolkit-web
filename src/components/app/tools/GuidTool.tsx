import { Icon } from "@iconify/react";
import { useState } from "react";
import CopyButton from "../CopyButton";
import { createGuid } from "../utils/guid";

type GuidToolProps = {
  onToast: () => void;
};

export default function GuidTool({ onToast }: GuidToolProps) {
  const [guidOutput, setGuidOutput] = useState("");

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
          onClick={() => setGuidOutput(createGuid())}
        >
          <Icon icon="tabler:wand" width="16" />
          Generate GUID
        </button>
        <CopyButton
          value={guidOutput}
          onCopied={onToast}
          disabled={!guidOutput}
        />
      </div>

      <label className="field-label stagger-3" htmlFor="guidOutput">
        Result
      </label>
      <textarea
        id="guidOutput"
        className="result-area stagger-4"
        value={guidOutput}
        readOnly
        placeholder="Generated GUID will appear here"
      />
    </section>
  );
}
