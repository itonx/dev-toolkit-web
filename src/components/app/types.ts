export type ThemeMode = "dark" | "light";
export type ToolKey = "guid" | "base64";

export type ToastState = {
  id: number;
  text: string;
};

export type ToolItem = {
  key: ToolKey;
  label: string;
  icon: string;
};
