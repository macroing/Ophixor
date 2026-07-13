// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

export const MAX_HISTORY = 50;

export function pageHistoryReducer(state, action) {
  switch (action.type) {
    case "SET_PAGE": {
      const nextPage = typeof action.updater === "function" ? action.updater(state.present) : action.page;

      return {
        past: [...state.past, state.present].slice(-MAX_HISTORY),
        present: nextPage,
        future: [],
      };
    }
    case "UNDO": {
      if (state.past.length === 0) {
        return state;
      }

      const previous = state.past[state.past.length - 1];

      return {
        past: state.past.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future],
      };
    }
    case "REDO": {
      if (state.future.length === 0) {
        return state;
      }

      const next = state.future[0];

      return {
        past: [...state.past, state.present],
        present: next,
        future: state.future.slice(1),
      };
    }
    case "REPLACE_PAGE":
      return {
        ...state,
        present: action.page,
      };
    default:
      return state;
  }
}
