// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useEffect, useRef, useState } from "react";

import { useLanguage } from "@/context/language";
import { useOverlay } from "./useOverlay";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };
import platformData from "@/definitions/platform-data.json" with { type: "json" };

import importedStyles from "./SchemaTooltip.module.css";

export default function SchemaTooltip(props) {
  const children = props.children;
  const kind = props.kind;
  const schema = props.schema;
  const styles = props.styles || importedStyles;
  const type = props.type;

  const { setTooltip } = useOverlay();

  const containerRef = useRef(null);
  const timeoutRef = useRef(null);
  const tooltipRef = useRef(null);

  const [isHovering, setIsHovering] = useState(false);

  function onClick(e) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setTooltip(null);
  }

  function onDragStart(e) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setTooltip(null);
  }

  function onMouseEnter(e) {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    setIsHovering(false);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (tooltipRef.current) {
      tooltipRef.current = <TooltipImpl containerRef={containerRef} isHovering={isHovering} kind={kind} position={{ x, y }} schema={schema} setIsHovering={setIsHovering} styles={styles} tooltipRef={tooltipRef} type={type} />;

      setTooltip(tooltipRef.current);
    } else {
      setTooltip(null);

      timeoutRef.current = setTimeout(() => {
        tooltipRef.current = <TooltipImpl containerRef={containerRef} isHovering={isHovering} kind={kind} position={{ x, y }} schema={schema} setIsHovering={setIsHovering} styles={styles} tooltipRef={tooltipRef} type={type} />;

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
    <div className={styles.schema_tooltip_container} onClick={onClick} onDragStart={onDragStart} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} ref={containerRef}>
      {children}
    </div>
  );
}

function TooltipImpl(props) {
  const containerRef = props.containerRef;
  const isHovering = props.isHovering;
  const kind = props.kind;
  const position = props.position || "right";
  const schema = props.schema;
  const setIsHovering = props.setIsHovering;
  const styles = props.styles || importedStyles;
  const tooltipRef = props.tooltipRef;
  const type = props.type;

  const { language } = useLanguage();

  const description = getDescription(kind, type, language);

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
      <div className={styles.label}>{getLabel(kind, type, language)}</div>
      <div className={styles.description}>{description}</div>
      {schema?.group && (
        <div className={styles.group}>
          {platform.websiteAdmin.pages.editor.tooltip.group[language]}: {schema.group}
        </div>
      )}
      {schema?.plan && (
        <div className={styles.plan}>
          {platform.websiteAdmin.pages.editor.tooltip.plan[language]}: {schema.plan}
        </div>
      )}
      {schema?.returnType && (
        <div className={styles.return_type}>
          <div className={styles.text}>{platform.websiteAdmin.pages.editor.tooltip.returns[language]}</div>
          <pre className={styles.value}>{typeof schema.returnType === "string" ? schema.returnType : JSON.stringify(schema.returnType, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

function getDescription(kind, type, language) {
  return platformData[kind]?.types?.[type]?.description?.[language]?.split(/\n+/)[0] ?? platform.websiteAdmin.pages.editor.tooltip.noDocumentation[language];
}

function getLabel(kind, type, language) {
  return platformData[kind]?.types?.[type]?.label?.[language] ?? platform.websiteAdmin.pages.editor.tooltip.documentation[language];
}
