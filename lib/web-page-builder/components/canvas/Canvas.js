// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useEffect, useRef } from "react";

import { classNames } from "../runtime/style/classNames";
import { createCanvasSchema } from "./CanvasSchema";
import { getEditorClasses } from "../runtime/editor/getEditorClasses";
import { getEditorProps } from "../runtime/editor/getEditorProps";
import { resolveStyle } from "../runtime/style/resolveStyle";

import importedStyles from "./Canvas.module.css";

const SCHEMA = createCanvasSchema();

export default function Canvas({ componentId, editor, isVisible, onMouseDown, onMouseMove, onMouseUp, onRender, onUpdate, styles = importedStyles, ...styleProps }) {
  const style = resolveStyle(styleProps, SCHEMA);

  const editorClasses = getEditorClasses(editor, styles, "canvas_wrapper", true);
  const editorProps = getEditorProps(editor, true);
  const editorRef = editorProps?.ref;

  delete editorProps.ref;

  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);

  const runtimeRef = useRef({
    mouse: {
      x: 0,
      y: 0,
      down: false,
      pressed: false,
      released: false,
      moved: false,
      wheel: 0,
      button: "",
    },
    keyboard: {
      keys: {},
    },
    frame: {
      count: 0,
      delta: 0,
      fps: 0,
      time: 0,
    },
  });

  const lastSizeRef = useRef({ width: 0, height: 0, heightMax: 0 });

  function getMousePosition(e) {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;

    if (!canvas || !wrapper) {
      return {
        x: 0,
        y: 0,
      };
    }

    const rect = wrapper.getBoundingClientRect();

    const scaleX = 1;
    const scaleY = 1;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function onMouseDownImpl(e) {
    const pos = getMousePosition(e);

    runtimeRef.current.mouse = {
      ...runtimeRef.current.mouse,
      ...pos,
      down: true,
      pressed: true,
      button: String(e.button),
    };

    onMouseDown?.(e);
  }

  function onMouseMoveImpl(e) {
    const pos = getMousePosition(e);

    runtimeRef.current.mouse = {
      ...runtimeRef.current.mouse,
      ...pos,
      moved: true,
    };

    onMouseMove?.(e);
  }

  function onMouseUpImpl(e) {
    const pos = getMousePosition(e);

    runtimeRef.current.mouse = {
      ...runtimeRef.current.mouse,
      ...pos,
      down: false,
      released: true,
      button: String(e.button),
    };

    onMouseUp?.(e);
  }

  function onWheelImpl(e) {
    runtimeRef.current.mouse.wheel += e.deltaY;
  }

  function resizeCanvas() {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;

    if (!canvas || !wrapper) {
      return;
    }

    const rect = wrapper.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const last = lastSizeRef.current;

    if (last.width > 0 && last.height > 0 && last.width === width && last.height === height) {
      return;
    }

    const newWidth = width;
    const newHeight = last.height > 0 ? (height < last.height ? height : last.height) : height;
    const newHeightMax = last.heightMax > 0 ? last.heightMax : height;

    lastSizeRef.current = { width: newWidth, height: newHeight, heightMax: newHeightMax };

    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.round(newWidth * dpr);
    canvas.height = Math.round(newHeight * dpr);

    canvas.style.width = `${newWidth}px`;
    canvas.style.height = `${newHeight}px`;

    const ctx = canvas.getContext("2d");

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  useEffect(() => {
    resizeCanvas();

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(resizeCanvas);
    });

    window.addEventListener("resize", resizeCanvas);

    function handleKeyDown(e) {
      runtimeRef.current.keyboard.keys[e.key] = true;
    }

    function handleKeyUp(e) {
      runtimeRef.current.keyboard.keys[e.key] = false;
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      observer.disconnect();

      window.removeEventListener("resize", resizeCanvas);

      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    let frameId;

    let previousTime = performance.now();

    function loop(time) {
      const canvas = canvasRef.current;

      if (!canvas) {
        return;
      }

      const ctx = canvas.getContext("2d");

      const rect = canvas.getBoundingClientRect();

      const delta = time - previousTime;

      previousTime = time;

      runtimeRef.current.frame = {
        count: runtimeRef.current.frame.count + 1,
        delta,
        fps: delta > 0 ? 1000 / delta : 0,
        time,
      };

      ctx.clearRect(0, 0, rect.width, rect.height);

      const context = {
        canvas: {
          ctx,
          canvas,
          width: rect.width,
          height: rect.height,
          mouse: {
            ...runtimeRef.current.mouse,
          },
          keyboard: {
            ...runtimeRef.current.keyboard,
          },
          frame: {
            ...runtimeRef.current.frame,
            time,
          },
        },
      };

      onUpdate?.(context);

      onRender?.(context);

      runtimeRef.current.mouse.pressed = false;
      runtimeRef.current.mouse.released = false;
      runtimeRef.current.mouse.moved = false;
      runtimeRef.current.mouse.wheel = 0;

      frameId = requestAnimationFrame(loop);
    }

    frameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [onRender, onUpdate]);

  if (typeof isVisible === "boolean" && !isVisible) {
    if (editor && !editor.isShowingContentOnly) {
      return (
        <div className={classNames(styles.canvas_wrapper, styles.canvas_wrapper_invisible, ...editorClasses)} data-pc-id={componentId} style={style} {...editorProps}>
          Invisible
        </div>
      );
    }

    return null;
  }

  return (
    <div
      className={classNames(styles.canvas_wrapper, ...editorClasses)}
      data-pc-id={componentId}
      ref={(node) => {
        wrapperRef.current = node;

        if (typeof editorRef === "function") {
          editorRef(node);
        } else if (editorRef) {
          editorRef.current = node;
        }
      }}
      style={style}
      {...editorProps}
    >
      <canvas
        onMouseDown={onMouseDownImpl}
        onMouseMove={onMouseMoveImpl}
        onMouseUp={onMouseUpImpl}
        onWheel={onWheelImpl}
        ref={canvasRef}
        style={{
          background: "transparent",
          display: "block",
          height: "100%",
          width: "100%",
        }}
      />
    </div>
  );
}
