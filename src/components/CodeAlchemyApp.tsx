import { Icon } from "@iconify/react";
import { useEffect, useMemo, useRef, useState } from "react";

type ThemeMode = "dark" | "light";
type ToolKey = "guid" | "base64";

type ToastState = {
  id: number;
  text: string;
};

const APP_NAME = "Code Alchemy";
const APP_VERSION = "v0.0.1";

const tools: Array<{ key: ToolKey; label: string; icon: string }> = [
  { key: "guid", label: "GUID Generator", icon: "tabler:fingerprint" },
  { key: "base64", label: "Base64 Converter", icon: "tabler:file-code-2" },
];

const toBase64 = (bytes: Uint8Array) => {
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
};

const fromTextToBase64 = (value: string) => {
  const encoded = new TextEncoder().encode(value);
  return toBase64(encoded);
};

const createGuid = () => {
  const source = crypto.randomUUID();
  return source;
};

const CopyButton = ({
  value,
  onCopied,
  disabled = false,
}: {
  value: string;
  onCopied: () => void;
  disabled?: boolean;
}) => {
  const [copied, setCopied] = useState(false);

  const copyValue = async () => {
    if (!value || disabled) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    onCopied();
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <button
      type="button"
      className={`action-button ${copied ? "copied" : ""}`}
      onClick={() => {
        void copyValue();
      }}
      disabled={disabled || !value}
    >
      <Icon icon={copied ? "tabler:check" : "tabler:copy"} width="16" />
      {copied ? "Copied" : "Copy"}
    </button>
  );
};

const GuidTool = ({ onToast }: { onToast: () => void }) => {
  const [guidOutput, setGuidOutput] = useState<string>("");

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
};

const Base64Tool = ({ onToast }: { onToast: () => void }) => {
  const [plainText, setPlainText] = useState("");
  const [base64Result, setBase64Result] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  const convertText = () => {
    setBase64Result(fromTextToBase64(plainText));
    setSelectedFileName("");
  };

  const handleFileConvert = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const targetFile = event.target.files?.[0];
    if (!targetFile) return;

    const fileBuffer = await targetFile.arrayBuffer();
    const fileBytes = new Uint8Array(fileBuffer);
    setBase64Result(toBase64(fileBytes));
    setSelectedFileName(targetFile.name);
  };

  return (
    <section className="tool-card tool-result-pop">
      <header className="tool-header stagger-1">
        <h2>Base64 Converter</h2>
        <p>Encode text or files into Base64 output.</p>
      </header>

      <label className="field-label stagger-2" htmlFor="plainTextInput">
        Text Input
      </label>
      <textarea
        id="plainTextInput"
        className="editor-area stagger-3"
        value={plainText}
        onChange={(event) => setPlainText(event.target.value)}
        placeholder="Type text to encode"
      />

      <div className="tool-actions stagger-4">
        <button
          type="button"
          className="action-button primary"
          onClick={convertText}
          disabled={!plainText}
        >
          <Icon icon="tabler:file-export" width="16" />
          Encode Text
        </button>
        <label className="action-button upload" htmlFor="fileConvertInput">
          <Icon icon="tabler:upload" width="16" />
          Encode File
        </label>
        <input
          id="fileConvertInput"
          type="file"
          onChange={(event) => void handleFileConvert(event)}
        />
        <CopyButton
          value={base64Result}
          onCopied={onToast}
          disabled={!base64Result}
        />
      </div>

      {selectedFileName ? (
        <p className="file-meta">Encoded file: {selectedFileName}</p>
      ) : null}

      <label className="field-label" htmlFor="base64Output">
        Base64 Output
      </label>
      <textarea
        id="base64Output"
        className="result-area"
        value={base64Result}
        readOnly
        placeholder="Base64 output appears here"
      />
    </section>
  );
};

const ToolSkeleton = () => (
  <section className="tool-card skeleton-wrapper">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-line" />
    <div className="skeleton skeleton-line" />
    <div className="skeleton skeleton-block" />
    <div className="skeleton skeleton-block" />
  </section>
);

