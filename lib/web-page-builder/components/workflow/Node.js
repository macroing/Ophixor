// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useCallback, useMemo, useRef } from "react";

import { NODE_HEIGHT, computeSize } from "./workflow-utilities";

import importedStyles from "./Node.module.css";

export default function Node(props) {
  const isExported = props.isExported;
  const isSelected = props.isSelected;
  const moveNode = props.moveNode;
  const node = props.node;
  const onStartConnection = props.onStartConnection;
  const position = props.position;
  const scale = props.scale;
  const setSelected = props.setSelected;
  const styles = props.styles || importedStyles;

  const isIgnoringSelectRef = useRef(false);
  const ref = useRef(null);

  const inputPorts = useMemo(() => {
    return Object.values(node.ports?.inputs || {});
  }, [node.ports?.inputs]);

  const height = computeSize(inputPorts.length);
  const heightInternal = computeSize(inputPorts.length, true) - 2;

  const onClick = useCallback(
    (e) => {
      e.stopPropagation();

      if (!isIgnoringSelectRef.current) {
        setSelected(isSelected ? null : node.id);
      }

      isIgnoringSelectRef.current = false;
    },
    [isSelected, node.id, setSelected],
  );

  const onPointerDown = useCallback(
    (e) => {
      e.stopPropagation();

      if (e.target !== ref.current) {
        return;
      }

      const startX = e.clientX;
      const startY = e.clientY;

      const startPosition = {
        x: position.x,
        y: position.y,
      };

      function move(ev) {
        isIgnoringSelectRef.current = true;

        moveNode(node.id, {
          x: startPosition.x + (ev.clientX - startX) / scale,
          y: startPosition.y + (ev.clientY - startY) / scale,
        });
      }

      function up() {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      }

      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    },
    [moveNode, node.id, position.x, position.y, scale],
  );

  function toString(value) {
    if (Array.isArray(value)) {
      return `Array(${value.length})`;
    } else if (value !== null && typeof value === "object") {
      return `Object(${Object.keys(value).length})`;
    } else {
      return String(value);
    }
  }

  return (
    <div
      className={styles.node + (node.kind === "action" ? " " + styles.node_action : "") + (node.kind === "expression" ? " " + styles.node_expression : "") + (isSelected ? " " + styles.node_selected : "")}
      onClick={onClick}
      onPointerDown={onPointerDown}
      ref={ref}
      style={{
        height: `${height}px`,
        left: position.x,
        maxHeight: `${height}px`,
        minHeight: `${height}px`,
        opacity: isExported ? "1" : "0.5",
        top: position.y,
      }}
    >
      <div className={styles.main + (inputPorts.length === 0 ? " " + styles.main_empty : "")}>
        <div className={styles.badge}>{node.sequenceNumber}</div>
        <div className={styles.label}>
          <span>{node.label}</span>
          {node.kind === "expression" && node.type === "literal" && node.data?.value !== null && node.data?.value !== undefined ? <span>{typeof node.data.value === "string" ? `"${node.data.value}"` : toString(node.data.value)}</span> : <span></span>}
          <span>{node.schema?.returnType}</span>
        </div>
      </div>
      <div className={styles.output_port + (node.kind === "expression" ? " " + styles.output_port_opposite : "")} onPointerDown={(e) => onStartConnection(node.kind, node.id, "output", e, null, node.ports.outputs[0]?.schema)} />
      {node.kind === "action" && <div className={styles.input_port} onPointerDown={(e) => onStartConnection(node.kind, node.id, "input", e, null, node.schema)} />}
      {inputPorts.length > 0 && height > NODE_HEIGHT && (
        <div className={styles.content} style={{ height: `${heightInternal}px`, maxHeight: `${heightInternal}px`, minHeight: `${heightInternal}px` }}>
          <div className={styles.inputs}>
            {inputPorts.map((port) => (
              <div className={styles.input + (node.kind === "expression" ? " " + styles.input_expression : "")} data-port-id={port.id} key={port.id}>
                {port.isConnectable && <div className={styles.port} onPointerDown={(e) => onStartConnection(node.kind, node.id, "input", e, port, port.schema)} />}
                <div className={styles.input_label}>
                  <span>{port.key === "conditions" ? "Condition" : port.subKey ? "Item" : port.label}</span>
                  <span>{toType(port)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function toType(port) {
  const schema = port?.schema;

  if (schema) {
    const itemType = schema?.itemType;

    if (Array.isArray(itemType)) {
      if (itemType.length > 0) {
        return itemType.join(" or ");
      } else {
        //Continue to type instead...
      }
    } else if (itemType) {
      return itemType;
    }

    const type = schema?.type;

    if (Array.isArray(type)) {
      if (type.length > 0) {
        return type.join(" or ");
      } else {
        //Continue to the end instead...
      }
    } else if (type) {
      return type;
    }
  }

  return null;
}
