import { Icon } from "@iconify/react";
import { useState } from "react";
import { minify as minifyJs } from "terser";
import CopyButton from "../CopyButton";
import type { ThemeMode } from "../types";

type MinifierToolProps = {
  theme: ThemeMode;
  onToast: () => void;
};

type MinifierMode = "javascript" | "html" | "css" | "xml" | "sql" | "json";

const minifyXml = (value: string) =>
  value
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .trim();

const minifySql = (value: string) =>
  value
    .replace(/\s+/g, " ")
    .replace(/\s*,\s*/g, ",")
    .replace(/\s*\(\s*/g, "(")
    .replace(/\s*\)\s*/g, ")")
    .trim();

const minifyCss = (value: string) =>
  value
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>+~])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();

const minifyHtml = (value: string) =>
  value
    .replace(/<!--([\s\S]*?)-->/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .trim();

export default function MinifierTool({ theme, onToast }: MinifierToolProps) {
  const [mode, setMode] = useState<MinifierMode>("javascript");
  const [source, setSource] = useState("");
  const [output, setOutput] = useState("");
  const [errorText, setErrorText] = useState("");

  const runMinify = async () => {
    if (!source.trim()) {
      setOutput("");
      setErrorText("");
      return;
    }

    try {
      if (mode === "javascript") {
        const result = await minifyJs(source, {
          compress: true,
          mangle: true,
        });
        setOutput(result.code ?? "");
      }

      if (mode === "html") {
        setOutput(minifyHtml(source));
      }

      if (mode === "css") {
        setOutput(minifyCss(source));
      }

      if (mode === "xml") {
        setOutput(minifyXml(source));
      }

      if (mode === "sql") {
        setOutput(minifySql(source));
      }

      if (mode === "json") {
        setOutput(JSON.stringify(JSON.parse(source)));
      }

      setErrorText("");
    } catch {
      setErrorText(`Unable to minify this input as ${mode.toUpperCase()}.`);
    }
  };

  return (
    <section className="tool-card tool-result-pop full-height formatter-tool">
      <header className="tool-header stagger-1">
        <h2>Code Minifier</h2>
        <p>Minify common code and markup formats.</p>
      </header>

      <div className="formatter-controls stagger-2">
        <select
          className="compact-input minifier-select"
          value={mode}
          onChange={(event) => setMode(event.target.value as MinifierMode)}
        >
          <option value="javascript">JavaScript</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="xml">XML</option>
          <option value="sql">SQL</option>
          <option value="json">JSON</option>
        </select>

        <button
          type="button"
          className="action-button primary"
          onClick={() => void runMinify()}
        >
          <Icon icon="tabler:arrows-minimize" width="16" />
          Minify
        </button>
      </div>

      <div className="formatter-grid stagger-3">
        <div className="formatter-column">
          <div className="output-head formatter-head">
            <label className="field-label" htmlFor="minifierInput">
              Input
            </label>
            <span className="ghost-copy">Copy</span>
          </div>
          <textarea
            id="minifierInput"
            className="editor-area formatter-input"
            value={source}
            onChange={(event) => setSource(event.target.value)}
            placeholder="Paste content to minify"
          />
        </div>

        <div className="formatter-column">
          <div className="output-head formatter-head">
            <label className="field-label" htmlFor="minifierOutput">
              Minified Output
            </label>
            <CopyButton value={output} onCopied={onToast} disabled={!output} />
          </div>

          <div id="minifierOutput" className={`code-preview ${theme}`}>
            {output ? (
              <pre>
                <code>{output}</code>
              </pre>
            ) : (
              <p className="empty-code">Minified output appears here.</p>
            )}
          </div>

          {errorText ? <p className="error-meta">{errorText}</p> : null}
        </div>
      </div>
    </section>
  );
}
