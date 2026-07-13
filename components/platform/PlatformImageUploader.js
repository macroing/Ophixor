// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { useRef, useState, useEffect } from "react";

import Button from "@/lib/web-page-builder/components/button/Button";
import Card from "@/lib/web-page-builder/components/card/Card";
import Select from "@/lib/web-page-builder/components/select/Select";
import { useLanguage } from "@/context/language";
import { useWebsite } from "@/context/website";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

import importedStyles from "./PlatformImageUploader.module.css";

export default function PlatformImageUploader(props) {
  const onUploadComplete = props.onUploadComplete;
  const styles = props.styles || importedStyles;

  const { language } = useLanguage();

  const canvasRef = useRef(null);
  const cropRef = useRef(null);
  const displayScaleRef = useRef(1);

  const [aspect, setAspect] = useState(null);
  const [cropActive, setCropActive] = useState(false);
  const [filter, setFilter] = useState("none");
  const [originalImage, setOriginalImage] = useState(null);
  const [originalImageName, setOriginalImageName] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [width, setWidth] = useState(0);
  const [workingImage, setWorkingImage] = useState(null);

  const { website } = useWebsite();

  const drag = useRef({
    mode: null,
    handle: null,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    startLeft: 0,
    startTop: 0,
  });

  function applyCrop() {
    if (!workingImage || !cropRef.current) {
      return;
    }

    const crop = cropRef.current;

    const displayScale = displayScaleRef.current;

    const dx = crop.offsetLeft;
    const dy = crop.offsetTop;
    const dw = crop.offsetWidth;
    const dh = crop.offsetHeight;

    const sx = Math.round(dx / displayScale);
    const sy = Math.round(dy / displayScale);
    const sw = Math.round(dw / displayScale);
    const sh = Math.round(dh / displayScale);

    const exportCanvas = document.createElement("canvas");

    const exportCanvasContext = exportCanvas.getContext("2d");

    exportCanvas.width = sw;
    exportCanvas.height = sh;

    exportCanvasContext.drawImage(workingImage, sx, sy, sw, sh, 0, 0, sw, sh);

    const cropped = new Image();

    cropped.src = exportCanvas.toDataURL("image/png");

    cropped.onload = () => {
      setOriginalImage(cropped);
      setRotation(0);
      setCropActive(false);
    };
  }

  function handleWindowSizeChange() {
    setWidth(window?.innerWidth || 0);
  }

  function loadImage(file) {
    const fileName = file.name;

    const fileReader = new FileReader();

    fileReader.onload = () => {
      const image = new Image();

      image.onload = () => {
        setOriginalImage(image);
        setOriginalImageName(fileName);
        setWorkingImage(image);

        resetState();
      };
      image.src = fileReader.result;
    };
    fileReader.readAsDataURL(file);
  }

  function onPointerDown(e) {
    const box = cropRef.current;

    if (!box) {
      return;
    }

    const handle = e.target.dataset.handle || null;

    e.target.setPointerCapture(e.pointerId);

    drag.current = {
      mode: handle ? "resize" : "move",
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: box.offsetWidth,
      startHeight: box.offsetHeight,
      startLeft: box.offsetLeft,
      startTop: box.offsetTop,
    };
  }

  function onPointerMove(e) {
    const d = drag.current;
    const box = cropRef.current;
    const canvas = canvasRef.current;

    if (!box || !canvas || !d.mode) {
      return;
    }

    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;

    let width = d.startWidth;
    let height = d.startHeight;
    let left = d.startLeft;
    let top = d.startTop;

    const min = 40;

    if (d.mode === "move") {
      left = d.startLeft + dx;
      top = d.startTop + dy;
    }

    if (d.mode === "resize") {
      const handle = d.handle;

      const isLeft = handle.includes("l");
      const isRight = handle.includes("r");
      const isTop = handle.includes("t");
      const isBottom = handle.includes("b");

      if (isRight) {
        width = d.startWidth + dx;
      }

      if (isLeft) {
        width = d.startWidth - dx;
        left = d.startLeft + dx;
      }

      if (isBottom) {
        height = d.startHeight + dy;
      }

      if (isTop) {
        height = d.startHeight - dy;
        top = d.startTop + dy;
      }

      if (aspect) {
        if (width / height > aspect) {
          width = height * aspect;
        } else {
          height = width / aspect;
        }

        if (isLeft) {
          left = d.startLeft + (d.startWidth - width);
        }

        if (isTop) {
          top = d.startTop + (d.startHeight - height);
        }
      }
    }

    width = Math.max(min, width);
    height = Math.max(min, height);

    width = Math.min(width, canvas.width);
    height = Math.min(height, canvas.height);

    left = Math.max(0, Math.min(left, canvas.width - width));
    top = Math.max(0, Math.min(top, canvas.height - height));

    box.style.width = `${width}px`;
    box.style.height = `${height}px`;
    box.style.left = `${left}px`;
    box.style.top = `${top}px`;
  }

  function onPointerUp(e) {
    try {
      e.target.releasePointerCapture(e.pointerId);
    } catch {}

    drag.current.mode = null;
  }

  function render() {
    if (!workingImage || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;

    const context = canvas.getContext("2d");

    const MAX_DISPLAY_WIDTH = 900;

    const scale = Math.min(MAX_DISPLAY_WIDTH / workingImage.width, 1);

    displayScaleRef.current = scale;

    const displayWidth = Math.round(workingImage.width * scale);
    const displayHeight = Math.round(workingImage.height * scale);

    canvas.width = displayWidth;
    canvas.height = displayHeight;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(workingImage, 0, 0, displayWidth, displayHeight);

    applyFilter(context, canvas, filter);
  }

  function removeExtension(name) {
    return name.replace(/\.[^/.]+$/, "");
  }

  function resetCropBox() {
    const cropBox = cropRef.current;
    const canvas = canvasRef.current;

    if (!cropBox || !canvas) {
      return;
    }

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    let width = Math.round(canvasWidth * 0.6);
    let height = Math.round(canvasHeight * 0.6);

    if (aspect) {
      if (width / height > aspect) {
        width = height * aspect;
      } else {
        height = width / aspect;
      }
    }

    width = Math.round(width);
    height = Math.round(height);

    const left = Math.round((canvasWidth - width) / 2);
    const top = Math.round((canvasHeight - height) / 2);

    cropBox.style.width = width + "px";
    cropBox.style.height = height + "px";
    cropBox.style.left = left + "px";
    cropBox.style.top = top + "px";
  }

  function resetState() {
    setAspect(null);
    setCropActive(false);
    setFilter("none");
    setRotation(0);
  }

  function restore() {
    if (!originalImage) {
      return;
    }

    setWorkingImage(originalImage);

    resetState();
  }

  function rotateBitmap(image, rotation) {
    if (rotation === 0) {
      return image;
    }

    const canvas = document.createElement("canvas");

    const context = canvas.getContext("2d");

    const isSideways = rotation === 90 || rotation === 270;

    canvas.width = isSideways ? image.height : image.width;
    canvas.height = isSideways ? image.width : image.height;

    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate((rotation * Math.PI) / 180);
    context.drawImage(image, -image.width / 2, -image.height / 2);
    context.restore();

    const rotated = new Image();

    rotated.src = canvas.toDataURL("image/png");

    return rotated;
  }

  function toggleCrop() {
    setCropActive((oldCropActive) => !oldCropActive);

    requestAnimationFrame(resetCropBox);
  }

  function updateCropAspect(newAspect) {
    const box = cropRef.current;
    const canvas = canvasRef.current;

    if (!box || !canvas) {
      return;
    }

    const min = 40;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const currentWidth = box.offsetWidth;
    const centerX = box.offsetLeft + currentWidth / 2;
    const centerY = box.offsetTop + box.offsetHeight / 2;

    let newWidth = currentWidth;
    let newHeight = newWidth / newAspect;

    if (newHeight > canvasHeight) {
      newHeight = canvasHeight;
      newWidth = newHeight * newAspect;
    }

    newWidth = Math.max(min, Math.min(newWidth, canvasWidth));
    newHeight = Math.max(min, Math.min(newHeight, canvasHeight));

    let left = Math.round(centerX - newWidth / 2);
    let top = Math.round(centerY - newHeight / 2);

    left = Math.max(0, Math.min(left, canvasWidth - newWidth));
    top = Math.max(0, Math.min(top, canvasHeight - newHeight));

    box.style.width = `${Math.round(newWidth)}px`;
    box.style.height = `${Math.round(newHeight)}px`;
    box.style.left = `${left}px`;
    box.style.top = `${top}px`;
  }

  async function upload() {
    if (!workingImage) {
      return;
    }

    const crop = cropRef.current;
    const displayScale = displayScaleRef.current;

    let sx = 0;
    let sy = 0;
    let sw = workingImage.width;
    let sh = workingImage.height;

    if (cropActive && crop) {
      const dx = crop.offsetLeft;
      const dy = crop.offsetTop;
      const dw = crop.offsetWidth;
      const dh = crop.offsetHeight;

      sx = Math.round(dx / displayScale);
      sy = Math.round(dy / displayScale);
      sw = Math.round(dw / displayScale);
      sh = Math.round(dh / displayScale);
    }

    const exportCanvas = document.createElement("canvas");
    const exportCanvasContext = exportCanvas.getContext("2d");

    exportCanvas.width = sw;
    exportCanvas.height = sh;

    exportCanvasContext.drawImage(workingImage, sx, sy, sw, sh, 0, 0, sw, sh);

    applyFilter(exportCanvasContext, exportCanvas, filter);

    exportCanvas.toBlob(async (blob) => {
      if (!blob) {
        return;
      }

      const baseName = removeExtension(originalImageName);
      const formData = new FormData();

      formData.append("file", blob, baseName + ".png");
      formData.append("websiteId", website._id.toString());

      await axios.post("/api/website-media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAspect(null);
      setCropActive(false);
      setFilter("none");
      setOriginalImage(null);
      setOriginalImageName(null);
      setRotation(0);
      setWidth(0);
      setWorkingImage(null);

      if (onUploadComplete) {
        onUploadComplete();
      }
    }, "image/png");
  }

  useEffect(() => {
    setWidth(window?.innerWidth || 0);

    window.addEventListener("resize", handleWindowSizeChange);

    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  useEffect(() => {
    if (cropActive && aspect !== null) {
      updateCropAspect(aspect);
    }
  }, [aspect]);

  useEffect(() => {
    render();
  }, [filter, rotation, workingImage]);

  useEffect(() => {
    if (!originalImage) {
      return;
    }

    const rotated = rotateBitmap(originalImage, rotation);

    if (rotated.complete) {
      setWorkingImage(rotated);
    } else {
      rotated.onload = () => setWorkingImage(rotated);
    }
  }, [originalImage, rotation]);

  return (
    <div className={styles.wrapper}>
      <ControlsPanel applyCrop={applyCrop} cropActive={cropActive} filter={filter} language={language} onUpload={loadImage} originalImage={originalImage} restore={restore} rotation={rotation} setAspect={setAspect} setFilter={setFilter} setRotation={setRotation} styles={styles} toggleCrop={toggleCrop} upload={upload} width={width} />
      {originalImage && <EditorPanel canvasRef={canvasRef} cropActive={cropActive} cropRef={cropRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} styles={styles} />}
    </div>
  );
}

function ControlsPanel({ applyCrop, cropActive, filter, language, onUpload, originalImage, restore, rotation, setAspect, setFilter, setRotation, styles, toggleCrop, upload, width }) {
  return (
    <Card flexDirectionBody="column">
      {{
        slots: {
          header: [],
          body: [
            <div className={styles.row} key="1">
              <FileInputButtonLabel accept="image/*" onChange={(e) => onUpload(e.target.files[0])} theme={originalImage ? undefined : "primary"}>
                {platform.websiteAdmin.media.platformImageUploader.selectImage[language]}
              </FileInputButtonLabel>
              <Select
                onChange={(e) => setFilter(e.target.value)}
                options={Object.entries(FILTERS).map(([key, filter]) => {
                  return { label: platform.websiteAdmin.media.platformImageUploader.filter[filter.label][language], value: key };
                })}
                value={filter}
              />
              <Select
                onChange={(e) => setRotation(typeof e.target.value === "number" ? e.target.value : Number.parseInt(e.target.value) || 0)}
                options={[
                  { label: platform.websiteAdmin.media.platformImageUploader.noRotation[language], value: 0 },
                  { label: "90°", value: 90 },
                  { label: "180°", value: 180 },
                  { label: "270°", value: 270 },
                ]}
                value={rotation}
              />
              <Select
                onChange={(e) => {
                  const v = e.target.value;

                  if (v === "free") {
                    setAspect(null);
                  } else {
                    const [w, h] = v.split("/").map(Number);

                    setAspect(w / h);
                  }
                }}
                options={[
                  { label: platform.websiteAdmin.media.platformImageUploader.free[language], value: "free" },
                  { label: "1:1", value: "1/1" },
                  { label: "4:3", value: "4/3" },
                  { label: "16:9", value: "16/9" },
                ]}
              />
            </div>,
            <div className={styles.row} key="2">
              <Button disabled={!originalImage} onClick={toggleCrop}>
                {platform.websiteAdmin.media.platformImageUploader.crop[language]}
              </Button>
              <Button disabled={!originalImage || !cropActive} onClick={applyCrop} theme={originalImage && cropActive ? "primary" : undefined}>
                {platform.websiteAdmin.media.platformImageUploader.applyCrop[language]}
              </Button>
              <Button disabled={!originalImage} onClick={upload} theme={originalImage ? "primary" : undefined}>
                {platform.websiteAdmin.media.platformImageUploader.upload[language]}
              </Button>
              <Button disabled={!originalImage} onClick={restore} theme={originalImage ? "danger" : undefined}>
                {platform.websiteAdmin.media.platformImageUploader.reset[language]}
              </Button>
            </div>,
          ],
        },
      }}
    </Card>
  );
}

function CropBox({ cropRef, onPointerDown, onPointerMove, onPointerUp, styles }) {
  return (
    <div className={styles.crop_box} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} ref={cropRef}>
      {["tl", "tr", "bl", "br"].map((h) => (
        <span key={h} data-handle={h} className={`${styles.handle} ${styles[h]}`} />
      ))}
      <div className={styles.guides} />
    </div>
  );
}

function EditorPanel({ canvasRef, cropActive, cropRef, onPointerDown, onPointerMove, onPointerUp, styles }) {
  return (
    <Card>
      {{
        slots: {
          header: [],
          body: [
            <div className={styles.editor_panel} key="1">
              <div className={styles.canvas_container}>
                <canvas className={styles.canvas} ref={canvasRef} />
                {cropActive && <CropBox cropRef={cropRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} styles={styles} />}
              </div>
            </div>,
          ],
          footer: [],
        },
      }}
    </Card>
  );
}

function FileInputButtonLabel(props) {
  const accept = props.accept;
  const children = props.children;
  const disabled = props.disabled;
  const htmlFor = props.htmlFor;
  const id = props.id;
  const inputRef = props.inputRef;
  const onChange = props.onChange;
  const style = props.style;
  const styles = props.styles || importedStyles;
  const theme = props.theme;

  return (
    <label className={styles.file_input_button_label + (disabled ? " " + styles.file_input_button_label_disabled : "") + (theme === "primary" ? " " + styles.file_input_button_label_primary : "")} htmlFor={htmlFor} style={style}>
      {children}
      <input accept={accept} disabled={disabled} id={id} onChange={onChange} ref={inputRef} type="file" />
    </label>
  );
}

function applyFilter(context, canvas, filterKey) {
  const config = FILTERS[filterKey];

  if (!config || config.type === "none") {
    return;
  }

  const image = context.getImageData(0, 0, canvas.width, canvas.height);

  switch (config.type) {
    case "pixel":
      applyFilterPixel(image.data, filterKey);

      context.putImageData(image, 0, 0);

      break;

    case "convolution":
      const result = applyFilterConvolution(image, config.kernel, config.divisor || 1);

      context.putImageData(result, 0, 0);

      break;

    case "sobel":
      const sobel = applyFilterSobel(image);

      context.putImageData(sobel, 0, 0);

      break;
  }
}

function applyFilterConvolution(image, kernel, divisor = 1) {
  const { width, height, data } = image;

  const output = new ImageData(width, height);

  const side = Math.sqrt(kernel.length);
  const half = Math.floor(side / 2);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0;
      let g = 0;
      let b = 0;

      for (let ky = 0; ky < side; ky++) {
        for (let kx = 0; kx < side; kx++) {
          const px = x + kx - half;
          const py = y + ky - half;

          if (px >= 0 && px < width && py >= 0 && py < height) {
            const i = (py * width + px) * 4;
            const w = kernel[ky * side + kx];

            r += data[i + 0] * w;
            g += data[i + 1] * w;
            b += data[i + 2] * w;
          }
        }
      }

      const index = (y * width + x) * 4;

      output.data[index + 0] = r / divisor;
      output.data[index + 1] = g / divisor;
      output.data[index + 2] = b / divisor;
      output.data[index + 3] = 255;
    }
  }

  return output;
}

function applyFilterPixel(data, type) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i + 0];
    const g = data[i + 1];
    const b = data[i + 2];

    if (type === "grayscale") {
      const v = (r + g + b) / 3;

      data[i + 0] = v;
      data[i + 1] = v;
      data[i + 2] = v;
    }

    if (type === "sepia") {
      data[i + 0] = 0.393 * r + 0.769 * g + 0.189 * b;
      data[i + 1] = 0.349 * r + 0.686 * g + 0.168 * b;
      data[i + 2] = 0.272 * r + 0.534 * g + 0.131 * b;
    }

    if (type === "invert") {
      data[i + 0] = 255 - r;
      data[i + 1] = 255 - g;
      data[i + 2] = 255 - b;
    }
  }
}

