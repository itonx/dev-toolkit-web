import { Icon } from "@iconify/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { format } from "prettier/standalone";
import * as pluginBabel from "prettier/plugins/babel";
import * as pluginEstree from "prettier/plugins/estree";
import * as pluginHtml from "prettier/plugins/html";
import * as pluginMarkdown from "prettier/plugins/markdown";
import * as pluginPostcss from "prettier/plugins/postcss";
import * as pluginTypescript from "prettier/plugins/typescript";
import * as pluginYaml from "prettier/plugins/yaml";
import Prism from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-yaml";
import type { ThemeMode } from "../types";
import CopyButton from "../CopyButton";
import { ui } from "../uiClasses";

type CodeFormatterToolProps = {
  theme: ThemeMode;
  onToast: () => void;
};

type SupportedLanguage = {
  key: string;
  label: string;
  parser:
    | "babel"
    | "typescript"
    | "json"
    | "css"
    | "html"
    | "markdown"
    | "yaml";
  prism: string;
};

const LANGUAGE_OPTIONS: SupportedLanguage[] = [
  {
    key: "javascript",
    label: "JavaScript",
    parser: "babel",
    prism: "javascript",
  },
  {
    key: "typescript",
    label: "TypeScript",
    parser: "typescript",
    prism: "typescript",
  },
  { key: "json", label: "JSON", parser: "json", prism: "json" },
  { key: "html", label: "HTML", parser: "html", prism: "markup" },
  { key: "css", label: "CSS", parser: "css", prism: "css" },
  { key: "markdown", label: "Markdown", parser: "markdown", prism: "markdown" },
  { key: "yaml", label: "YAML", parser: "yaml", prism: "yaml" },
];

const prettierPlugins = [
  pluginBabel,
  pluginEstree,
  pluginHtml,
  pluginMarkdown,
  pluginPostcss,
  pluginTypescript,
  pluginYaml,
];

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export default function CodeFormatterTool({
  theme,
  onToast,
}: CodeFormatterToolProps) {
  const [sourceCode, setSourceCode] = useState("");
  const [formattedCode, setFormattedCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(
    LANGUAGE_OPTIONS.find((option) => option.key === "json") ??
      LANGUAGE_OPTIONS[0],
  );
  const [languageSearch, setLanguageSearch] = useState("");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [formatError, setFormatError] = useState("");
  const languagePickerRef = useRef<HTMLDivElement | null>(null);

  const visibleLanguages = useMemo(
    () =>
      LANGUAGE_OPTIONS.filter((item) =>
        item.label.toLowerCase().includes(languageSearch.trim().toLowerCase()),
      ),
    [languageSearch],
  );

  const runFormat = async () => {
    if (!sourceCode.trim()) {
      setFormattedCode("");
      setFormatError("");
      return;
    }

    try {
      const output = await format(sourceCode, {
        parser: selectedLanguage.parser,
        plugins: prettierPlugins,
      });
      setFormattedCode(output);
      setFormatError("");
    } catch {
      setFormatError(`Cannot format this input as ${selectedLanguage.label}.`);
    }
  };

  useEffect(() => {
    if (!sourceCode.trim()) {
      setFormattedCode("");
      setFormatError("");
      return;
    }
    void runFormat();
  }, [selectedLanguage.key]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!languagePickerRef.current) return;
      if (!languagePickerRef.current.contains(event.target as Node)) {
        setShowLanguageDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const highlightedHtml = useMemo(() => {
    if (!formattedCode) return "";
    const grammar = Prism.languages[selectedLanguage.prism];
    if (!grammar) return escapeHtml(formattedCode);
    return Prism.highlight(formattedCode, grammar, selectedLanguage.prism);
  }, [formattedCode, selectedLanguage.prism]);

  return (
    <section
      className={`${ui.toolCard} h-full animate-[result-pop_240ms_ease-out]`}
    >
      <header className={ui.toolHeader}>
        <h2 className={ui.toolTitle}>Code Formatter</h2>
        <p className={ui.toolDescription}>
          Format source code with language-aware rules.
        </p>
      </header>

      <div className="relative z-[6] flex items-center gap-2">
        <div className="relative w-full max-w-[300px]" ref={languagePickerRef}>
          <button
            type="button"
            className={`${ui.compactInput} flex items-center justify-between`}
            onClick={() => setShowLanguageDropdown((value) => !value)}
          >
            <span>{selectedLanguage.label}</span>
            <Icon icon="tabler:chevron-down" width="16" />
          </button>

          {showLanguageDropdown ? (
            <div className="absolute left-0 top-[calc(100%+0.4rem)] z-20 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[0_16px_28px_color-mix(in_srgb,var(--accent)_12%,transparent)]">
              <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-2 py-1.5">
                <Icon icon="tabler:search" width="14" />
                <input
                  type="text"
                  value={languageSearch}
                  onChange={(event) => setLanguageSearch(event.target.value)}
                  placeholder="Search language"
                  className="w-full border-0 bg-transparent text-[color-mix(in_srgb,var(--accent)_35%,var(--muted))] outline-none"
                />
              </div>
              <div className="mt-2 flex max-h-[180px] flex-col gap-1 overflow-auto">
                {visibleLanguages.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    className={`rounded-lg border px-2 py-1.5 text-left font-semibold ${
                      selectedLanguage.key === item.key
                        ? "border-[color-mix(in_srgb,var(--accent)_26%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_12%,var(--surface))] text-[var(--accent)]"
                        : "border-transparent bg-transparent text-[color-mix(in_srgb,var(--accent)_35%,var(--muted))]"
                    }`}
                    onClick={() => {
                      setSelectedLanguage(item);
                      setLanguageSearch("");
                      setShowLanguageDropdown(false);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="relative z-[1] grid flex-1 min-h-0 grid-cols-1 gap-3 min-[920px]:grid-cols-2">
        <div className="flex min-h-0 min-w-0 flex-col gap-2">
          <div className="flex min-h-[2.7rem] items-center justify-between gap-3">
            <label className={ui.fieldLabel} htmlFor="formatterInput">
              Input
            </label>
            <button
              type="button"
              className={`${ui.button} ${ui.buttonPrimary}`}
              onClick={() => void runFormat()}
            >
              <Icon icon="tabler:sparkles" width="16" />
              Format
            </button>
          </div>
          <textarea
            id="formatterInput"
            className={`${ui.textArea} min-h-[300px] flex-1`}
            value={sourceCode}
            onChange={(event) => setSourceCode(event.target.value)}
            placeholder="Paste code here"
          />
        </div>

        <div className="flex min-h-0 min-w-0 flex-col gap-2">
          <div className="flex min-h-[2.7rem] items-center justify-between gap-3">
            <label className={ui.fieldLabel} htmlFor="formatterOutput">
              Formatted Output
            </label>
            <CopyButton
              value={formattedCode}
              onCopied={onToast}
              disabled={!formattedCode}
            />
          </div>
          <div
            id="formatterOutput"
            className={`${ui.codePreview} ${theme === "dark" ? "bg-[color-mix(in_srgb,var(--bg)_70%,var(--surface))]" : "bg-[color-mix(in_srgb,var(--surface)_94%,var(--bg))]"}`}
          >
            {formattedCode ? (
              <pre>
                <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
              </pre>
            ) : (
              <p className={ui.emptyMeta}>Formatted code will appear here.</p>
            )}
          </div>
          {formatError ? <p className={ui.errorMeta}>{formatError}</p> : null}
        </div>
      </div>
    </section>
  );
}
