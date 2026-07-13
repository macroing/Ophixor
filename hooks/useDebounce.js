// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useCallback, useEffect, useRef } from "react";

export function useDebounce(callback, delay, options = {}) {
  const { leading = false, trailing = true } = options;

  const callbackRef = useRef(callback);
  const hasCalledLeadingRef = useRef(false);
  const lastArgsRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);

      timeoutRef.current = null;
    }

    lastArgsRef.current = null;

    hasCalledLeadingRef.current = false;
  }, []);

  const flush = useCallback(() => {
    if (timeoutRef.current && lastArgsRef.current) {
      clearTimeout(timeoutRef.current);

      timeoutRef.current = null;

      callbackRef.current(...lastArgsRef.current);

      lastArgsRef.current = null;

      hasCalledLeadingRef.current = false;
    }
  }, []);

  const debounced = useCallback(
    (...args) => {
      lastArgsRef.current = args;

      const shouldCallLeading = leading && !timeoutRef.current;

      if (shouldCallLeading) {
        callbackRef.current(...args);

        hasCalledLeadingRef.current = true;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;

        if (trailing && lastArgsRef.current) {
          if (!leading || hasCalledLeadingRef.current === false) {
            callbackRef.current(...lastArgsRef.current);
          }
        }

        lastArgsRef.current = null;

        hasCalledLeadingRef.current = false;
      }, delay);
    },
    [delay, leading, trailing],
  );

  useEffect(() => cancel, [cancel]);

  return { debounced, cancel, flush };
}
