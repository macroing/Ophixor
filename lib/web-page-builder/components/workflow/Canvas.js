// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useCallback, useEffect, useRef } from "react";

import { GRID_SIZE } from "./workflow-utilities";

import importedStyles from "./Canvas.module.css";

export default function Canvas(props) {
  const children = props.children;
  const offset = props.offset;
  const onDrop = props.onDrop;
  const scale = props.scale;
  const setBounds = props.setBounds;
  const setOffset = props.setOffset;
  const setScale = props.setScale;
  const styles = props.styles || importedStyles;

  const ref = useRef(null);

  const bgX = offset.x % (GRID_SIZE * scale);
  const bgY = offset.y % (GRID_SIZE * scale);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const onPointerDown = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      let lastX = e.clientX;
      let lastY = e.clientY;

      function move(ev) {
        const dx = ev.clientX - lastX;
        const dy = ev.clientY - lastY;

        lastX = ev.clientX;
        lastY = ev.clientY;

        setOffset((prev) => ({
          x: prev.x + dx,
          y: prev.y + dy,
        }));
      }

      function up() {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      }

      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    },
    [setOffset],
  );

  function onWheel(e) {
    const zoomIntensity = 0.001;

    const rect = ref.current.getBoundingClientRect();

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const worldX = (mouseX - offset.x) / scale;
    const worldY = (mouseY - offset.y) / scale;

    const newScale = Math.min(2, Math.max(0.3, scale - e.deltaY * zoomIntensity));

    const newOffsetX = mouseX - worldX * newScale;
    const newOffsetY = mouseY - worldY * newScale;

    setScale(newScale);
    setOffset({ x: newOffsetX, y: newOffsetY });
  }

  useEffect(() => {
    if (ref.current) {
      setBounds(ref.current.getBoundingClientRect());
    }
  }, [ref.current, setBounds]);

  return (
    <div className={styles.canvas} onDragOver={onDragOver} onDrop={onDrop} onWheel={onWheel} ref={ref} style={{ backgroundPosition: `${bgX}px ${bgY}px`, backgroundSize: `${GRID_SIZE * scale}px ${GRID_SIZE * scale}px` }}>
      <div className={styles.pan_layer} onPointerDown={onPointerDown} />
      <div className={styles.content} style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`, transformOrigin: "0 0" }}>
        {children}
      </div>
    </div>
  );
}
