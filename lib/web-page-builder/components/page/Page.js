// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import importedStyles from "./Page.module.css";

export default function Page(props) {
  const alignItems = props.alignItems;
  const background = props.background;
  const backgroundBlendMode = props.backgroundBlendMode;
  const backgroundColor = props.backgroundColor;
  const backgroundImage = props.backgroundImage;
  const backgroundPosition = props.backgroundPosition;
  const backgroundRepeat = props.backgroundRepeat;
  const backgroundSize = props.backgroundSize;
  const children = props.children;
  const componentId = props.componentId;
  const editor = props.editor;
  const flexDirection = props.flexDirection;
  const gap = props.gap;
  const height = props.height;
  const justifyContent = props.justifyContent;
  const padding = props.padding;
  const styles = props.styles || importedStyles;
  const width = props.width;

  const style = {};

  if (alignItems) {
    style["--page-align-items"] = alignItems;
  }

  if (background) {
    style["--page-background"] = background;
  }

  if (backgroundBlendMode) {
    style["--page-background-blend-mode"] = backgroundBlendMode;
  }

  if (backgroundColor) {
    style["--page-background-color"] = backgroundColor;
  }

  if (backgroundImage) {
    style["--page-background-image"] = backgroundImage;
  }

  if (backgroundPosition) {
    style["--page-background-position"] = backgroundPosition;
  }

  if (backgroundRepeat) {
    style["--page-background-repeat"] = backgroundRepeat;
  }

  if (backgroundSize) {
    style["--page-background-size"] = backgroundSize;
  }

  if (flexDirection) {
    style["--page-flex-direction"] = flexDirection;
  }

  if (gap) {
    style["--page-gap"] = gap;
  }

  if (height) {
    style["--page-height"] = height;
  }

  if (justifyContent) {
    style["--page-justify-content"] = justifyContent;
  }

  if (padding) {
    style["--page-padding"] = padding;
  }

  if (width) {
    style["--page-width"] = width;
  }

  clearStyle(style);

  function cx(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <section className={cx(styles.page, (!editor || editor?.isShowingContentOnly) && styles.page_content_only)} data-pc-id={componentId} onClick={editor?.onClick} style={style}>
      <div className={cx(styles.page_content, editor?.isDraggingOver && styles.page_content_drag_over, editor?.isDraggingOver && !editor?.isDraggingOverAllowed && styles.page_content_drag_over_not_allowed, editor?.isSelected && styles.page_content_selected)} onContextMenu={editor?.onContextMenu} onDragEnter={editor?.onDragEnter} onDragLeave={editor?.onDragLeave} onDragOver={editor?.onDragOver} onDrop={editor?.onDrop} onMouseDown={editor?.onMouseDown} ref={editor?.dropZoneContainerRef}>
        {children}
        {editor?.isDraggingOver && editor?.isDraggingOverAllowed && <div className={styles.page_content_drop_zone}>Drop the component here</div>}
      </div>
    </section>
  );
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
    "--page-align-items": "stretch",
    "--page-background": "none",
    "--page-background-color": "var(--pc-semantic-surface-page)",
    "--page-flex-direction": "row",
    "--page-gap": "2rem",
    "--page-height": "auto",
    "--page-justify-content": "stretch",
    "--page-padding": "2rem",
    "--page-width": "auto",
  };
}
