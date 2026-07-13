// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useEffect, useRef, useState } from "react";
import { faCancel, faLayerGroup } from "@fortawesome/pro-solid-svg-icons";

import { DarkButton } from "../button/Button";
import { DarkDialog } from "../dialog/Dialog";
import { DarkInput } from "../input/Input";
import { DarkLabel } from "../label/Label";
import Heading from "../heading/Heading";
import Icon from "./Icon";
import { useLanguage } from "@/context/language";
import { useWebPageBuilderActions } from "../../context/useWebPageBuilder";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

export default function ComponentTemplateSaveDialog(props) {
  const onClickSave = props.onClickSave;

  const { language } = useLanguage();

  const dialogRef = useRef();

  const { cancelComponentTemplate, copiedComponentForComponentTemplate, saveComponentTemplate } = useWebPageBuilderActions();

  const [description, setDescription] = useState("");
  const [label, setLabel] = useState("");
  const [type, setType] = useState("");

  function onChangeDescription(e) {
    setDescription(e.target.value);
  }

  function onChangeLabel(e) {
    setLabel(e.target.value);
  }

  function onChangeType(e) {
    setType(e.target.value);
  }

  function onClickCancel(e) {
    cancelComponentTemplate();

    setDescription("");
    setLabel("");
    setType("");
  }

  function onClickSaveImpl(e) {
    const descriptionTrimmed = description.trim();
    const labelTrimmed = label.trim();
    const typeTrimmed = type.trim();

    if (labelTrimmed !== "" && typeTrimmed !== "") {
      const newComponentTemplate = saveComponentTemplate({ description: descriptionTrimmed, label: labelTrimmed, type: typeTrimmed });

      if (newComponentTemplate && onClickSave) {
        onClickSave(e, newComponentTemplate);
      }

      setDescription("");
      setLabel("");
      setType("");
    }
  }

  useEffect(() => {
    const newType = label
      .trim()
      .replace(/[^a-zA-Z0-9åäöÅÄÖ]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();

    setType(newType);
  }, [label]);

  useEffect(() => {
    if (copiedComponentForComponentTemplate) {
      dialogRef?.current?.showModal();
    } else {
      dialogRef?.current?.close();
    }
  }, [copiedComponentForComponentTemplate]);

  if (!copiedComponentForComponentTemplate) {
    return null;
  }

  return (
    <DarkDialog dialogRef={dialogRef} minWidth="300px">
      {{
        slots: {
          header: [<Heading color="#e5e7eb" key="1" level="5" text={platform.websiteAdmin.pages.editor.componentTemplateSaveDialog.title[language]} />],
          body: [
            <div key="1" style={{ display: "grid", gap: "1rem" }}>
              <DarkLabel text={platform.websiteAdmin.pages.editor.componentTemplateSaveDialog.labelTitle[language]} />
              <DarkInput onChange={onChangeLabel} placeholder={platform.websiteAdmin.pages.editor.componentTemplateSaveDialog.labelPlaceholder[language]} value={label} />
              <DarkLabel text={platform.websiteAdmin.pages.editor.componentTemplateSaveDialog.typeTitle[language]} />
              <DarkInput onChange={onChangeType} placeholder={platform.websiteAdmin.pages.editor.componentTemplateSaveDialog.typePlaceholder[language]} readOnly={true} value={type} />
              <DarkLabel text={platform.websiteAdmin.pages.editor.componentTemplateSaveDialog.descriptionTitle[language]} />
              <DarkInput onChange={onChangeDescription} placeholder={platform.websiteAdmin.pages.editor.componentTemplateSaveDialog.descriptionPlaceholder[language]} value={description} />
            </div>,
          ],
          footer: [
            <DarkButton key="1" onClick={onClickCancel} type="button">
              <Icon icon={faCancel} size={16} /> {platform.websiteAdmin.pages.editor.componentTemplateSaveDialog.cancel[language]}
            </DarkButton>,
            <DarkButton disabled={label.trim() === "" || type.trim() === ""} key="2" onClick={onClickSaveImpl} theme="primary" type="button">
              <Icon icon={faLayerGroup} size={16} /> {platform.websiteAdmin.pages.editor.componentTemplateSaveDialog.create[language]}
            </DarkButton>,
          ],
        },
      }}
    </DarkDialog>
  );
}
