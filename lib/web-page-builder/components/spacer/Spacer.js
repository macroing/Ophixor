// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import importedStyles from "./Spacer.module.css";

export default function Spacer(props) {
  const componentId = props.componentId;
  const editor = props.editor;
  const flexGrow = props.flexGrow;
  const height = props.height;
  const styles = props.styles || importedStyles;

  const style = {};

  if (flexGrow) {
    style["--spacer-flex-grow"] = flexGrow;
  }

  if (height) {
    style["--spacer-height"] = height;
  }

  clearStyle(style);

  function cx(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return <div aria-hidden className={cx(styles.spacer, editor?.isSelected && styles.spacer_selected, (!editor || editor?.isShowingContentOnly) && styles.spacer_content_only)} data-pc-id={componentId} draggable={editor?.draggable} onContextMenu={editor?.onContextMenu} onDragStart={editor?.onDragStart} onMouseDown={editor?.onMouseDown} style={style}></div>;
}

function clearStyle(style) {
  const defaultCssVariables = getDefaultCssVariables();

  Object.entries(style).forEach(([key, currentValue]) => {
    if (key in defaultCssVariables && currentValue === defaultCssVariables[key]) {
      delete style[key];
    }
  });
}

function getDefaultCssVariables() {
  return {
    "--spacer-flex-grow": "1",
    "--spacer-height": "1rem",
  };
}
