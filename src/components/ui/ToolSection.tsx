import React from "react";

/**
 * Props for the ToolSection component.
 */
export interface ToolSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Provides a styled container for tool content blocks.
 */
export const ToolSection: React.FC<ToolSectionProps> = ({
  title,
  children,
  className,
}) => {
  return (
    <section className={`tool-section ${className ?? ""}`.trim()}>
      <div className="tool-section-title">{title}</div>
      {children}
    </section>
  );
};
