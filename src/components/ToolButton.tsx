import {
  useState,
  useRef,
  useCallback,
  type CSSProperties,
  type MouseEvent,
} from "react";
import type { Tool } from "../types/tool";

interface ToolButtonProps {
  tool: Tool;
  isActive: boolean;
  onClick: () => void;
  style?: CSSProperties;
}

/**
 * ToolButton - Sidebar tool selection button
 * Implements hover animations, ripple effect, and active state styling
 */
export function ToolButton({
  tool,
  isActive,
  onClick,
  style,
}: ToolButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleIdRef = useRef(0);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      // Create ripple effect
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = rippleIdRef.current++;

        setRipples((prev) => [...prev, { id, x, y }]);

        // Remove ripple after animation
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id));
        }, 600);
      }

      onClick();
    },
    [onClick],
  );

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left overflow-hidden transition-all duration-200 ease-out animate-fade-in"
      style={{
        backgroundColor: isActive
          ? "var(--color-surface)"
          : isHovered
            ? "rgba(42, 52, 66, 0.5)"
            : "transparent",
        border: `1px solid ${
          isActive
            ? "var(--color-accent)"
            : isHovered
              ? "var(--color-border)"
              : "transparent"
        }`,
        boxShadow: isActive
          ? "0 0 20px var(--color-accent-glow), 0 4px 12px rgba(0,0,0,0.2)"
          : isHovered
            ? "0 4px 12px rgba(0,0,0,0.15)"
            : "none",
        transform: isActive
          ? "scale(1.02)"
          : isHovered
            ? "translateY(-2px)"
            : "scale(1)",
        ...style,
      }}
    >
      {/* Left Accent Bar */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 rounded-full transition-all duration-200"
        style={{
          backgroundColor: "var(--color-accent)",
          height: isActive ? "70%" : isHovered ? "100%" : "0%",
          opacity: isActive || isHovered ? 1 : 0,
        }}
      />

      {/* Tool Icon */}
      <span
        className="text-xl transition-transform duration-200"
        style={{
          transform: isHovered
            ? "scale(1.1) rotate(5deg)"
            : "scale(1) rotate(0)",
          filter: isActive ? "brightness(1.2)" : "brightness(1)",
        }}
      >
        {tool.icon}
      </span>

      {/* Tool Info */}
      <div
        className="flex-1 transition-transform duration-200"
        style={{
          transform: isHovered ? "translateX(6px)" : "translateX(0)",
        }}
      >
        <div
          className="font-medium text-sm transition-all duration-200"
          style={{
            color: isActive ? "var(--color-accent)" : "var(--color-text)",
            fontWeight: isHovered || isActive ? 600 : 500,
          }}
        >
          {tool.name}
        </div>
        <div
          className="text-xs truncate"
          style={{ color: "var(--color-muted)" }}
        >
          {tool.description}
        </div>
      </div>

      {/* Active Indicator */}
      {isActive && (
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: "var(--color-accent)" }}
        />
      )}

      {/* Ripple Effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 20,
            height: 20,
            marginLeft: -10,
            marginTop: -10,
          }}
        />
      ))}
    </button>
  );
}
