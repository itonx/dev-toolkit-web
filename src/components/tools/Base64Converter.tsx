import { useState, useCallback, useRef } from "react";
import { CopyButton } from "../CopyButton";

type Mode = "encode" | "decode";
type InputType = "text" | "file";

/**
 * Base64 Converter tool.
 * Supports encoding/decoding of plain text and encoding of binary files.
 */
export function Base64Converter() {
  const [mode, setMode] = useState<Mode>("encode");
  const [inputType, setInputType] = useState<InputType>("text");
  const [textInput, setTextInput] = useState("");
  const [output, setOutput] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [animateResult, setAnimateResult] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /** Encode a UTF-8 string to Base64 */
  const encodeBase64 = useCallback((input: string): string => {
    try {
      return btoa(unescape(encodeURIComponent(input)));
    } catch {
      throw new Error("Failed to encode input to Base64");
    }
  }, []);

  /** Decode a Base64 string to UTF-8 */
  const decodeBase64 = useCallback((input: string): string => {
    try {
      return decodeURIComponent(escape(atob(input.trim())));
    } catch {
      throw new Error("Invalid Base64 input");
    }
  }, []);

  /** Trigger result animation */
  const flashResult = useCallback(() => {
    setAnimateResult(true);
    setTimeout(() => setAnimateResult(false), 400);
  }, []);

  /** Convert the current text input */
  const handleConvert = useCallback(() => {
    setError("");
    try {
      const result =
        mode === "encode" ? encodeBase64(textInput) : decodeBase64(textInput);
      setOutput(result);
      flashResult();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed");
      setOutput("");
    }
  }, [mode, textInput, encodeBase64, decodeBase64, flashResult]);

  /** Read a file and convert its contents to Base64 */
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setFileName(file.name);
      setError("");

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.includes(",") ? result.split(",")[1] : result;
        setOutput(base64);
        flashResult();
      };
      reader.onerror = () => setError("Failed to read file");
      reader.readAsDataURL(file);
    },
    [flashResult],
  );

  /** Switch between encode/decode and optionally swap input ↔ output */
  const handleModeSwap = useCallback(
    (newMode: Mode) => {
      if (newMode === mode) return;
      setMode(newMode);
      setInputType("text");
      if (output) {
        setTextInput(output);
        setOutput("");
      }
      setError("");
      setFileName("");
    },
    [mode, output],
  );

  return (
    <div className="space-y-6">
      {/* Mode & Input Type selectors */}
      <div className="flex flex-wrap gap-4 p-5 rounded-xl bg-surface border border-border">
        {/* Encode / Decode toggle */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-medium text-muted uppercase tracking-wider">
            Mode
          </label>
          <div className="flex rounded-lg border border-border overflow-hidden">
            {(["encode", "decode"] as const).map((m) => (
              <button
                key={m}
                onClick={() => handleModeSwap(m)}
                className={`px-4 py-2 text-sm font-medium capitalize cursor-pointer transition-all duration-200
                  ${
                    mode === m
                      ? "bg-accent/15 text-accent"
                      : "bg-bg text-muted hover:text-white"
                  }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Text / File toggle (encode only) */}
        {mode === "encode" && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-muted uppercase tracking-wider">
              Input
            </label>
            <div className="flex rounded-lg border border-border overflow-hidden">
              {(["text", "file"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setInputType(t);
                    setOutput("");
                    setError("");
                    setFileName("");
                  }}
                  className={`px-4 py-2 text-sm font-medium capitalize cursor-pointer transition-all duration-200
                    ${
                      inputType === t
                        ? "bg-accent/15 text-accent"
                        : "bg-bg text-muted hover:text-white"
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="rounded-xl bg-surface border border-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <span className="text-[11px] font-medium text-muted uppercase tracking-wider">
            {mode === "encode"
              ? inputType === "file"
                ? "File Input"
                : "Text Input"
              : "Base64 Input"}
          </span>
        </div>

        {inputType === "file" && mode === "encode" ? (
          <div className="p-5">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-8 rounded-lg border-2 border-dashed border-border cursor-pointer
                hover:border-accent/50 text-muted hover:text-white
                transition-all duration-200 flex flex-col items-center gap-2"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              <span className="text-sm font-medium">
                {fileName || "Click to select a file"}
              </span>
            </button>
          </div>
        ) : (
          <div className="p-4">
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={
                mode === "encode"
                  ? "Enter text to encode…"
                  : "Paste Base64 to decode…"
              }
              rows={5}
              className="w-full bg-bg/50 border border-border/50 rounded-lg px-4 py-3 text-sm text-white
                placeholder-muted/50 font-mono outline-none resize-y
                focus:border-accent focus:shadow-[0_0_8px_rgba(36,228,167,0.2)]
                transition-all duration-200"
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={handleConvert}
                disabled={!textInput.trim()}
                className="px-6 py-2 rounded-lg bg-accent text-bg text-sm font-semibold cursor-pointer
                  hover:shadow-[0_0_16px_rgba(36,228,167,0.35)] active:scale-95
                  transition-all duration-200
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                {mode === "encode" ? "Encode" : "Decode"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm animate-[pop-in_0.3s_ease-out]">
          {error}
        </div>
      )}

      {/* Output */}
      {output && (
        <div
          className={`rounded-xl bg-surface border border-border overflow-hidden
            ${animateResult ? "animate-[pop-in_0.3s_ease-out]" : ""}`}
        >
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <span className="text-[11px] font-medium text-muted uppercase tracking-wider">
              {mode === "encode" ? "Base64 Output" : "Decoded Output"}
            </span>
            <CopyButton text={output} />
          </div>
          <div className="p-4">
            <pre className="text-sm text-accent font-mono whitespace-pre-wrap break-all bg-bg/50 border border-border/50 rounded-lg px-4 py-3 max-h-64 overflow-y-auto select-all">
              {output}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
