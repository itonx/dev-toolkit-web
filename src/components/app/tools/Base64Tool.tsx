import { Icon } from "@iconify/react";
import { useState } from "react";
import CopyButton from "../CopyButton";
import { fromBase64ToText, fromTextToBase64, toBase64 } from "../utils/base64";

type Base64ToolProps = {
  onToast: () => void;
};

export default function Base64Tool({ onToast }: Base64ToolProps) {
  const [inputValue, setInputValue] = useState("");
  const [resultValue, setResultValue] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [errorText, setErrorText] = useState("");

  const encodeText = () => {
    setResultValue(fromTextToBase64(inputValue));
    setSelectedFileName("");
    setErrorText("");
  };

  const decodeText = () => {
    try {
      const decoded = fromBase64ToText(inputValue);
      setResultValue(decoded);
      setSelectedFileName("");
      setErrorText("");
    } catch {
      setErrorText("Invalid Base64 input.");
    }
  };

  const handleFileEncode = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const targetFile = event.target.files?.[0];
    if (!targetFile) return;

    const fileBuffer = await targetFile.arrayBuffer();
    const fileBytes = new Uint8Array(fileBuffer);
    setResultValue(toBase64(fileBytes));
    setSelectedFileName(targetFile.name);
    setErrorText("");
  };

  return (
    <section className="tool-card tool-result-pop">
      <header className="tool-header stagger-1">
        <h2>Base64 Converter</h2>
        <p>Encode/decode text and encode files with Base64.</p>
      </header>

      <label className="field-label stagger-2" htmlFor="base64Input">
        Input
      </label>
      <textarea
        id="base64Input"
        className="editor-area stagger-3"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        placeholder="Type text or Base64 data"
      />

      <div className="tool-actions stagger-4">
        <button
          type="button"
          className="action-button primary"
          onClick={encodeText}
          disabled={!inputValue}
        >
          <Icon icon="tabler:file-export" width="16" />
          Encode Text
        </button>
        <button
          type="button"
          className="action-button"
          onClick={decodeText}
          disabled={!inputValue}
        >
          <Icon icon="tabler:file-import" width="16" />
          Decode Base64
        </button>
        <label className="action-button upload" htmlFor="fileConvertInput">
          <Icon icon="tabler:upload" width="16" />
          Encode File
        </label>
        <input
          id="fileConvertInput"
          type="file"
          onChange={(event) => void handleFileEncode(event)}
        />
      </div>

      {selectedFileName ? (
        <p className="file-meta">Encoded file: {selectedFileName}</p>
      ) : null}
      {errorText ? <p className="error-meta">{errorText}</p> : null}

      <div className="output-head">
        <label className="field-label" htmlFor="base64Output">
          Output
        </label>
        <CopyButton
          value={resultValue}
          onCopied={onToast}
          disabled={!resultValue}
        />
      </div>
      <textarea
        id="base64Output"
        className="result-area"
        value={resultValue}
        readOnly
        placeholder="Converted output appears here"
      />
    </section>
  );
}
