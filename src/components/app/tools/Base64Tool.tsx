import { Icon } from "@iconify/react";
import { useState } from "react";
import CopyButton from "../CopyButton";
import { ui } from "../uiClasses";
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
    <section className={`${ui.toolCard} animate-[result-pop_240ms_ease-out]`}>
      <header className={ui.toolHeader}>
        <h2 className={ui.toolTitle}>Base64 Converter</h2>
        <p className={ui.toolDescription}>
          Encode/decode text and encode files with Base64.
        </p>
      </header>

      <label className={ui.fieldLabel} htmlFor="base64Input">
        Input
      </label>
      <textarea
        id="base64Input"
        className={ui.textArea}
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        placeholder="Type text or Base64 data"
      />

      <div className={ui.toolActions}>
        <button
          type="button"
          className={`${ui.button} ${ui.buttonPrimary}`}
          onClick={encodeText}
          disabled={!inputValue}
        >
          <Icon icon="tabler:file-export" width="16" />
          Encode Text
        </button>
        <button
          type="button"
          className={ui.button}
          onClick={decodeText}
          disabled={!inputValue}
        >
          <Icon icon="tabler:file-import" width="16" />
          Decode Base64
        </button>
        <label className={ui.button} htmlFor="fileConvertInput">
          <Icon icon="tabler:upload" width="16" />
          Encode File
        </label>
        <input
          id="fileConvertInput"
          type="file"
          className="hidden"
          onChange={(event) => void handleFileEncode(event)}
        />
      </div>

      {selectedFileName ? (
        <p className={ui.fileMeta}>Encoded file: {selectedFileName}</p>
      ) : null}
      {errorText ? <p className={ui.errorMeta}>{errorText}</p> : null}

      <div className={ui.outputHead}>
        <label className={ui.fieldLabel} htmlFor="base64Output">
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
        className={ui.textArea}
        value={resultValue}
        readOnly
        placeholder="Converted output appears here"
      />
    </section>
  );
}