export default function CodeAlchemyApp() {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [activeTool, setActiveTool] = useState<ToolKey>("guid");
  const [displayedTool, setDisplayedTool] = useState<ToolKey>("guid");
  const [isSwitchingTool, setIsSwitchingTool] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<ToolKey, HTMLButtonElement | null>>({
    guid: null,
    base64: null,
  });
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0 });

  useEffect(() => {
    const storedTheme = localStorage.getItem("code-alchemy-theme");
    if (storedTheme === "dark" || storedTheme === "light") {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("code-alchemy-theme", theme);
  }, [theme]);

  useEffect(() => {
    const target = itemRefs.current[activeTool];
    const container = sidebarRef.current;
    if (!target || !container) return;

    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    setIndicatorStyle({
      top: targetRect.top - containerRect.top,
      height: targetRect.height,
    });
  }, [activeTool]);

  useEffect(() => {
    if (!isTyping) return;
    const stopTyping = window.setTimeout(() => setIsTyping(false), 500);
    return () => window.clearTimeout(stopTyping);
  }, [searchValue, isTyping]);

  useEffect(() => {
    if (!toast) return;
    const toastTimer = window.setTimeout(() => setToast(null), 2000);
    return () => window.clearTimeout(toastTimer);
  }, [toast]);

  const filteredTools = useMemo(
    () =>
      tools.filter((tool) =>
        tool.label.toLowerCase().includes(searchValue.toLowerCase()),
      ),
    [searchValue],
  );

  const handleToolChange = (tool: ToolKey) => {
    setActiveTool(tool);
    setIsSwitchingTool(true);
    window.setTimeout(() => {
      setDisplayedTool(tool);
      setIsSwitchingTool(false);
    }, 300);
  };

  const showCopyToast = () => {
    setToast({ id: Date.now(), text: "Copied to clipboard" });
  };

  return (
    <main className="app-shell layout-reveal">
      <aside className="sidebar">
        <header className="brand-wrap">
          <div className="logo-mark">
            <Icon icon="tabler:flask-2" width="18" />
          </div>
          <h1 className="app-logo">{APP_NAME}</h1>
        </header>

        <div className={`search-shell ${isTyping ? "typing" : ""}`}>
          <Icon icon="tabler:search" width="16" className="search-icon" />
          <input
            type="text"
            value={searchValue}
            onChange={(event) => {
              setSearchValue(event.target.value);
              setIsTyping(true);
            }}
            placeholder="Search tools"
            aria-label="Search tools"
          />
        </div>

        <div className="tool-list" ref={sidebarRef}>
          <div
            className="active-indicator"
            style={{ top: indicatorStyle.top, height: indicatorStyle.height }}
          />
          {filteredTools.map((tool) => (
            <button
              key={tool.key}
              type="button"
              ref={(node) => {
                itemRefs.current[tool.key] = node;
              }}
              className={`tool-item ${activeTool === tool.key ? "active" : ""}`}
              onClick={() => handleToolChange(tool.key)}
            >
              <Icon icon={tool.icon} width="18" />
              <span>{tool.label}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className="settings-button"
          onClick={() => setShowSettings(true)}
        >
          <Icon icon="tabler:settings" width="18" />
          Settings
        </button>
      </aside>

      <section className="content-panel ambient-gradient">
        <div
          className={`content-switch ${isSwitchingTool ? "switching" : "show"}`}
        >
          {isSwitchingTool ? <ToolSkeleton /> : null}
          {!isSwitchingTool && displayedTool === "guid" ? (
            <GuidTool onToast={showCopyToast} />
          ) : null}
          {!isSwitchingTool && displayedTool === "base64" ? (
            <Base64Tool onToast={showCopyToast} />
          ) : null}
        </div>
      </section>

      {showSettings ? (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setShowSettings(false)}
        >
          <div
            className="settings-modal"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <header>
              <h2 className="app-logo">{APP_NAME}</h2>
              <button
                type="button"
                className="icon-close"
                onClick={() => setShowSettings(false)}
              >
                <Icon icon="tabler:x" width="18" />
              </button>
            </header>
            <p>Version: {APP_VERSION}</p>
            <div className="theme-row">
              <span>Current Theme: {theme}</span>
              <button
                type="button"
                className="action-button primary"
                onClick={() =>
                  setTheme((value) => (value === "dark" ? "light" : "dark"))
                }
              >
                <Icon
                  icon={theme === "dark" ? "tabler:sun" : "tabler:moon"}
                  width="16"
                />
                Switch Theme
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div key={toast.id} className="toast">
          <Icon icon="tabler:check" width="16" />
          {toast.text}
        </div>
      ) : null}
    </main>
  );
}
