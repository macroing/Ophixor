// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import Link from "next/link";

import { classNames } from "../runtime/style/classNames";
import { createFooterSchema } from "./FooterSchema";
import { getEditorClasses } from "../runtime/editor/getEditorClasses";
import { getEditorProps } from "../runtime/editor/getEditorProps";
import { resolveStyle } from "../runtime/style/resolveStyle";
import { sanitizeArray } from "../runtime/props/sanitizeArray";
import { sanitizeString } from "../runtime/props/sanitizeString";
import { useViewport } from "@/hooks/useViewport";

import importedStyles from "./Footer.module.css";

const SCHEMA = createFooterSchema();

export default function Footer({ componentId, description, editor, items = [], resolveUrl, styles = importedStyles, textBottomLeft, textBottomRight, title, ...styleProps }) {
  const style = resolveStyle(styleProps, SCHEMA);

  const editorClasses = getEditorClasses(editor, styles, "footer", true);
  const editorProps = getEditorProps(editor, true);

  const safeDescription = sanitizeString(description);
  const safeItems = sanitizeArray(items);
  const safeTextBottomLeft = sanitizeString(textBottomLeft);
  const safeTextBottomRight = sanitizeString(textBottomRight);
  const safeTitle = sanitizeString(title);

  const { isMobile, isTablet, width } = useViewport();

  if (width > 0) {
    style["maxWidth"] = `${width}px`;
  }

  return (
    <footer className={classNames(styles.footer, ...editorClasses)} data-pc-id={componentId} style={style} {...editorProps}>
      <div className={styles.footer_inner}>
        <div className={styles.footer_grid} style={{ gridTemplateColumns: isMobile || isTablet ? "repeat(auto-fit, minmax(250px, 1fr))" : "repeat(auto-fit, minmax(200px, 1fr))", justifyItems: isMobile ? "center" : "legacy", textAlign: isMobile ? "center" : "left" }}>
          {(safeTitle || safeDescription) && (
            <div className={styles.footer_brand}>
              <h3>{safeTitle}</h3>
              <p>{safeDescription}</p>
            </div>
          )}
          {safeItems.map((item, itemIndex) => (
            <div className={styles.footer_links} key={"item-" + itemIndex}>
              <h4>{item?.href ? <Link href={typeof resolveUrl === "function" ? resolveUrl(item.href) : item.href}>{item?.label || ""}</Link> : item?.label || ""}</h4>
              {Array.isArray(item?.items) && item.items.length > 0 && (
                <ul>
                  {item.items.map((innerItem, innerItemIndex) => (
                    <li key={"item-" + itemIndex + "-" + innerItemIndex}>{innerItem?.href ? <Link href={typeof resolveUrl === "function" ? resolveUrl(innerItem.href) : innerItem.href}>{innerItem?.label || ""}</Link> : innerItem?.label || ""}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        <div className={styles.footer_bottom} style={{ flexDirection: isMobile ? "column" : "row", textAlign: isMobile ? "center" : "left" }}>
          <span>{safeTextBottomLeft}</span>
          <span>{safeTextBottomRight}</span>
        </div>
      </div>
    </footer>
  );
}
