// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useState } from "react";
import { faChevronDown, faChevronUp } from "@fortawesome/pro-solid-svg-icons";

import Icon from "../editor/Icon";
import NodeToolbarCategoryNodeType from "./NodeToolbarCategoryNodeType";

import importedStyles from "./NodeToolbarCategory.module.css";

export default function NodeToolbarCategory(props) {
  const category = props.category;
  const kind = props.kind;
  const styles = props.styles || importedStyles;

  const [isExpanded, setIsExpanded] = useState(false);

  function onClickToggleExpansion(e) {
    setIsExpanded((currentIsExpanded) => !currentIsExpanded);
  }

  return (
    <div className={styles.category + (isExpanded ? " " + styles.category_expanded : "")}>
      <div className={styles.header}>
        <div className={styles.left}>
          <Icon icon={category.icon} size={16} style={{ color: kind === "action" ? "#e0e7ff" : kind === "expression" ? "#d1fae5" : "#cbd5e1" }} />
          <h6 className={styles.title}>{category.label}</h6>
        </div>
        <Icon icon={isExpanded ? faChevronUp : faChevronDown} onClick={onClickToggleExpansion} size={16} />
      </div>
      {isExpanded && (
        <div className={styles.node_types}>
          {category.nodeTypes.map((nodeType) => (
            <NodeToolbarCategoryNodeType key={nodeType.type} kind={kind} nodeType={nodeType} />
          ))}
        </div>
      )}
    </div>
  );
}
