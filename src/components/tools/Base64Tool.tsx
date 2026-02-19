import React, { useMemo, useState } from "react";
import { ToolSection } from "../ui/ToolSection";
import { ToolOutput } from "../ui/ToolOutput";

/**
 * Props for the Base64Tool component.
 */
export interface Base64ToolProps {
  onCopied?: (message: string) => void;
}

/**
 * Encodes text into Base64 with UTF-8 support.
 */
const encodeTextToBase64 = (value: string): string => {
  if (!value) {
    return "";
  }

  const encoded = new TextEncoder().encode(value);
  let binary = "";
  encoded.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
};

/**
 * Reads a file as Base64 and returns its data payload.
 */
const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      const [, payload] = result.split(",");
      resolve(payload ?? "");
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

/**
 * Renders the Base64 conversion tool for text and files.
 */
export const Base64Tool: React.FC<Base64ToolProps> = ({ onCopied }) => {
  const [textInput, setTextInput] = useState("");
  const [fileOutput, setFileOutput] = useState("");
  const [fileMeta, setFileMeta] = useState("");

  const textOutput = useMemo(() => encodeTextToBase64(textInput), [textInput]);

  /**
   * Handles file selection and Base64 extraction.
   */
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const [file] = Array.from(event.target.files ?? []);
    if (!file) {
      setFileOutput("");
      setFileMeta("");
      return;
    }

    try {
      const payload = await readFileAsBase64(file);
      setFileOutput(payload);
      setFileMeta(`${file.name} - ${(file.size / 1024).toFixed(1)} KB`);
    } catch {
      setFileOutput("");
      setFileMeta("Failed to read file");
    }
  };

  return (
    <div className="tool-content">
      <ToolSection title="Text to Base64">
        <div className="field-label">Plain text</div>
        <textarea
          className="textarea"
          value={textInput}
          onChange={(event) => setTextInput(event.target.value)}
          placeholder="Type or paste text to encode"
        />
        <div className="mt-4">
          <ToolOutput
            label="Base64 output"
            value={textOutput}
            onCopied={onCopied}
          />
        </div>
      </ToolSection>
      <ToolSection title="File to Base64">
        <div className="field-label">Upload file</div>
        <input className="text-input" type="file" onChange={handleFileChange} />
        {fileMeta ? <p className="tool-subtitle mt-3">{fileMeta}</p> : null}
        <div className="mt-4">
          <ToolOutput
            label="Base64 payload"
            value={fileOutput}
            onCopied={onCopied}
          />
        </div>
      </ToolSection>
    </div>
  );
};
