// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import Icon from "../editor/Icon";

import importedStyles from "./NodeToolbarCategoryNodeType.module.css";

export default function NodeToolbarCategoryNodeType(props) {
  const kind = props.kind;
  const nodeType = props.nodeType;
  const styles = props.styles || importedStyles;

  function onDragStart(e) {
    const dragState = { action: "add-" + kind, type: nodeType.type };

    e.dataTransfer.setData("text/plain", JSON.stringify(dragState));
  }

  return (
    <div className={styles.node_type} draggable={true} onDragStart={onDragStart}>
      <div className={styles.icon}>
        <Icon icon={nodeType.icon} size={16} />
      </div>
      <div className={styles.label} title={nodeType.label}>
        {nodeType.labelShort}
      </div>
    </div>
  );
}
