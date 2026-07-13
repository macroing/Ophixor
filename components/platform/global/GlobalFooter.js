// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faClockRotateLeft, faCookie, faFileLines, faFileContract, faShield, faTableCellsLarge } from "@fortawesome/pro-solid-svg-icons";

import Footer from "@/lib/web-page-builder/components/footer/Footer";
import Icon from "@/lib/web-page-builder/components/editor/Icon";
import { useLanguage } from "@/context/language";

import platform from "@/definitions/platform.json" with { type: "json" };

import importedStyles from "./GlobalFooter.module.css";

export default function GlobalFooter(props) {
  const styles = props.styles || importedStyles;

  const { language } = useLanguage();

  const description = platform.footer.description[language];
  const items = createItems(language, styles);
  const textBottomLeft = platform.footer.textBottomLeft[language];
  const textBottomRight = platform.footer.textBottomRight[language];
  const title = platform.footer.title[language];

  return <Footer description={description} items={items} textBottomLeft={textBottomLeft} textBottomRight={textBottomRight} title={title} />;
}

function createItems(language, styles) {
  return [
    {
      items: [
        {
          href: "/features",
          label: <Item icon={faTableCellsLarge} styles={styles} text={platform.footer.features[language]} />,
        },
        /*
        {
          href: "/pricing",
          label: platform.footer.pricing[language]
        },
        */
      ],
      label: platform.footer.product[language],
    },
    {
      items: [
        {
          href: "/docs",
          label: <Item icon={faFileLines} styles={styles} text={platform.footer.documentation[language]} />,
        },
        {
          href: "/changelog",
          label: <Item icon={faClockRotateLeft} styles={styles} text={platform.footer.changelog[language]} />,
        },
        {
          href: "https://github.com/macroing/Ophixor",
          label: <Item icon={faGithub} styles={styles} text="GitHub" />,
          target: "_blank",
        },
      ],
      label: platform.footer.resources[language],
    },
    {
      items: [
        {
          href: "/privacy",
          label: <Item icon={faShield} styles={styles} text={platform.footer.privacy[language]} />,
        },
        {
          href: "/terms",
          label: <Item icon={faFileContract} styles={styles} text={platform.footer.terms[language]} />,
        },
        {
          href: "/cookies",
          label: <Item icon={faCookie} styles={styles} text={platform.footer.cookies[language]} />,
        },
      ],
      label: platform.footer.legal[language],
    },
  ];
}

function Item(props) {
  const icon = props.icon;
  const styles = props.styles || importedStyles;
  const text = props.text;

  return (
    <div className={styles.item}>
      <Icon icon={icon} size={16} /> {text}
    </div>
  );
}
