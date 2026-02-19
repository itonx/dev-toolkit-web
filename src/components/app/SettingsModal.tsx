import { Icon } from "@iconify/react";
import { APP_NAME, APP_VERSION } from "./constants";
import type { ThemeMode } from "./types";

type SettingsModalProps = {
  theme: ThemeMode;
  onClose: () => void;
  onToggleTheme: () => void;
};

export default function SettingsModal({
  theme,
  onClose,
  onToggleTheme,
}: SettingsModalProps) {
  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="settings-modal"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <header>
          <h2 className="app-logo">{APP_NAME}</h2>
          <button type="button" className="icon-close" onClick={onClose}>
            <Icon icon="tabler:x" width="18" />
          </button>
        </header>
        <p>Version: {APP_VERSION}</p>
        <div className="theme-row">
          <span>Current Theme: {theme}</span>
          <button
            type="button"
            className="action-button primary"
            onClick={onToggleTheme}
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
  );
}
