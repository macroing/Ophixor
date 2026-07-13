// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { faClose, faRedo, faSave, faUndo } from "@fortawesome/pro-solid-svg-icons";

import ComponentRenderer from "./ComponentRenderer";
import ComponentTemplateSaveDialog from "./ComponentTemplateSaveDialog";
import ComponentToolBar from "./ComponentToolBar";
import ContextMenu from "./ContextMenu";
import { DarkButton } from "../button/Button";
import Icon from "./Icon";
import IntegrationPickerDialog from "./IntegrationPickerDialog";
import MediaPicker from "./MediaPicker";
import OverlayRenderer from "./OverlayRenderer";
import PageCodeDialog from "./PageCodeDialog";
import PageToHTMLExportDialog from "./PageToHTMLExportDialog";
import PageToolBar from "./PageToolBar";
import { DataModelProvider } from "./DataModelProvider";
import { OverlayProvider } from "./OverlayProvider";
import { classNames } from "../runtime/style/classNames";
import { getComponentById } from "../../page/queries";
import { can, getPermissions } from "@/lib/services/permissions";
import { useCurrentPlatformUser } from "@/context/current-platform-user";
import { useLanguage } from "@/context/language";
import { useViewport } from "@/hooks/useViewport";
import { useWebPageBuilderActions, useWebPageBuilderData, useWebPageBuilderPageSchema, useWebPageBuilderPageState, useWebPageBuilderUI } from "../../context/useWebPageBuilder";
import { PLAN_FREE, PLAN_PERSONAL, PLAN_PRO, PLAN_PRO_GOLD } from "@/definitions/plan-definitions";

import platform from "@/definitions/platform-website-admin.json" with { type: "json" };

import importedStyles from "./PageEditorDialog.module.css";

const INTERNAL_MEDIA_REGEX = /^\/api\/website-media\/[a-f0-9]{24}$/i;
const PUBLIC_MEDIA_REGEX = /^\/.*$/i;

