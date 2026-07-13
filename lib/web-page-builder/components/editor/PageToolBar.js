// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useState } from "react";
import { faCube, faLayerGroup } from "@fortawesome/pro-solid-svg-icons";

import ComponentAccordion from "./ComponentAccordion";
import Icon from "./Icon";
import PageToolBarPanel from "./PageToolBarPanel";
import TemplateAccordion from "./TemplateAccordion";
import { useLanguage } from "@/context/language";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

import importedStyles from "./PageToolBar.module.css";

export default function PageToolBar(props) {
  const isPlatformAdmin = props.isPlatformAdmin;
  const plan = props.plan;
  const styles = props.styles || importedStyles;

  const { language } = useLanguage();

  const [active, setActive] = useState("components");

  function renderPanel() {
    switch (active) {
      case "components":
        return (
          <PageToolBarPanel active={active} setActive={setActive} title={platform.websiteAdmin.pages.editor.components[language]}>
            <ComponentAccordion isPlatformAdmin={isPlatformAdmin} plan={plan} />
          </PageToolBarPanel>
        );
      case "templates":
        return (
          <PageToolBarPanel active={active} setActive={setActive} title={platform.websiteAdmin.pages.editor.templates[language]}>
            <TemplateAccordion isPlatformAdmin={isPlatformAdmin} plan={plan} />
          </PageToolBarPanel>
        );
      default:
        return null;
    }
  }

  return (
    <nav className={styles.tool_bar}>
      <ul>
        <li className={active === "components" ? styles.active : undefined} onClick={(e) => setActive("components")}>
          <Icon icon={faCube} size={16} />
        </li>
        <li className={active === "templates" ? styles.active : undefined} onClick={(e) => setActive("templates")}>
          <Icon icon={faLayerGroup} size={16} />
        </li>
      </ul>
      {renderPanel()}
    </nav>
  );
}
