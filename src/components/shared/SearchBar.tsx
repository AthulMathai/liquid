"use client";

import type { ChangeEvent } from "react";
import { Search, X } from "lucide-react";

type SearchBarProps = {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  disabled?: boolean;
};

export default function SearchBar({
  value = "",
  placeholder = "Search...",
  onChange,
  onClear,
  disabled = false,
}: SearchBarProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(event.target.value);
  }

  function handleClear() {
    if (disabled) return;
    onClear?.();
    onChange?.("");
  }

  const hasValue = value.trim().length > 0;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minWidth: 240,
      }}
    >
      <Search
        size={16}
        style={{
          position: "absolute",
          left: 14,
          top: "50%",
          transform: "translateY(-50%)",
          color: "rgb(var(--muted))",
          pointerEvents: "none",
        }}
      />

      <input
        className="input"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          paddingLeft: 40,
          paddingRight: hasValue ? 42 : 14,
          width: "100%",
        }}
      />

      {hasValue ? (
        <button
          type="button"
          onClick={handleClear}
          disabled={disabled}
          aria-label="Clear search"
          className="button button-ghost"
          style={{
            position: "absolute",
            right: 6,
            top: "50%",
            transform: "translateY(-50%)",
            minHeight: 32,
            height: 32,
            padding: "0 10px",
            borderRadius: 10,
          }}
        >
          <X size={14} />
        </button>
      ) : null}
    </div>
  );
}