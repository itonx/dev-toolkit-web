import type { ToolItem } from "./types";

export const APP_NAME = "Code Alchemy";
export const APP_VERSION = "v0.0.1";

export const tools: ToolItem[] = [
  { key: "guid", label: "GUID Generator", icon: "tabler:fingerprint" },
  { key: "base64", label: "Base64 Converter", icon: "tabler:file-code-2" },
];