export default function PageEditorDialog(props) {
  const SCROLL_SPEED = 12;
  const SCROLL_ZONE_SIZE = 80;

  const hasChanged = props.hasChanged;
  const isDemo = props.isDemo;
  const isVisible = props.isVisible;
  const message = props.message;
  const messageStatus = props.messageStatus;
  const onClickCancel = props.onClickCancel;
  const onClickSave = props.onClickSave;
  const onClickSaveComponentTemplate = props.onClickSaveComponentTemplate;
  const setIsVisible = props.setIsVisible;
  const styles = props.styles || importedStyles;
  const website = props.website;

  const { platformUser } = useCurrentPlatformUser();

  const { language } = useLanguage();

  const isMountedRef = useRef(false);

  const [integrations, setIntegrations] = useState([]);
  const [isIntegrationPickerOpen, setIsIntegrationPickerOpen] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [isVisiblePageCodeDialog, setIsVisiblePageCodeDialog] = useState(false);
  const [isVisiblePageToHTMLExportDialog, setIsVisiblePageToHTMLExportDialog] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);

  const { isMobileOriginal, name, resetSimulation, simulateDesktop, simulateMobile, simulateTablet, width } = useViewport();

  const { copiedComponentForComponentTemplate, updateComponent } = useWebPageBuilderActions();

  const { pageData } = useWebPageBuilderData();

  const { pageSchema } = useWebPageBuilderPageSchema();

  const { canRedo, canUndo, componentIndex, draftStart, isDraftEnabled, page, redo, undo } = useWebPageBuilderPageState();

  const { editorRef, isShowingContentOnly, selectedId } = useWebPageBuilderUI();

  const componentSchemas = pageSchema?.componentSchemas || {};

  const id = page?.id;

  const selected = useMemo(() => (selectedId === id ? page : selectedId ? componentIndex[selectedId] : null), [componentIndex, id, page, selectedId]);

  const schema = selectedId === id ? pageSchema : componentSchemas?.[selected?.type];

  const permissions = useMemo(() => getPermissions(platformUser, website), [platformUser, website]);

  const isCollaborator = permissions?.isCollaborator ? true : false;
  const isPlatformAdmin = platformUser?.isPlatformAdmin || false;

  const plan = isCollaborator || isDemo ? PLAN_PRO_GOLD : platformUser?.plan || PLAN_FREE;

  const canCreateMedia = isPlatformAdmin || can(permissions, "media", "create");
  const canReadMedia = isPlatformAdmin || isDemo || can(permissions, "media", "read");

  const hasPersonal = isPlatformAdmin || isDemo || plan === PLAN_PERSONAL || plan === PLAN_PRO || plan === PLAN_PRO_GOLD;
  const hasPro = isPlatformAdmin || isDemo || plan === PLAN_PRO || plan === PLAN_PRO_GOLD;
  const hasProGold = isPlatformAdmin || isDemo || plan === PLAN_PRO_GOLD;

  const canUseAction = hasPro;
  const canUseDataSourceExpression = hasPro;
  const canUseDataSourceIntegration = hasProGold;
  const canUseDataSourceModel = hasPro;
  const canUseExport = hasPro;
  const canUseExpression = hasPersonal;
  const canUsePageCodeViewer = hasPro;
  const canUseSelectors = hasPro;
  const canUseVisibility = hasPersonal;

  const isAllowedToView = hasPersonal;

  function autoScroll(clientY) {
    if (editorRef.current) {
      const rect = editorRef.current.getBoundingClientRect();

      const topZone = rect.top + SCROLL_ZONE_SIZE;
      const bottomZone = rect.bottom - SCROLL_ZONE_SIZE;

      if (clientY < topZone) {
        editorRef.current.scrollTop -= SCROLL_SPEED;
      } else if (clientY > bottomZone) {
        editorRef.current.scrollTop += SCROLL_SPEED;
      }
    }
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

  function onClickClose(e) {
    resetSimulation();

    setIsVisible(false);

    if (onClickCancel) {
      onClickCancel(e);
    }
  }

  function onClickRedo(e) {
    redo();
  }

  function onClickSaveImpl(e) {
    if (onClickSave) {
      onClickSave(e);
    }
  }

  function onClickSimulateDesktop(e) {
    simulateDesktop();
  }

  function onClickSimulateMobile(e) {
    simulateMobile();
  }

  function onClickSimulateTablet(e) {
    simulateTablet();
  }

  function onClickUndo(e) {
    undo();
  }

  function onDragOver(e) {
    e.preventDefault();

    autoScroll(e.clientY);
  }

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (selectedId) {
      draftStart();
    }
  }, [draftStart, selectedId]);

  useEffect(() => {
    if (website) {
      async function load() {
        try {
          const { data } = await axios.get("/api/website-integration?websiteId=" + website._id.toString());

          if (data.websiteIntegrations) {
            setIntegrations(data.websiteIntegrations);
          } else {
            setIntegrations([]);
          }
        } catch (error) {
          setIntegrations([]);
        }
      }

      if (website._id?.toString() && website._id.toString() !== "id") {
        load();
      }
    }
  }, [setIntegrations, website]);

  if (isVisible && isAllowedToView) {
    return (
      <OverlayProvider>
        <div className={styles.dialog}>
          <header className={styles.dialog_header}>
            <div className={styles.brand}>
              <Image alt={`${process.env.NEXT_PUBLIC_PLATFORM_NAME} Logo`} className={styles.icon_image} height={24} loader={loader} src={"/images/logo.webp"} width={24} />
              <span className={styles.name}>{process.env.NEXT_PUBLIC_PLATFORM_NAME}</span>
            </div>
            {!isMobileOriginal && (
              <div className={styles.toggle_buttons}>
                <button className={styles.toggle_button + (name === "mobile" ? " " + styles.toggle_button_active : "")} onClick={onClickSimulateMobile} type="button">
                  {platform.websiteAdmin.pages.editor.mobile[language]}
                </button>
                <button className={styles.toggle_button + (name === "tablet" ? " " + styles.toggle_button_active : "")} onClick={onClickSimulateTablet} type="button">
                  {platform.websiteAdmin.pages.editor.tablet[language]}
                </button>
                <button className={styles.toggle_button + (name === "desktop" ? " " + styles.toggle_button_active : "")} onClick={onClickSimulateDesktop} type="button">
                  {platform.websiteAdmin.pages.editor.desktop[language]}
                </button>
              </div>
            )}
            <span className={styles.close}>
              <Icon icon={faClose} onClick={onClickClose} size={16} theme="danger" />
            </span>
          </header>
          <section className={styles.dialog_body}>
            <PageToolBar isPlatformAdmin={isPlatformAdmin} plan={plan} />
            <div className={styles.canvas_container}>
              <div className={classNames(styles.canvas, isShowingContentOnly && styles.canvas_content_only)} onDragOver={onDragOver} ref={editorRef} style={{ maxWidth: `${width}px` }}>
                <DataModelProvider value={pageData}>
                  <ComponentRenderer component={page} index={0} isMountedRef={isMountedRef} parentId={page?.id || "page"} slotName="body" />
                  <ContextMenu canUseExport={canUseExport} canUsePageCodeViewer={canUsePageCodeViewer} setIsVisiblePageCodeDialog={setIsVisiblePageCodeDialog} setIsVisiblePageToHTMLExportDialog={setIsVisiblePageToHTMLExportDialog} />
                </DataModelProvider>
              </div>
            </div>
            <ComponentToolBar canReadMedia={canReadMedia} canUseAction={canUseAction} canUseDataSourceExpression={canUseDataSourceExpression} canUseDataSourceIntegration={canUseDataSourceIntegration} canUseDataSourceModel={canUseDataSourceModel} canUseExpression={canUseExpression} canUseSelectors={canUseSelectors} canUseVisibility={canUseVisibility} integrations={integrations} isPlatformAdmin={isPlatformAdmin} plan={plan} schema={schema} selected={selected} selectedIntegration={selectedIntegration} setIsIntegrationPickerOpen={setIsIntegrationPickerOpen} setIsMediaPickerOpen={setIsMediaPickerOpen} />
            {isIntegrationPickerOpen && (
              <IntegrationPickerDialog
                integrations={integrations}
                isOpen={isIntegrationPickerOpen}
                onClose={() => {
                  setIsIntegrationPickerOpen(false);

                  setSelectedIntegration(null);
                }}
                onSelect={(integration) => {
                  setIsIntegrationPickerOpen(false);

                  setSelectedIntegration(integration);
                }}
                setIntegrations={setIntegrations}
                website={website}
              />
            )}
            {isMediaPickerOpen && (
              <MediaPicker
                accept={schema?.mediaPickerAccept || "image"}
                canCreateMedia={canCreateMedia}
                canReadMedia={canReadMedia}
                isDemo={isDemo}
                isOpen={isMediaPickerOpen}
                onClose={() => setIsMediaPickerOpen(false)}
                onSelect={(media) => {
                  updateComponent(selected.id, {
                    props: {
                      alt: media.alt,
                      height: media.height + "px",
                      src: media.url,
                      width: media.width + "px",
                    },
                  });
                }}
                website={website}
              />
            )}
            {copiedComponentForComponentTemplate && <ComponentTemplateSaveDialog onClickSave={onClickSaveComponentTemplate} />}
            {isVisiblePageCodeDialog && <PageCodeDialog isVisible={isVisiblePageCodeDialog} setIsVisible={setIsVisiblePageCodeDialog} />}
            {isVisiblePageToHTMLExportDialog && <PageToHTMLExportDialog isVisible={isVisiblePageToHTMLExportDialog} setIsVisible={setIsVisiblePageToHTMLExportDialog} />}
            <OverlayRenderer />
          </section>
          <footer className={styles.dialog_footer}>
            <div className={styles.actions}>
              <DarkButton disabled={!canUndo || isDraftEnabled} onClick={onClickUndo} type="button">
                <Icon icon={faUndo} size={16} />
                {isMobileOriginal ? "" : " " + platform.websiteAdmin.pages.editor.undo[language]}
              </DarkButton>
              <DarkButton disabled={!canRedo || isDraftEnabled} onClick={onClickRedo} type="button">
                <Icon icon={faRedo} size={16} />
                {isMobileOriginal ? "" : " " + platform.websiteAdmin.pages.editor.redo[language]}
              </DarkButton>
            </div>
            <div className={styles.message + (messageStatus === "failure" ? " " + styles.message_failure : "") + (messageStatus === "success" ? " " + styles.message_success : "")}>{message || ""}</div>
            <div className={styles.actions}>
              <DarkButton disabled={!hasChanged} onClick={onClickSaveImpl} theme="primary" type="button">
                <Icon icon={faSave} size={16} />
                {isMobileOriginal ? "" : " " + platform.websiteAdmin.pages.editor.save[language]}
              </DarkButton>
            </div>
          </footer>
        </div>
      </OverlayProvider>
    );
  }

  return null;
}
