import { useState, useCallback, type ReactNode } from "react";

interface OutputPanelProps {
  title: string;
  children: ReactNode;
}

/**
 * OutputPanel - Reusable output display panel with pop-in animation
 */
export function OutputPanel({ title, children }: OutputPanelProps) {
  return (
    <section
      className="p-6 rounded-xl animate-pop-in"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      <h2
        className="text-lg font-semibold mb-4"
        style={{ color: "var(--color-text)" }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
