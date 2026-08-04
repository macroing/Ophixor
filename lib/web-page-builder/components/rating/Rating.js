// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/pro-solid-svg-icons";

import { classNames } from "../runtime/style/classNames";
import { createRatingSchema } from "./RatingSchema";
import { getEditorClasses } from "../runtime/editor/getEditorClasses";
import { getEditorProps } from "../runtime/editor/getEditorProps";
import { resolveStyle } from "../runtime/style/resolveStyle";

import importedStyles from "./Rating.module.css";

const SCHEMA = createRatingSchema();

export default function Rating({ componentId, editor, isVisible, onChange, styles = importedStyles, value, ...styleProps }) {
  const style = resolveStyle(styleProps, SCHEMA);

  const editorClasses = getEditorClasses(editor, styles, "rating", true);
  const editorProps = getEditorProps(editor, true);

  const safeValue = typeof value === "number" ? value : Number(value);

  const isUserSelectingRef = useRef(false);

  const [internalValue, setInternalValue] = useState(safeValue);
  const [internalValueHover, setInternalValueHover] = useState(0);

  function onChangeImpl(newValue) {
    isUserSelectingRef.current = true;

    setInternalValue(newValue);

    if (typeof onChange === "function") {
      onChange({ target: { value: newValue } });
    }
  }

  function onMouseEnter(value) {
    setInternalValueHover(value);
  }

  function onMouseLeave(value) {
    setInternalValueHover(0);
  }

  useEffect(() => {
    if (!isUserSelectingRef.current) {
      setInternalValue(safeValue);
    }

    isUserSelectingRef.current = false;
  }, [safeValue]);

  if (typeof isVisible === "boolean" && !isVisible) {
    if (editor && !editor.isShowingContentOnly) {
      return (
        <div className={classNames(styles.rating, styles.rating_invisible, ...editorClasses)} data-pc-id={componentId} style={style} {...editorProps}>
          Invisible
        </div>
      );
    }

    return null;
  }

  return (
    <div className={classNames(styles.rating, ...editorClasses)} data-pc-id={componentId} style={style} {...editorProps}>
      <FontAwesomeIcon className={styles.star + ((internalValue >= 1 && internalValueHover === 0) || internalValueHover >= 1 ? " " + styles.star_selected : "")} icon={faStar} onClick={(e) => onChangeImpl(1)} onMouseEnter={(e) => onMouseEnter(1)} onMouseLeave={(e) => onMouseLeave(1)} />
      <FontAwesomeIcon className={styles.star + ((internalValue >= 2 && internalValueHover === 0) || internalValueHover >= 2 ? " " + styles.star_selected : "")} icon={faStar} onClick={(e) => onChangeImpl(2)} onMouseEnter={(e) => onMouseEnter(2)} onMouseLeave={(e) => onMouseLeave(2)} />
      <FontAwesomeIcon className={styles.star + ((internalValue >= 3 && internalValueHover === 0) || internalValueHover >= 3 ? " " + styles.star_selected : "")} icon={faStar} onClick={(e) => onChangeImpl(3)} onMouseEnter={(e) => onMouseEnter(3)} onMouseLeave={(e) => onMouseLeave(3)} />
      <FontAwesomeIcon className={styles.star + ((internalValue >= 4 && internalValueHover === 0) || internalValueHover >= 4 ? " " + styles.star_selected : "")} icon={faStar} onClick={(e) => onChangeImpl(4)} onMouseEnter={(e) => onMouseEnter(4)} onMouseLeave={(e) => onMouseLeave(4)} />
      <FontAwesomeIcon className={styles.star + ((internalValue >= 5 && internalValueHover === 0) || internalValueHover >= 5 ? " " + styles.star_selected : "")} icon={faStar} onClick={(e) => onChangeImpl(5)} onMouseEnter={(e) => onMouseEnter(5)} onMouseLeave={(e) => onMouseLeave(5)} />
    </div>
  );
}
