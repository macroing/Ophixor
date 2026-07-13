// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

export function createButtonThemeForBrushedMetal(theme = "default") {
  return {
    background: `linear-gradient(180deg, ${theme === "blue" ? "#4f8dff" : theme === "gold" ? "#facc15" : "#f4f4f5"}, ${theme === "blue" ? "#2563eb" : theme === "gold" ? "#d97706" : "#e4e4e7"})`,
    backgroundColor: "transparent",
    backgroundColorHover: "transparent",
    backgroundHover: `linear-gradient(180deg, ${theme === "blue" ? "#4f8dff" : theme === "gold" ? "#facc15" : "#f4f4f5"}, ${theme === "blue" ? "#2563eb" : theme === "gold" ? "#d97706" : "#e4e4e7"})`,
    borderColor: theme === "blue" ? "#1e40af" : theme === "gold" ? "#92400e" : "#d4d4d8",
    borderColorHover: theme === "blue" ? "#1e40af" : theme === "gold" ? "#92400e" : "#d4d4d8",
    boxShadow: theme === "blue" ? "inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 4px 12px rgba(37, 99, 235, 0.35)" : theme === "gold" ? "inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 4px 12px rgba(217, 119, 6, 0.35)" : "inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 4px 12px rgba(0, 0, 0, 0.08)",
    boxShadowActive: theme === "blue" ? "inset 0 4px 10px rgba(0, 0, 0, 0.35)" : theme === "gold" ? "inset 0 4px 10px rgba(0, 0, 0, 0.4)" : "inset 0 3px 6px rgba(0, 0, 0, 0.15)",
    boxShadowHover: theme === "blue" ? "inset 0 1px 0 rgba(255, 255, 255, 0.35), 0 8px 22px rgba(37, 99, 235, 0.45)" : theme === "gold" ? "inset 0 1px 0 rgba(255, 255, 255, 0.35), 0 8px 22px rgba(217, 119, 6, 0.45)" : "inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 6px 18px rgba(0, 0, 0, 0.12)",
    color: theme === "blue" ? "#dbeafe" : theme === "gold" ? "#fff7ed" : "#6b7280",
    colorHover: theme === "blue" ? "#dbeafe" : theme === "gold" ? "#fff7ed" : "#6b7280",
    textShadow: theme === "blue" ? "0 1px 0 rgba(255, 255, 255, 0.2), 0 -1px 1px rgba(0, 0, 0, 0.4)" : theme === "gold" ? "0 1px 0 rgba(255, 255, 255, 0.2), 0 -1px 1px rgba(0, 0, 0, 0.4)" : "0 1px 0 #ffffff, 0 -1px 1px rgba(0, 0, 0, 0.25)",
    textShadowHover: theme === "blue" ? "0 1px 0 rgba(255, 255, 255, 0.2), 0 -1px 1px rgba(0, 0, 0, 0.4)" : theme === "gold" ? "0 1px 0 rgba(255, 255, 255, 0.2), 0 -1px 1px rgba(0, 0, 0, 0.4)" : "0 1px 0 #ffffff, 0 -1px 1px rgba(0, 0, 0, 0.25)",
  };
}
