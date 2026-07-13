// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useEffect, useRef } from "react";
import { faClose } from "@fortawesome/pro-solid-svg-icons";

import { DarkButton } from "../button/Button";
import { DarkDialog } from "../dialog/Dialog";
import Heading from "../heading/Heading";
import Icon from "./Icon";
import { useWebPageBuilderPageState } from "../../context/useWebPageBuilder";

import importedStyles from "./PageCodeDialog.module.css";

export default function PageCodeDialog(props) {
  const isVisible = props.isVisible;
  const setIsVisible = props.setIsVisible;
  const styles = props.styles || importedStyles;

  const dialogRef = useRef();

  const { page } = useWebPageBuilderPageState();

  function onClickClose(e) {
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
          header: [<Heading color="#e5e7eb" key="1" level="5" text="Page Code" />],
          body: [
            <div className={styles.content} key="1">
              <pre>
                <code>{JSON.stringify(page, null, 2)}</code>
              </pre>
            </div>,
          ],
          footer: [
            <DarkButton key="1" onClick={onClickClose} type="button">
              <Icon icon={faClose} size={16} /> Close
            </DarkButton>,
          ],
        },
      }}
    </DarkDialog>
  );
}
