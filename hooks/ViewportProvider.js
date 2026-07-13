// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";

export const ViewportContext = createContext(null);

const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
};

const DESKTOP_WIDTH = 1280;
const MOBILE_WIDTH = 360;
const TABLET_WIDTH = 800;

export const ViewportProvider = ({ children, type }) => {
  const frameRef = useRef(null);

  const [viewport, setViewport] = useState(() => ({
    width: 0,
    height: 0,
  }));

  const [viewportSimulated, setViewportSimulated] = useState(() => ({
    width: 0,
    height: 0,
  }));

  const resetSimulation = useCallback(() => {
    setViewportSimulated({ width: 0, height: 0 });
  }, [setViewportSimulated]);

  const simulateDesktop = useCallback(() => {
    if (viewportSimulated.width === DESKTOP_WIDTH) {
      setViewportSimulated({ width: 0, height: 0 });
    } else {
      setViewportSimulated({ width: DESKTOP_WIDTH, height: viewport.height });
    }
  }, [setViewportSimulated, viewport.height, viewportSimulated.width]);

  const simulateMobile = useCallback(() => {
    if (viewportSimulated.width === MOBILE_WIDTH) {
      setViewportSimulated({ width: 0, height: 0 });
    } else {
      setViewportSimulated({ width: MOBILE_WIDTH, height: viewport.height });
    }
  }, [setViewportSimulated, viewport.height, viewportSimulated.width]);

  const simulateTablet = useCallback(() => {
    if (viewportSimulated.width === TABLET_WIDTH) {
      setViewportSimulated({ width: 0, height: 0 });
    } else {
      setViewportSimulated({ width: TABLET_WIDTH, height: viewport.height });
    }
  }, [setViewportSimulated, viewport.height, viewportSimulated.width]);

  useEffect(() => {
    function updateViewport() {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      frameRef.current = null;
    }

    function handleResize() {
      if (frameRef.current !== null) {
        return;
      }

      frameRef.current = requestAnimationFrame(updateViewport);
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const value = useMemo(() => {
    const simulatedWidth = viewportSimulated.width;
    const simulatedHeight = viewportSimulated.height;

    const width = simulatedWidth !== 0 && simulatedHeight !== 0 ? simulatedWidth : viewport.width;
    const widthOriginal = viewport.width;

    const height = simulatedWidth !== 0 && simulatedHeight !== 0 ? simulatedHeight : viewport.height;
    const heightOriginal = viewport.height;

    const hasViewport = width > 0 && height > 0;
    const hasViewportOriginal = widthOriginal > 0 && heightOriginal > 0;

    const isMobile = (!hasViewport && type === "mobile") || (hasViewport && width <= BREAKPOINTS.mobile);
    const isMobileOriginal = (!hasViewportOriginal && type === "mobile") || (hasViewportOriginal && widthOriginal <= BREAKPOINTS.mobile);

    const isTablet = (!hasViewport && type === "tablet") || (hasViewport && width > BREAKPOINTS.mobile && width <= BREAKPOINTS.tablet);
    const isTabletOriginal = (!hasViewportOriginal && type === "tablet") || (hasViewportOriginal && widthOriginal > BREAKPOINTS.mobile && widthOriginal <= BREAKPOINTS.tablet);

    const isDesktop = (!hasViewport && type === "desktop") || (hasViewport && width > BREAKPOINTS.tablet);
    const isDesktopOriginal = (!hasViewportOriginal && type === "desktop") || (hasViewportOriginal && widthOriginal > BREAKPOINTS.tablet);

    const orientation = width > height ? "landscape" : "portrait";
    const orientationOriginal = widthOriginal > heightOriginal ? "landscape" : "portrait";

    const name = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";
    const nameOriginal = isMobileOriginal ? "mobile" : isTabletOriginal ? "tablet" : "desktop";

    return {
      height,
      heightOriginal,
      isDesktop,
      isDesktopOriginal,
      isMobile,
      isMobileOriginal,
      isTablet,
      isTabletOriginal,
      name,
      nameOriginal,
      orientation,
      orientationOriginal,
      resetSimulation,
      simulateDesktop,
      simulateMobile,
      simulateTablet,
      width,
      widthOriginal,
    };
  }, [resetSimulation, simulateDesktop, simulateMobile, simulateTablet, type, viewport.height, viewport.width, viewportSimulated.height, viewportSimulated.width]);

  return <ViewportContext.Provider value={value}>{children}</ViewportContext.Provider>;
};
