// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { isValidElement, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

import { useViewport } from "@/hooks/useViewport";

import importedStyles from "./MenuBar.module.css";

export default function MenuBar(props) {
  const INTERNAL_MEDIA_REGEX = /^\/api\/website-media\/[a-f0-9]{24}$/i;
  const PUBLIC_MEDIA_REGEX = /^\/.*$/i;

  const backdropFilter = props.backdropFilter;
  const backgroundColor = props.backgroundColor;
  const backgroundColorIconLetter = props.backgroundColorIconLetter;
  const backgroundColorItemPrimary = props.backgroundColorItemPrimary;
  const backgroundColorItemPrimaryHover = props.backgroundColorItemPrimaryHover;
  const backgroundColorLineHover = props.backgroundColorLineHover;
  const backgroundColorMobileMenu = props.backgroundColorMobileMenu;
  const backgroundColorSubMenu = props.backgroundColorSubMenu;
  const backgroundColorSubMenuItemHover = props.backgroundColorSubMenuItemHover;
  const backgroundColorSubMenuItemPrimary = props.backgroundColorSubMenuItemPrimary;
  const backgroundColorSubMenuItemPrimaryHover = props.backgroundColorSubMenuItemPrimaryHover;
  const backgroundImage = props.backgroundImage;
  const backgroundImageMobileMenu = props.backgroundImageMobileMenu;
  const borderColor = props.borderColor;
  const color = props.color;
  const colorHover = props.colorHover;
  const colorIconLetter = props.colorIconLetter;
  const colorItem = props.colorItem;
  const colorItemHover = props.colorItemHover;
  const colorItemPrimary = props.colorItemPrimary;
  const colorItemPrimaryHover = props.colorItemPrimaryHover;
  const colorSubMenuItem = props.colorSubMenuItem;
  const colorSubMenuItemHover = props.colorSubMenuItemHover;
  const colorSubMenuItemPrimary = props.colorSubMenuItemPrimary;
  const colorSubMenuItemPrimaryHover = props.colorSubMenuItemPrimaryHover;
  const componentId = props.componentId;
  const defaultUrl = props.defaultUrl || "/";
  const editor = props.editor;
  const iconImageAlt = props.iconImageAlt;
  const iconImageSrc = props.iconImageSrc;
  const iconLetter = props.iconLetter;
  const items = Array.isArray(props.items) ? props.items : [];
  const position = props.position;
  const resolveUrl = props.resolveUrl;
  const styles = props.styles || importedStyles;
  const title = props.title || "Titel";
  const top = props.top;

  const pathname = usePathname();

  const pathnameDecoded = useMemo(() => decodeURI(pathname), [pathname]);

  const router = useRouter();

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { isDesktop, isMobile, isTablet, width } = useViewport();

  const style = {};

  if (backdropFilter) {
    style["--menu-bar-backdrop-filter"] = backdropFilter;
  }

  if (backgroundColor) {
    style["--menu-bar-background-color"] = backgroundColor;
  }

  if (backgroundColorIconLetter) {
    style["--menu-bar-background-color-icon-letter"] = backgroundColorIconLetter;
  }

  if (backgroundColorItemPrimary) {
    style["--menu-bar-background-color-item-primary"] = backgroundColorItemPrimary;
  }

  if (backgroundColorItemPrimaryHover) {
    style["--menu-bar-background-color-item-primary-hover"] = backgroundColorItemPrimaryHover;
  }

  if (backgroundColorLineHover) {
    style["--menu-bar-background-color-line-hover"] = backgroundColorLineHover;
  }

  if (backgroundColorMobileMenu) {
    style["--menu-bar-background-color-mobile-menu"] = backgroundColorMobileMenu;
  }

  if (backgroundColorSubMenu) {
    style["--menu-bar-background-color-sub-menu"] = backgroundColorSubMenu;
  }

  if (backgroundColorSubMenuItemHover) {
    style["--menu-bar-background-color-sub-menu-item-hover"] = backgroundColorSubMenuItemHover;
  }

  if (backgroundColorSubMenuItemPrimary) {
    style["--menu-bar-background-color-sub-menu-item-primary"] = backgroundColorSubMenuItemPrimary;
  }

  if (backgroundColorSubMenuItemPrimaryHover) {
    style["--menu-bar-background-color-sub-menu-item-primary-hover"] = backgroundColorSubMenuItemPrimaryHover;
  }

  if (backgroundImage) {
    style["--menu-bar-background-image"] = backgroundImage;
  }

  if (backgroundImageMobileMenu) {
    style["--menu-bar-background-image-mobile-menu"] = backgroundImageMobileMenu;
  }

  if (borderColor) {
    style["--menu-bar-border-color"] = borderColor;
  }

  if (color) {
    style["--menu-bar-color"] = color;
  }

  if (colorHover) {
    style["--menu-bar-color-hover"] = colorHover;
  }

  if (colorIconLetter) {
    style["--menu-bar-color-icon-letter"] = colorIconLetter;
  }

  if (colorItem) {
    style["--menu-bar-color-item"] = colorItem;
  }

  if (colorItemHover) {
    style["--menu-bar-color-item-hover"] = colorItemHover;
  }

  if (colorItemPrimary) {
    style["--menu-bar-color-item-primary"] = colorItemPrimary;
  }

  if (colorItemPrimaryHover) {
    style["--menu-bar-color-item-primary-hover"] = colorItemPrimaryHover;
  }

  if (colorSubMenuItem) {
    style["--menu-bar-color-sub-menu-item"] = colorSubMenuItem;
  }

  if (colorSubMenuItemHover) {
    style["--menu-bar-color-sub-menu-item-hover"] = colorSubMenuItemHover;
  }

  if (colorSubMenuItemPrimary) {
    style["--menu-bar-color-sub-menu-item-primary"] = colorSubMenuItemPrimary;
  }

  if (colorSubMenuItemPrimaryHover) {
    style["--menu-bar-color-sub-menu-item-primary-hover"] = colorSubMenuItemPrimaryHover;
  }

  if (position) {
    style["--menu-bar-position"] = position;
  }

  if (top) {
    style["--menu-bar-top"] = top;
  }

  if (width > 0) {
    style["maxWidth"] = `${width}px`;
  }

  clearStyle(style);

  function cx(...classes) {
    return classes.filter(Boolean).join(" ");
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

  useEffect(() => {
    if (isDesktop) {
      setIsMobileOpen(false);
    }
  }, [isDesktop, setIsMobileOpen]);

  return (
    <header className={cx(styles.menu_bar, editor?.isSelected && styles.menu_bar_selected, (!editor || editor?.isShowingContentOnly) && styles.menu_bar_content_only)} data-pc-id={componentId} draggable={editor?.draggable} onContextMenu={editor?.onContextMenu} onDragStart={editor?.onDragStart} onMouseDown={editor?.onMouseDown} style={style}>
      <nav className={styles.nav}>
        <Link className={styles.title} href={typeof resolveUrl === "function" ? resolveUrl(defaultUrl) : defaultUrl}>
          {iconImageAlt && iconImageSrc && <Image alt={iconImageAlt} className={styles.icon_image} height={32} loader={loader} src={iconImageSrc} width={32} />}
          {iconLetter && <span className={styles.icon_letter}>{iconLetter}</span>} {title}
        </Link>
        {!isMobile && !isTablet && (
          <div className={styles.desktop_only}>
            <MenuItems items={items} pathname={pathnameDecoded} resolveUrl={resolveUrl} router={router} styles={styles} />
          </div>
        )}
        {(isMobile || isTablet) && (
          <button aria-label="Toggle menu" className={styles.hamburger} onClick={() => setIsMobileOpen(!isMobileOpen)}>
            <span />
            <span />
            <span />
          </button>
        )}
      </nav>
      {isMobileOpen && (
        <div className={styles.mobile_menu}>
          <MenuItems items={items} pathname={pathnameDecoded} resolveUrl={resolveUrl} router={router} styles={styles} />
        </div>
      )}
    </header>
  );
}

function MenuItems(props) {
  const isSubMenu = props.isSubMenu || false;
  const items = props.items;
  const pathname = props.pathname;
  const resolveUrl = props.resolveUrl;
  const router = props.router;
  const styles = props.styles || importedStyles;

  return (
    <ul className={isSubMenu ? styles.sub_menu_items : styles.menu_items}>
      {items.map((item, itemIndex) => {
        const hasItems = Array.isArray(item.items) && item.items.length > 0;

        const href = typeof item?.href === "string" ? item.href : "";
        const label = typeof item?.label === "string" || isValidElement(item?.label) ? item.label : "";
        const theme = typeof item?.theme === "string" ? item.theme : "";
        const type = typeof item?.type === "string" ? item.type : "";

        const hrefResolved = typeof resolveUrl === "function" && href ? resolveUrl(href) : href;

        const onClick = typeof item?.onClick === "function" ? item.onClick : hrefResolved ? (e) => router.push(hrefResolved) : undefined;

        const isActive = typeof pathname === "string" && typeof hrefResolved === "string" && hrefResolved !== "" && pathname.startsWith(hrefResolved);

        return (
          <li className={`${styles.menu_item} ${hasItems ? styles.has_items : ""}`} key={itemIndex}>
            {type === "link" ? (
              <Link className={styles.item_link + (theme === "primary" ? " " + styles.item_link_primary : "") + (isActive ? " " + styles.item_link_active : "")} href={hrefResolved}>
                {label}
              </Link>
            ) : type === "button" ? (
              <button className={styles.item_button + (theme === "primary" ? " " + styles.item_button_primary : "") + (isActive ? " " + styles.item_button_active : "")} onClick={onClick}>
                {label}
              </button>
            ) : type === "divider" ? (
              <div className={styles.item_divider}></div>
            ) : (
              <span className={styles.item_label + (theme === "primary" ? " " + styles.item_label_primary : "")}>{label}</span>
            )}
            {hasItems && <MenuItems isSubMenu={true} items={item.items} pathname={pathname} resolveUrl={resolveUrl} router={router} styles={styles} />}
          </li>
        );
      })}
    </ul>
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
    "--menu-bar-backdrop-filter": "blur(8px)",
    "--menu-bar-background-color": "var(--pc-semantic-surface-overlay)",
    "--menu-bar-background-color-icon-letter": "var(--pc-semantic-interactive-primary)",
    "--menu-bar-background-color-item-primary": "var(--pc-semantic-interactive-primary)",
    "--menu-bar-background-color-item-primary-hover": "var(--pc-semantic-interactive-primary-hover)",
    "--menu-bar-background-color-line-hover": "var(--pc-semantic-interactive-primary)",
    "--menu-bar-background-color-mobile-menu": "var(--pc-semantic-surface-base)",
    "--menu-bar-background-color-sub-menu": "var(--pc-semantic-surface-base)",
    "--menu-bar-background-color-sub-menu-item-hover": "var(--pc-semantic-surface-primary)",
    "--menu-bar-background-color-sub-menu-item-primary": "var(--pc-semantic-interactive-primary)",
    "--menu-bar-background-color-sub-menu-item-primary-hover": "var(--pc-semantic-interactive-primary-hover)",
    "--menu-bar-background-image": "none",
    "--menu-bar-background-image-mobile-menu": "none",
    "--menu-bar-border-color": "var(--pc-semantic-border-default)",
    "--menu-bar-color": "var(--pc-semantic-text-primary)",
    "--menu-bar-color-hover": "var(--pc-semantic-text-primary)",
    "--menu-bar-color-icon-letter": "var(--pc-semantic-text-inverse)",
    "--menu-bar-color-item": "var(--pc-semantic-text-secondary)",
    "--menu-bar-color-item-hover": "var(--pc-semantic-text-primary)",
    "--menu-bar-color-item-primary": "var(--pc-semantic-text-inverse)",
    "--menu-bar-color-item-primary-hover": "var(--pc-semantic-text-inverse)",
    "--menu-bar-color-sub-menu-item": "var(--pc-semantic-text-secondary)",
    "--menu-bar-color-sub-menu-item-hover": "var(--pc-semantic-text-primary)",
    "--menu-bar-color-sub-menu-item-primary": "var(--pc-semantic-text-inverse)",
    "--menu-bar-color-sub-menu-item-primary-hover": "var(--pc-semantic-text-inverse)",
    "--menu-bar-position": "relative",
    "--menu-bar-top": "auto",
  };
}
