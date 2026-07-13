// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import NextImage from "next/image";

import importedStyles from "./Image.module.css";

export default function Image(props) {
  const INTERNAL_MEDIA_REGEX = /^\/api\/website-media\/[a-f0-9]{24}$/i;
  const PUBLIC_MEDIA_REGEX = /^\/.*$/i;

  const alignSelf = props.alignSelf;
  const alt = props.alt;
  const aspectRatio = props.aspectRatio;
  const backgroundColor = props.backgroundColor;
  const blurDataURL = props.blurDataURL;
  const borderColor = props.borderColor;
  const borderRadius = props.borderRadius;
  const borderWidth = props.borderWidth;
  const bottom = props.bottom;
  const boxShadow = props.boxShadow;
  const componentId = props.componentId;
  const cursor = props.cursor;
  const decoding = props.decoding;
  const editor = props.editor;
  const fetchPriority = props.fetchPriority;
  const fill = props.fill;
  const flexGrow = props.flexGrow;
  const height = props.height;
  const isVisible = props.isVisible;
  const justifySelf = props.justifySelf;
  const left = props.left;
  const loading = props.loading;
  const maxHeight = props.maxHeight;
  const maxWidth = props.maxWidth;
  const objectFit = props.objectFit;
  const objectPosition = props.objectPosition;
  const opacity = props.opacity;
  const placeholder = props.placeholder;
  const position = props.position;
  const priority = props.priority;
  const quality = props.quality;
  const referrerPolicy = props.referrerPolicy;
  const right = props.right;
  const sizes = props.sizes;
  const src = props.src;
  const styles = props.styles || importedStyles;
  const top = props.top;
  const unoptimized = props.unoptimized;
  const width = props.width;
  const zIndex = props.zIndex;

  const style = {};

  if (alignSelf) {
    style["--image-align-self"] = alignSelf;
  }

  if (aspectRatio) {
    style["--image-aspect-ratio"] = aspectRatio;
  }

  if (backgroundColor) {
    style["--image-background-color"] = backgroundColor;
  }

  if (borderColor) {
    style["--image-border-color"] = borderColor;
  }

  if (borderRadius) {
    style["--image-border-radius"] = borderRadius;
  }

  if (borderWidth) {
    style["--image-border-width"] = borderWidth;
  }

  if (bottom) {
    style["--image-bottom"] = bottom;
  }

  if (boxShadow) {
    style["--image-box-shadow"] = boxShadow;
  }

  if (cursor) {
    style["--image-cursor"] = cursor;
  }

  if (flexGrow) {
    style["--image-flex-grow"] = flexGrow;
  }

  if (height) {
    style["--image-height"] = height;
  }

  if (justifySelf) {
    style["--image-justify-self"] = justifySelf;
  }

  if (left) {
    style["--image-left"] = left;
  }

  if (maxHeight) {
    style["--image-max-height"] = maxHeight;
  }

  if (maxWidth) {
    style["--image-max-width"] = maxWidth;
  }

  if (objectFit) {
    style["--image-object-fit"] = objectFit;
  }

  if (objectPosition) {
    style["--image-object-position"] = objectPosition;
  }

  if (opacity) {
    style["--image-opacity"] = opacity;
  }

  if (position) {
    style["--image-position"] = position;
  }

  if (right) {
    style["--image-right"] = right;
  }

  if (top) {
    style["--image-top"] = top;
  }

  if (width) {
    style["--image-width"] = width;
  }

  if (zIndex) {
    style["--image-z-index"] = zIndex;
  }

  let fillToUse = fill ? true : false;
  let widthToUse;
  let heightToUse;

  if (!fillToUse) {
    const widthIsNumeric = isNumericPx(width);
    const heightIsNumeric = isNumericPx(height);

    const ratio = parseAspectRatio(aspectRatio);

    if (widthIsNumeric) {
      widthToUse = toNumber(width);
    }

    if (heightIsNumeric) {
      heightToUse = toNumber(height);
    }

    if (ratio) {
      if (widthToUse && !heightToUse) {
        heightToUse = Math.round(widthToUse / ratio);
      }

      if (!widthToUse && heightToUse) {
        widthToUse = Math.round(heightToUse * ratio);
      }

      if (!widthToUse && !heightToUse) {
        widthToUse = 800;
        heightToUse = Math.round(widthToUse / ratio);
      }
    }

    if (!widthToUse) {
      widthToUse = 800;
    }

    if (!heightToUse) {
      heightToUse = 600;
    }
  }

  clearStyle(style);

  function cx(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  function hasAbsoluteImage() {
    return typeof src === "string" && src.trim().length > 0 && (src.startsWith("http://") || src.startsWith("https://"));
  }

  function hasImage() {
    return typeof src === "string" && src.trim().length > 0;
  }

  function isNumericPx(value) {
    if (typeof value === "number") {
      return true;
    }

    if (typeof value !== "string") {
      return false;
    }

    const trimmed = value.trim();

    return /^([0-9]+)(px)?$/.test(trimmed);
  }

  function loader({ src, width, quality }) {
    if (INTERNAL_MEDIA_REGEX.test(src)) {
      const q = quality || 75;

      return `${src}?w=${width}&q=${q}`;
    } else if (PUBLIC_MEDIA_REGEX.test(src)) {
      const q = quality || 75;

      return `${src}?w=${width}&q=${q}`;
    } else {
      return src;
    }
  }

  function parseAspectRatio(value) {
    if (!value || value === "auto") {
      return null;
    }

    const match = value.match(/^([0-9]+)\/([0-9]+)$/);

    if (!match) {
      return null;
    }

    const w = Number(match[1]);
    const h = Number(match[2]);

    if (!w || !h) {
      return null;
    }

    return w / h;
  }

  function toNumber(value) {
    if (typeof value === "number") {
      return value;
    }

    if (typeof value === "string") {
      const match = value.trim().match(/^([0-9]+)/);

      return match ? Number(match[1]) : undefined;
    }

    return undefined;
  }

  if (typeof isVisible === "boolean" && !isVisible) {
    if (editor && !editor.isShowingContentOnly) {
      return (
        <div className={cx(styles.image, styles.image_invisible, editor?.isSelected && styles.image_selected, (!editor || editor?.isShowingContentOnly) && styles.image_content_only)} data-pc-id={componentId} draggable={editor?.draggable} onContextMenu={editor?.onContextMenu} onDragStart={editor?.onDragStart} onMouseDown={editor?.onMouseDown} style={style}>
          Invisible
        </div>
      );
    }

    return null;
  }

  return (
    <div className={cx(styles.image, editor?.isSelected && styles.image_selected, (!editor || editor?.isShowingContentOnly) && styles.image_content_only)} data-pc-id={componentId} draggable={editor?.draggable} onContextMenu={editor?.onContextMenu} onDragStart={editor?.onDragStart} onMouseDown={editor?.onMouseDown} style={style}>
      {hasImage() && <NextImage alt={alt || ""} blurDataURL={blurDataURL} decoding={decoding} fetchPriority={fetchPriority} fill={fillToUse} height={!fillToUse ? heightToUse : undefined} loader={hasAbsoluteImage() ? undefined : loader} loading={priority ? undefined : loading} placeholder={placeholder} preload={priority} /* priority={priority} Deprecated in Next.js 16. */ quality={quality} referrerPolicy={referrerPolicy} sizes={sizes} src={src} style={{ objectFit: objectFit, objectPosition: objectPosition }} unoptimized={unoptimized || hasAbsoluteImage()} width={!fillToUse ? widthToUse : undefined} />}
    </div>
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
    "--image-align-self": "auto",
    "--image-aspect-ratio": "auto",
    "--image-background-color": "var(--pc-semantic-surface-base-secondary)",
    "--image-border-color": "var(--pc-semantic-border-secondary)",
    "--image-border-radius": "5px",
    "--image-border-width": "5px",
    "--image-box-shadow": "var(--pc-semantic-shadow-sm)",
    "--image-cursor": "auto",
    "--image-height": "auto",
    "--image-justify-self": "auto",
    "--image-max-height": "100%",
    "--image-max-width": "100%",
    "--image-object-fit": "contain",
    "--image-object-position": "center",
    "--image-width": "auto",
  };
}
