// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { faBolt, faCheck, faChevronRight, faCode, faClose, faDatabase, faFont, faGaugeHigh, faImage, faObjectGroup, faPalette, faQuestion, faShield, faTableLayout } from "@fortawesome/pro-solid-svg-icons";

import { DarkButton } from "../button/Button";
import Icon from "./Icon";
import { useLanguage } from "@/context/language";
import { useViewport } from "@/hooks/useViewport";
import { useWebPageBuilderPageState, useWebPageBuilderUI } from "../../context/useWebPageBuilder";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

import importedStyles from "./ComponentToolBarPanel.module.css";

export default function ComponentToolBarPanel(props) {
  const active = props.active;
  const children = props.children;
  const setActive = props.setActive;
  const styles = props.styles || importedStyles;
  const title = props.title;

  const { language } = useLanguage();

  const { isMobileOriginal } = useViewport();

  const { draftCancel, draftSave, hasPageChanged } = useWebPageBuilderPageState();

  const { setSelectedId } = useWebPageBuilderUI();

  function getFontAwesome() {
    switch (active) {
      case "action":
        return <Icon icon={faBolt} size={16} />;
      case "content":
        return <Icon icon={faFont} size={16} />;
      case "data-source":
        return <Icon icon={faDatabase} size={16} />;
      case "layout":
        return <Icon icon={faTableLayout} size={16} />;
      case "media":
        return <Icon icon={faImage} size={16} />;
      case "optimization":
        return <Icon icon={faGaugeHigh} size={16} />;
      case "privacy":
        return <Icon icon={faShield} size={16} />;
      case "selectors":
        return <Icon icon={faCode} size={16} />;
      case "styling":
        return <Icon icon={faPalette} size={16} />;
      case "variants":
        return <Icon icon={faObjectGroup} size={16} />;
      default:
        return <Icon icon={faQuestion} size={16} />;
    }
  }

  function onClickCancel() {
    draftCancel();

    setSelectedId(null);
  }

  function onClickCollapse(e) {
    if (setActive) {
      setActive("");
    }
  }

  function onClickSave() {
    draftSave();

    setSelectedId(null);
  }

  if (active) {
    return (
      <div className={styles.panel + (isMobileOriginal ? " " + styles.panel_mobile : "")}>
        <div className={styles.header}>
          <Icon icon={faChevronRight} onClick={onClickCollapse} size={16} />
          <span>{title}</span>
          <span>{getFontAwesome()}</span>
        </div>
        <div className={styles.body}>{children}</div>
        <div className={styles.footer}>
          <DarkButton onClick={onClickCancel} width="100%">
            <Icon icon={faClose} size={16} /> {platform.websiteAdmin.pages.editor.cancel[language]}
          </DarkButton>
          <DarkButton disabled={!hasPageChanged} onClick={onClickSave} theme="primary" width="100%">
            <Icon icon={faCheck} size={16} /> {platform.websiteAdmin.pages.editor.apply[language]}
          </DarkButton>
        </div>
      </div>
    );
  }

  return null;
}
