import {
  useState,
  useCallback,
  useRef,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { OutputPanel } from "../OutputPanel";
import { CopyButton } from "../CopyButton";

type Mode = "encode" | "decode";
type InputType = "text" | "file";

/**
 * Base64Converter - Tool for encoding and decoding text or files to Base64
 */
export function Base64Converter() {
  const [mode, setMode] = useState<Mode>("encode");
  const [inputType, setInputType] = useState<InputType>("text");
  const [textInput, setTextInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Converts text or file data to/from Base64
   */
  const handleConvert = useCallback(() => {
    setError("");
    setShowResult(false);

    try {
      if (mode === "encode") {
        if (inputType === "text") {
          // Encode text to Base64
          const encoded = btoa(unescape(encodeURIComponent(textInput)));
          setOutput(encoded);
        }
        // File encoding is handled in handleFileSelect
      } else {
        // Decode Base64 to text
        try {
          const decoded = decodeURIComponent(escape(atob(textInput.trim())));
          setOutput(decoded);
        } catch {
          setError("Invalid Base64 string. Please check your input.");
          return;
        }
      }
      setShowResult(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  }, [mode, inputType, textInput]);

  /**
   * Handles file selection and converts to Base64
   */
  const handleFileSelect = useCallback(
    (file: File) => {
      setFileName(file.name);
      setError("");

      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          // Extract Base64 data from data URL
          const base64 = result.split(",")[1] || result;
          setOutput(base64);
          setShowResult(true);
        }
      };

      reader.onerror = () => {
        setError("Failed to read file");
      };

      if (mode === "encode") {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    },
    [mode],
  );

  const handleFileInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect],
  );

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect],
  );

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setOutput("");
    setShowResult(false);
    setError("");
  };

  const handleInputTypeChange = (newType: InputType) => {
    setInputType(newType);
    setOutput("");
    setShowResult(false);
    setError("");
    setFileName("");
  };

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
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
          Mode
        </h2>

        <div className="flex gap-2">
          <button
            onClick={() => handleModeChange("encode")}
            className="flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200"
            style={{
              backgroundColor:
                mode === "encode"
                  ? "var(--color-accent)"
                  : "var(--color-background)",
              color: mode === "encode" ? "#202833" : "var(--color-text)",
              border: `1px solid ${mode === "encode" ? "var(--color-accent)" : "var(--color-border)"}`,
              boxShadow:
                mode === "encode"
                  ? "0 0 20px var(--color-accent-glow)"
                  : "none",
            }}
          >
            Encode to Base64
          </button>
          <button
            onClick={() => handleModeChange("decode")}
            className="flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200"
            style={{
              backgroundColor:
                mode === "decode"
                  ? "var(--color-accent)"
                  : "var(--color-background)",
              color: mode === "decode" ? "#202833" : "var(--color-text)",
              border: `1px solid ${mode === "decode" ? "var(--color-accent)" : "var(--color-border)"}`,
              boxShadow:
                mode === "decode"
                  ? "0 0 20px var(--color-accent-glow)"
                  : "none",
            }}
          >
            Decode from Base64
          </button>
        </div>
      </section>

      {/* Input Type Selection */}
      <section
        className="p-6 rounded-xl stagger-4 animate-slide-in-right"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--color-text)" }}
        >
          Input Type
        </h2>

        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="inputType"
              checked={inputType === "text"}
              onChange={() => handleInputTypeChange("text")}
              className="w-4 h-4 accent-[#24e4a7]"
            />
            <span style={{ color: "var(--color-text)" }}>Text</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="inputType"
              checked={inputType === "file"}
              onChange={() => handleInputTypeChange("file")}
              className="w-4 h-4 accent-[#24e4a7]"
            />
            <span style={{ color: "var(--color-text)" }}>File</span>
          </label>
        </div>

        {/* Text Input */}
        {inputType === "text" && (
          <div>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={
                mode === "encode"
                  ? "Enter text to encode..."
                  : "Enter Base64 string to decode..."
              }
              rows={6}
              className="w-full px-4 py-3 rounded-lg outline-none transition-all duration-200 resize-y focus:ring-2"
              style={{
                backgroundColor: "var(--color-background)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
              }}
            />
          </div>
        )}

        {/* File Input */}
        {inputType === "file" && (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="relative cursor-pointer p-8 rounded-lg border-2 border-dashed text-center transition-all duration-200"
            style={{
              borderColor: isDragging
                ? "var(--color-accent)"
                : "var(--color-border)",
              backgroundColor: isDragging
                ? "rgba(36, 228, 167, 0.1)"
                : "var(--color-background)",
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <div className="text-4xl mb-3">📁</div>
            <p style={{ color: "var(--color-text)" }}>
              {fileName || "Click or drag a file here"}
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
              Supports any file type
            </p>
          </div>
        )}

        {/* Convert Button (for text input) */}
        {inputType === "text" && (
          <button
            onClick={handleConvert}
            disabled={!textInput.trim()}
            className="mt-4 px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              backgroundColor: textInput.trim()
                ? "var(--color-accent)"
                : "var(--color-accent-disabled)",
              color: "#202833",
              boxShadow: textInput.trim()
                ? "0 0 20px var(--color-accent-glow)"
                : "none",
            }}
          >
            {mode === "encode" ? "Encode" : "Decode"}
          </button>
        )}
      </section>

      {/* Error Message */}
      {error && (
        <div
          className="p-4 rounded-lg animate-pop-in"
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.2)",
            border: "1px solid rgba(239, 68, 68, 0.5)",
            color: "#ef4444",
          }}
        >
          {error}
        </div>
      )}

      {/* Output Section */}
      {showResult && output && (
        <OutputPanel
          title={mode === "encode" ? "Encoded Base64" : "Decoded Text"}
        >
          <div className="flex justify-end mb-2">
            <CopyButton text={output} />
          </div>
          <div
            className="font-mono text-sm p-4 rounded-lg overflow-x-auto break-all max-h-64 overflow-y-auto"
            style={{
              backgroundColor: "var(--color-background)",
              border: "1px solid var(--color-border)",
              color: "var(--color-accent)",
            }}
          >
            {output}
          </div>
        </OutputPanel>
      )}
    </div>
  );
}
