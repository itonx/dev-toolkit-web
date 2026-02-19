import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import SettingsModal from "./app/SettingsModal";
import Sidebar from "./app/Sidebar";
import ToolSkeleton from "./app/ToolSkeleton";
import Base64Tool from "./app/tools/Base64Tool";
import GuidTool from "./app/tools/GuidTool";
import type { ThemeMode, ToastState, ToolKey } from "./app/types";

export default function CodeAlchemyApp() {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [activeTool, setActiveTool] = useState<ToolKey>("guid");
  const [displayedTool, setDisplayedTool] = useState<ToolKey>("guid");
  const [isSwitchingTool, setIsSwitchingTool] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

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
    if (!isTyping) return;
    const stopTyping = window.setTimeout(() => setIsTyping(false), 500);
    return () => window.clearTimeout(stopTyping);
  }, [searchValue, isTyping]);

  useEffect(() => {
    if (!toast) return;
    const toastTimer = window.setTimeout(() => setToast(null), 2000);
    return () => window.clearTimeout(toastTimer);
  }, [toast]);

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
      <Sidebar
        activeTool={activeTool}
        searchValue={searchValue}
        isTyping={isTyping}
        onToolChange={handleToolChange}
        onSearchChange={(value) => {
          setSearchValue(value);
          setIsTyping(true);
        }}
        onOpenSettings={() => setShowSettings(true)}
      />

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
        <SettingsModal
          theme={theme}
          onClose={() => setShowSettings(false)}
          onToggleTheme={() =>
            setTheme((value) => (value === "dark" ? "light" : "dark"))
          }
        />
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
