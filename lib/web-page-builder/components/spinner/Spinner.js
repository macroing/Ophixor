// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { classNames } from "../runtime/style/classNames";
import { createSpinnerSchema } from "./SpinnerSchema";
import { getEditorClasses } from "../runtime/editor/getEditorClasses";
import { getEditorProps } from "../runtime/editor/getEditorProps";
import { resolveStyle } from "../runtime/style/resolveStyle";

import importedStyles from "./Spinner.module.css";

const SCHEMA = createSpinnerSchema();

export default function Spinner({ componentId, editor, styles = importedStyles, ...styleProps }) {
  const style = resolveStyle(styleProps, SCHEMA);

  const editorClasses = getEditorClasses(editor, styles, "spinner_container", true);
  const editorProps = getEditorProps(editor, true);

  return (
    <div className={classNames(styles.spinner_container, ...editorClasses)} data-pc-id={componentId} style={style} {...editorProps}>
      <div className={styles.spinner}></div>
    </div>
  );
}
