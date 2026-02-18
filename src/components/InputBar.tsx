import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import plusIcon from "../assets/Plus.svg";

interface InputBarProps {
  variant?: "welcome" | "default";
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
  onFocus?: () => void;
  disabled?: boolean;
  autoFocus?: boolean;
  fixedAtBottom?: boolean;
}

export function InputBar({
  variant = "default",
  placeholder = "Where to?",
  value: controlledValue,
  onChange,
  onSubmit,
  onFocus,
  disabled = false,
  autoFocus = false,
  fixedAtBottom = false,
}: InputBarProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const MIN_HEIGHT = 24;
  const MAX_HEIGHT = 120;
  const SINGLE_LINE_THRESHOLD = 36; // above this = multiline, buttons align bottom
  const [internalValue, setInternalValue] = useState("");
  const [textareaHeight, setTextareaHeight] = useState(MIN_HEIGHT);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  const isMultiline = textareaHeight > SINGLE_LINE_THRESHOLD;

  // Try programmatic focus on mount (works on desktop; iOS requires a direct tap)
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [autoFocus]);

  // Auto-resize textarea as content grows (upward), track height for alignment
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    const newHeight = Math.min(Math.max(el.scrollHeight, MIN_HEIGHT), MAX_HEIGHT);
    el.style.height = `${newHeight}px`;
    setTextareaHeight(newHeight);
  }, [value]);
  const handleChange = (newValue: string) => {
    if (isControlled) {
      onChange?.(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  const isWelcome = variant === "welcome";

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit?.();
    }
  };

  const barPadding = {
    padding: "var(--action-bar-padding-y) var(--action-bar-padding-x) 0",
    paddingBottom: 0,
  };

  const fixedWrapperStyle = fixedAtBottom
    ? {
        position: "fixed" as const,
        bottom: 34,
        left: 0,
        right: 0,
        zIndex: 10,
        maxWidth: 390,
        margin: "0 auto",
        marginBottom: 0,
        width: "100%",
        background: "linear-gradient(180deg, rgba(229, 238, 248, 0.98) 0%, #E5EEF8 100%)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }
    : {};

  return (
    <div
      style={{
        ...barPadding,
        ...fixedWrapperStyle,
      }}
    >
      <div
        className={isWelcome ? "input-bar-welcome" : ""}
        style={{
          display: "flex",
          alignItems: isWelcome ? "center" : (isMultiline ? "flex-end" : "center"),
          gap: 0,
          background: isWelcome
            ? "rgba(255, 255, 255, 0.25)"
            : "var(--color-bg-card)",
          backdropFilter: isWelcome ? "blur(12px)" : "none",
          WebkitBackdropFilter: isWelcome ? "blur(12px)" : "none",
          borderRadius: "var(--radius-xl)",
          minHeight: "var(--action-bar-height)",
          boxSizing: "border-box",
          paddingTop: isMultiline ? 0 : 0,
          paddingRight: 8,
          paddingBottom: isMultiline ? 8 : 0,
          paddingLeft: 8,
          boxShadow: isWelcome ? "none" : "0 2px 12px var(--color-shadow)",
          border: isWelcome ? "1px solid rgba(255,255,255,0.3)" : "1px solid var(--color-border)",
          transition: "background 0.2s",
        }}
      >
        {isWelcome ? (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              flexShrink: 0,
            }}
          />
        ) : (
          <motion.button
            whileTap={{ scale: 0.96 }}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "1px solid rgba(255, 255, 255, 0.35)",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <img src={plusIcon} alt="" width={24} height={24} />
          </motion.button>
        )}

        <label
          htmlFor="chat-input"
          style={{
            flex: 1,
            minHeight: MIN_HEIGHT,
            minWidth: 0,
            display: "flex",
            cursor: "text",
            touchAction: "manipulation",
          }}
        >
          <textarea
            id="chat-input"
            ref={inputRef}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            disabled={disabled}
            placeholder={placeholder}
            rows={1}
            style={{
              flex: 1,
              minHeight: MIN_HEIGHT,
              maxHeight: MAX_HEIGHT,
              width: "100%",
              resize: "none",
              overflowY: "auto",
              border: "none",
              background: "transparent",
              fontSize: 16,
              fontWeight: 400,
              color: isWelcome ? "#fff" : "var(--color-text)",
              outline: "none",
              lineHeight: 1.4,
            }}
          />
        </label>

        {value.trim() ? (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onSubmit}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "none",
              background: "#6A6A6A",
              cursor: "pointer",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginLeft: 8,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ transform: "rotate(-90deg)" }}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.button>
        ) : null}
      </div>
    </div>
  );
}
