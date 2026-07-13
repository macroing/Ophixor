// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useMediaQuery } from "./useMediaQuery";

const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
};

export function useBreakpoint() {
  const isXs = useMediaQuery(`(max-width: ${BREAKPOINTS.xs}px)`);
  const isSm = useMediaQuery(`(max-width: ${BREAKPOINTS.sm}px)`);
  const isMd = useMediaQuery(`(max-width: ${BREAKPOINTS.md}px)`);
  const isLg = useMediaQuery(`(max-width: ${BREAKPOINTS.lg}px)`);
  const isXl = useMediaQuery(`(max-width: ${BREAKPOINTS.xl}px)`);

  let current = "xxl";

  if (isXs) {
    current = "xs";
  } else if (isSm) {
    current = "sm";
  } else if (isMd) {
    current = "md";
  } else if (isLg) {
    current = "lg";
  } else if (isXl) {
    current = "xl";
  }

  return {
    current,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
  };
}
