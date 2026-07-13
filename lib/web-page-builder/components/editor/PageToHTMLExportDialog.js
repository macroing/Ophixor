// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useEffect, useRef, useState } from "react";
import { faCancel, faFileHtml } from "@fortawesome/pro-solid-svg-icons";

import { DarkButton } from "../button/Button";
import { DarkDialog } from "../dialog/Dialog";
import { DarkInput } from "../input/Input";
import { DarkLabel } from "../label/Label";
import { DarkSwitch } from "../switch/Switch";
import Heading from "../heading/Heading";
import Icon from "./Icon";
import { useSocket } from "@/context/socket";
import { useWebPageBuilderData, useWebPageBuilderPageSchema, useWebPageBuilderPageState, useWebPageBuilderRuntime } from "../../context/useWebPageBuilder";

export default function PageToHTMLExportDialog(props) {
  const isVisible = props.isVisible;
  const setIsVisible = props.setIsVisible;

  const dialogRef = useRef();

  const { dataArray, status } = useSocket();

  const { models, pageData, relationIndexes, state } = useWebPageBuilderData();

  const { pageSchema } = useWebPageBuilderPageSchema();

  const { componentIndex, page } = useWebPageBuilderPageState();

  const { nowTick, platformUser, user, viewport, website } = useWebPageBuilderRuntime();

  const [fileName, setFileName] = useState("index");
  const [isMinified, setIsMinified] = useState(false);

  async function exportToHTML() {
    const html = await pageSchema.exportHTML(page, pageSchema, componentIndex, models, pageData, relationIndexes, nowTick, platformUser, dataArray, status, state, user, viewport, website, isMinified);

    const blob = new Blob([html], { type: "text/html" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = fileName.endsWith(".html") ? fileName : fileName + ".html";
    a.click();

    URL.revokeObjectURL(url);
  }

  function onChangeFileName(e) {
    setFileName(e.target.value);
  }

  function onChangeIsMinified(e) {
    setIsMinified(e.target.checked);
  }

  function onClickCancel(e) {
    setFileName("index");
    setIsMinified(false);

    if (setIsVisible) {
      setIsVisible(false);
    }
  }

  function onClickExport(e) {
    try {
      exportToHTML();
    } catch (error) {}

    setFileName("index");
    setIsMinified(false);

    if (setIsVisible) {
      setIsVisible(false);
    }
  }

  useEffect(() => {
    if (isVisible) {
      dialogRef?.current?.showModal();
    } else {
      dialogRef?.current?.close();
    }
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <DarkDialog dialogRef={dialogRef} minWidth="300px">
      {{
        slots: {
          header: [<Heading color="#e5e7eb" key="1" level="5" text="Export Page to HTML" />],
          body: [
            <div key="1" style={{ display: "grid", gap: "1rem" }}>
              <DarkLabel htmlFor="html-export-file-name" text="File name" />
              <DarkInput id="html-export-file-name" onChange={onChangeFileName} placeholder="index" value={fileName} />
              <DarkLabel htmlFor="html-export-minified" text="Minified" />
              <DarkSwitch checked={isMinified} id="html-export-minified" onChange={onChangeIsMinified} />
            </div>,
          ],
          footer: [
            <DarkButton key="1" onClick={onClickCancel} type="button">
              <Icon icon={faCancel} size={16} /> Cancel
            </DarkButton>,
            <DarkButton disabled={fileName.trim() === ""} key="2" onClick={onClickExport} theme="primary" type="button">
              <Icon icon={faFileHtml} size={16} /> Export
            </DarkButton>,
          ],
        },
      }}
    </DarkDialog>
  );
}