function applyFilterSobel(image) {
  const gx = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const gy = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

  const convX = applyFilterConvolution(image, gx);
  const convY = applyFilterConvolution(image, gy);

  const out = new ImageData(image.width, image.height);

  for (let i = 0; i < out.data.length; i += 4) {
    const v = Math.hypot(convX.data[i], convY.data[i]);

    out.data[i + 0] = v;
    out.data[i + 1] = v;
    out.data[i + 2] = v;
    out.data[i + 3] = 255;
  }

  return out;
}

const FILTERS = {
  none: { label: "NoFilter", type: "none" },

  grayscale: { label: "Grayscale", type: "pixel" },
  sepia: { label: "Sepia", type: "pixel" },
  invert: { label: "Invert", type: "pixel" },

  boxBlur: {
    label: "BoxBlur",
    type: "convolution",
    kernel: [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9],
  },

  gaussianBlur: {
    label: "GaussianBlur",
    type: "convolution",
    kernel: [1, 2, 1, 2, 4, 2, 1, 2, 1],
    divisor: 16,
  },

  sharpen: {
    label: "Sharpen",
    type: "convolution",
    kernel: [0, -1, 0, -1, 5, -1, 0, -1, 0],
  },

  emboss: {
    label: "Emboss",
    type: "convolution",
    kernel: [-2, -1, 0, -1, 1, 1, 0, 1, 2],
  },

  ridge: {
    label: "RidgeDetection",
    type: "convolution",
    kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1],
  },

  sobel: { label: "Sobel", type: "sobel" },
};
