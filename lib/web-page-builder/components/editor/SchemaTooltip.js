// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useEffect, useRef, useState } from "react";

import { useOverlay } from "./useOverlay";

import importedStyles from "./SchemaTooltip.module.css";

export default function SchemaTooltip(props) {
  const children = props.children;
  const schema = props.schema;
  const styles = props.styles || importedStyles;

  const { setTooltip } = useOverlay();

  const containerRef = useRef(null);
  const timeoutRef = useRef(null);
  const tooltipRef = useRef(null);

  const [isHovering, setIsHovering] = useState(false);

  function onMouseEnter(e) {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    setIsHovering(false);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (tooltipRef.current) {
      tooltipRef.current = <TooltipImpl containerRef={containerRef} isHovering={isHovering} position={{ x, y }} schema={schema} setIsHovering={setIsHovering} styles={styles} tooltipRef={tooltipRef} />;

      setTooltip(tooltipRef.current);
    } else {
      setTooltip(null);

      timeoutRef.current = setTimeout(() => {
        tooltipRef.current = <TooltipImpl containerRef={containerRef} isHovering={isHovering} position={{ x, y }} schema={schema} setIsHovering={setIsHovering} styles={styles} tooltipRef={tooltipRef} />;

        setTooltip(tooltipRef.current);
      }, 1000);
    }
  }

  function onMouseLeave(e) {
    const rect = e.currentTarget.getBoundingClientRect();

    const minX = Math.ceil(rect.left);
    const minY = Math.ceil(rect.top);
    const maxX = Math.floor(rect.right);
    const maxY = Math.floor(rect.bottom);

    const x = e.clientX;
    const y = e.clientY;

    const isInside = x >= minX && x < maxX && y >= minY && y < maxY;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!isInside && !isHovering) {
      tooltipRef.current = null;

      setTooltip(null);
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.schema_tooltip_container} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} ref={containerRef}>
      {children}
    </div>
  );
}

function TooltipImpl(props) {
  const containerRef = props.containerRef;
  const isHovering = props.isHovering;
  const position = props.position || "right";
  const schema = props.schema;
  const setIsHovering = props.setIsHovering;
  const styles = props.styles || importedStyles;
  const tooltipRef = props.tooltipRef;

  const description = typeof schema?.description === "string" ? schema.description.split(/\n+/)[0] || "No documentation available." : "No documentation available.";

  const { setTooltip } = useOverlay();

  function onMouseEnter(e) {
    setIsHovering(true);
  }

  function onMouseLeave(e) {
    setIsHovering(false);

    setTooltip(null);

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();

      const minX = Math.ceil(rect.left);
      const minY = Math.ceil(rect.top);
      const maxX = Math.floor(rect.right);
      const maxY = Math.floor(rect.bottom);

      const x = e.clientX;
      const y = e.clientY;

      const isInside = x >= minX && x < maxX && y >= minY && y < maxY;

      if (!isInside) {
        tooltipRef.current = null;
      }
    }
  }

  return (
    <div
      className={styles.schema_tooltip}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div className={styles.label}>{schema?.label || "Documentation"}</div>
      <div className={styles.description}>{description}</div>
      {schema?.group && <div className={styles.group}>Group: {schema.group}</div>}
      {schema?.plan && <div className={styles.plan}>Plan: {schema.plan}</div>}
      {schema?.returnType && (
        <div className={styles.return_type}>
          <div className={styles.text}>Returns</div>
          <pre className={styles.value}>{typeof schema.returnType === "string" ? schema.returnType : JSON.stringify(schema.returnType, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
