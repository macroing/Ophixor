// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { WebPageBuilderActionsContext, WebPageBuilderDataContext, WebPageBuilderPageSchemaContext, WebPageBuilderPageStateContext, WebPageBuilderRendererContext, WebPageBuilderRuntimeContext, WebPageBuilderUIContext } from "./WebPageBuilderContext";
import { buildSelectorsCSS } from "../components/runtime/style/buildSelectorsCSS";
import { injectCSS } from "../components/runtime/style/injectCSS";
import { buildComponentIndex, buildComponentIndexFor, buildComponentIndexForMany } from "../validation/validators";
import { buildRelationIndexes } from "../components/editor/editor-helpers";
import { createActionEngine } from "../components/runtime/action/action-engine";
import { createExpressionEngine } from "../components/runtime/expression/expression-engine";
import { createRendererEngine } from "../components/runtime/renderer/renderer-engine";
import { usePageHistory } from "../state/usePageHistory";
import { useComponentActions } from "../actions/component-actions";
import { useCurrentPlatformUser } from "@/context/current-platform-user";
import { useCurrentWebsiteUser } from "@/context/current-website-user";
import { useLanguage } from "@/context/language";
import { useSocket } from "@/context/socket";
import { useTemplateActions } from "../actions/template-actions";
import { useViewport } from "@/hooks/useViewport";
import { useWebsite } from "@/context/website";

export function WebPageBuilderProvider({ children, initialComponentTemplates = {}, initialNow = Date.now(), initialPage, isShowingContentOnly, models = {}, onPageChange, pageData, pageSchema, resolveUrl, setPageData, setState, state }) {
  const activeDropZoneRef = useRef(null);
  const editorRef = useRef(null);

  const { isAuthenticated, platformUser } = useCurrentPlatformUser();

  const { isAuthenticated: isWebsiteUserAuthenticated, signIn, signOut, signUp, websiteUser } = useCurrentWebsiteUser();

  const { language } = useLanguage();

  const router = useRouter();

  const { website } = useWebsite();

  const platformUserData = useMemo(() => {
    return {
      email: platformUser?.email || "",
      isAuthenticated,
      isAdmin: platformUser?.isPlatformAdmin || false,
      isOwner: platformUser?._id?.toString() === (website?.owner?._id ? website.owner._id.toString() : website?.owner?.toString()),
    };
  }, [isAuthenticated, platformUser, website]);

  const userData = useMemo(() => {
    return {
      email: websiteUser?.email || "",
      isAuthenticated: isWebsiteUserAuthenticated,
      name: websiteUser?.name || "",
    };
  }, [isWebsiteUserAuthenticated, websiteUser]);

  const websiteData = useMemo(() => {
    return {
      description: website?.description || "",
      language: website?.defaultLanguage || language,
      name: website?.name || "",
    };
  }, [language, website]);

  const { broadcast, connect, dataAdd, dataArray, dataClear, dataRemove, disconnect, emit, status } = useSocket();

  const viewport = useViewport();

  const history = usePageHistory(initialPage, pageSchema, isShowingContentOnly);

  const selectorsCSS = useMemo(() => {
    return buildSelectorsCSS(history.page);
  }, [history.page]);

  const [componentIndex, setComponentIndex] = useState(buildComponentIndex(history.page?.slots?.body || [], {}, history.page));
  const [componentIndexRebuildingRule, setComponentIndexRebuildingRule] = useState(null);

  const isMountedRef = useRef(false);

  const relationIndexes = useMemo(() => buildRelationIndexes(pageData), [pageData]);

  const expressionEngineRef = useRef(createExpressionEngine(componentIndex, models, initialNow, pageData, platformUserData, relationIndexes, dataArray, status, state, userData, viewport, website));

  const [dragState, setDragState] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [integrationDataMap, setIntegrationDataMap] = useState({});
  const [nowTick, setNowTick] = useState(initialNow);

  const componentActions = useComponentActions({
    history,
    pageSchema,
    setComponentIndexRebuildingRule,
  });

  const templateActions = useTemplateActions({
    history,
    initialComponentTemplates,
    pageSchema,
    setComponentIndexRebuildingRule,
  });

  const pageSchemaValue = useMemo(() => ({ pageSchema }), [pageSchema]);

  const actions = useMemo(() => {
    return {
      ...componentActions,
      ...templateActions,
    };
  }, [componentActions, templateActions]);

  const actionEngineRef = useRef(createActionEngine(expressionEngineRef.current, isMountedRef, router, setPageData, setState, signIn, signOut, signUp, broadcast, connect, dataAdd, dataClear, dataRemove, disconnect, emit, actions.updateComponent));

  const rendererEngineRef = useRef(createRendererEngine(actionEngineRef.current, expressionEngineRef.current));

  useEffect(() => {
    if (componentIndexRebuildingRule) {
      rendererEngineRef.current?.addComponentIndexRebuildingRule?.(componentIndexRebuildingRule);

      const components = history.page?.slots?.body || [];

      const type = componentIndexRebuildingRule.type;

      const componentId = componentIndexRebuildingRule.componentId;

      const parentId = componentIndexRebuildingRule.parentId;

      if (type === "addComponent") {
        setComponentIndex((oldComponentIndex) => buildComponentIndexForMany(components, [parentId, componentId], { ...oldComponentIndex }, history.page).index);
      } else if (type === "removeComponent") {
        setComponentIndex((oldComponentIndex) => {
          const newComponentIndex = { ...oldComponentIndex };

          delete newComponentIndex[componentId];

          return newComponentIndex;
        });
      } else if (type === "updateComponent") {
        setComponentIndex((oldComponentIndex) => buildComponentIndexFor(components, componentId, { ...oldComponentIndex }, history.page).index);
      }

      setComponentIndexRebuildingRule(null);
    }
  }, [componentIndexRebuildingRule, history.page, setComponentIndex, setComponentIndexRebuildingRule]);

  useEffect(() => {
    if (componentIndex) {
      rendererEngineRef.current?.setComponentIndex?.(componentIndex);
    }
  }, [componentIndex]);

  const runtime = useMemo(() => {
    return {
      nowTick,
      platformUser: platformUserData,
      resolveUrl,
      user: userData,
      viewport,
      website: websiteData,
    };
  }, [nowTick, platformUserData, resolveUrl, userData, viewport, websiteData]);

  const data = useMemo(() => {
    return {
      integrationDataMap,
      models,
      pageData,
      relationIndexes,
      setIntegrationDataMap,
      setPageData,
      setState,
      state,
    };
  }, [integrationDataMap, models, pageData, relationIndexes, state]);

  const ui = useMemo(() => {
    return {
      activeDropZoneRef,
      contextMenu,
      dragState,
      editorRef,
      isShowingContentOnly,
      selectedId,
      setContextMenu,
      setDragState,
      setSelectedId,
    };
  }, [contextMenu, dragState, isShowingContentOnly, selectedId]);

  const pageState = useMemo(() => {
    return {
      componentIndex,
      ...history,
    };
  }, [componentIndex, history]);

  const dataStoreRef = useRef(createDataStore(isShowingContentOnly, models, history.page, pageData, pageSchema, relationIndexes, resolveUrl, setIntegrationDataMap));

  const editorStoreRef = useRef(createEditorStore(activeDropZoneRef, actions.addComponent, actions.addComponentFromComponentTemplate, actions.createComponent, dragState, history.isDraftEnabled, isShowingContentOnly, actions.moveComponent, history.page, pageSchema, selectedId, setContextMenu, setDragState, setSelectedId));

  const rendererValue = useMemo(
    () => ({
      actionEngine: actionEngineRef.current,
      dataStore: dataStoreRef.current,
      editorStore: editorStoreRef.current,
      expressionEngine: expressionEngineRef.current,
      rendererEngine: rendererEngineRef.current,
    }),
    [],
  );

  useEffect(() => {
    if (onPageChange && history.page) {
      onPageChange(history.page, history.isDraftEnabled);
    }
  }, [history.isDraftEnabled, history.page, onPageChange]);

  useEffect(() => {
    injectCSS("pc-selectors-css", selectorsCSS);
  }, [selectorsCSS]);

  useEffect(() => {
    isMountedRef.current = true;

    const interval = setInterval(() => {
      rendererEngineRef.current?.setNowTick?.(Date.now());
    }, 1000);

    return () => {
      clearInterval(interval);

      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    dataStoreRef.current?.setPage(history.page);

    editorStoreRef.current?.setPage(history.page);
  }, [history.page]);

  useEffect(() => {
    editorStoreRef.current?.setAddComponent(actions.addComponent);
    editorStoreRef.current?.setAddComponentFromComponentTemplate(actions.addComponentFromComponentTemplate);
    editorStoreRef.current?.setCreateComponent(actions.createComponent);
    editorStoreRef.current?.setMoveComponent(actions.moveComponent);

    rendererEngineRef.current?.setUpdateComponent(actions.updateComponent);
  }, [actions]);

  useEffect(() => {
    editorStoreRef.current?.setActiveDropZoneRef(activeDropZoneRef);
  }, [activeDropZoneRef]);

  useEffect(() => {
    rendererEngineRef.current?.setSocketBroadcast?.(broadcast);
  }, [broadcast]);

  useEffect(() => {
    rendererEngineRef.current?.setSocketConnect?.(connect);
  }, [connect]);

  useEffect(() => {
    rendererEngineRef.current?.setSocketDataAdd?.(dataAdd);
  }, [dataAdd]);

  useEffect(() => {
    rendererEngineRef.current?.setSocketDataArray?.(dataArray);
  }, [dataArray]);

  useEffect(() => {
    rendererEngineRef.current?.setSocketDataClear?.(dataClear);
  }, [dataClear]);

  useEffect(() => {
    rendererEngineRef.current?.setSocketDataRemove?.(dataRemove);
  }, [dataRemove]);

  useEffect(() => {
    rendererEngineRef.current?.setSocketDisconnect?.(disconnect);
  }, [disconnect]);

  useEffect(() => {
    editorStoreRef.current?.setDragState(dragState);
  }, [dragState]);

  useEffect(() => {
    rendererEngineRef.current?.setSocketEmit?.(emit);
  }, [emit]);

  useEffect(() => {
    editorStoreRef.current?.setIsDraftEnabled(history.isDraftEnabled);
  }, [history.isDraftEnabled]);

  useEffect(() => {
    editorStoreRef.current?.setIsShowingContentOnly(isShowingContentOnly);
  }, [isShowingContentOnly]);

  useEffect(() => {
    dataStoreRef.current?.setModels?.(models);

    rendererEngineRef.current?.setModels?.(models);
  }, [models]);

  useEffect(() => {
    dataStoreRef.current?.setPageData?.(pageData);

    rendererEngineRef.current?.setPageData?.(pageData);
  }, [pageData]);

  useEffect(() => {
    dataStoreRef.current?.setPageSchema?.(pageSchema);

    editorStoreRef.current?.setPageSchema?.(pageSchema);
  }, [pageSchema]);

  useEffect(() => {
    rendererEngineRef.current?.setPlatformUser?.(platformUserData);
  }, [platformUserData]);

  useEffect(() => {
    dataStoreRef.current?.setRelationIndexes?.(relationIndexes);

    rendererEngineRef.current?.setRelationIndexes?.(relationIndexes);
  }, [relationIndexes]);

  useEffect(() => {
    dataStoreRef.current?.setResolveUrl?.(resolveUrl);
  }, [resolveUrl]);

  useEffect(() => {
    editorStoreRef.current?.setSelectedId(selectedId);
  }, [selectedId]);

  useEffect(() => {
    editorStoreRef.current?.setSetContextMenu(setContextMenu);
  }, [setContextMenu]);

  useEffect(() => {
    editorStoreRef.current?.setSetDragState(setDragState);
  }, [setDragState]);

  useEffect(() => {
    dataStoreRef.current?.setSetIntegrationDataMap?.(setIntegrationDataMap);
  }, [setIntegrationDataMap]);

  useEffect(() => {
    editorStoreRef.current?.setSetSelectedId(setSelectedId);
  }, [setSelectedId]);

  useEffect(() => {
    rendererEngineRef.current?.setSignIn?.(signIn);
  }, [signIn]);

  useEffect(() => {
    rendererEngineRef.current?.setSignOut?.(signOut);
  }, [signOut]);

  useEffect(() => {
    rendererEngineRef.current?.setSignUp?.(signUp);
  }, [signUp]);

  useEffect(() => {
    rendererEngineRef.current?.setState?.(state);
  }, [state]);

  useEffect(() => {
    rendererEngineRef.current?.setSocketStatus?.(status);
  }, [status]);

  useEffect(() => {
    rendererEngineRef.current?.setUser?.(userData);
  }, [userData]);

  useEffect(() => {
    rendererEngineRef.current?.setViewport?.(viewport);
  }, [viewport]);

  useEffect(() => {
    rendererEngineRef.current?.setWebsite?.(websiteData);
  }, [websiteData]);

  return (
    <WebPageBuilderPageSchemaContext.Provider value={pageSchemaValue}>
      <WebPageBuilderActionsContext.Provider value={actions}>
        <WebPageBuilderRuntimeContext.Provider value={runtime}>
          <WebPageBuilderDataContext.Provider value={data}>
            <WebPageBuilderUIContext.Provider value={ui}>
              <WebPageBuilderPageStateContext.Provider value={pageState}>
                <WebPageBuilderRendererContext value={rendererValue}>{children}</WebPageBuilderRendererContext>
              </WebPageBuilderPageStateContext.Provider>
            </WebPageBuilderUIContext.Provider>
          </WebPageBuilderDataContext.Provider>
        </WebPageBuilderRuntimeContext.Provider>
      </WebPageBuilderActionsContext.Provider>
    </WebPageBuilderPageSchemaContext.Provider>
  );
}

function createDataStore(isShowingContentOnly, models, page, pageData, pageSchema, relationIndexes, resolveUrl, setIntegrationDataMap) {
  const context = {
    isShowingContentOnly,
    models,
    page,
    pageData,
    pageSchema,
    relationIndexes,
    resolveUrl,
    setIntegrationDataMap,
  };

  function setModels(models) {
    context.models = models;
  }

  function setPage(page) {
    context.page = page;
  }

  function setPageData(pageData) {
    context.pageData = pageData;
  }

  function setPageSchema(pageSchema) {
    context.pageSchema = pageSchema;
  }

  function setRelationIndexes(relationIndexes) {
    context.relationIndexes = relationIndexes;
  }

  function setResolveUrl(resolveUrl) {
    context.resolveUrl = resolveUrl;
  }

  function setSetIntegrationDataMap(setIntegrationDataMap) {
    context.setIntegrationDataMap = setIntegrationDataMap;
  }

  return {
    context,
    setModels,
    setPage,
    setPageData,
    setPageSchema,
    setRelationIndexes,
    setResolveUrl,
    setSetIntegrationDataMap,
  };
}

function createEditorStore(activeDropZoneRef, addComponent, addComponentFromComponentTemplate, createComponent, dragState, isDraftEnabled, isShowingContentOnly, moveComponent, page, pageSchema, selectedId, setContextMenu, setDragStateFunction, setSelectedIdFunction) {
  const context = {
    activeDropZoneRef,
    addComponent,
    addComponentFromComponentTemplate,
    createComponent,
    dragState,
    isDraftEnabled,
    isShowingContentOnly,
    moveComponent,
    page,
    pageSchema,
    selectedId,
    setContextMenu,
    setDragState: setDragStateFunction,
    setSelectedId: setSelectedIdFunction,
  };

  function setActiveDropZoneRef(activeDropZoneRef) {
    context.activeDropZoneRef = activeDropZoneRef;
  }

  function setAddComponent(addComponent) {
    context.addComponent = addComponent;
  }

  function setAddComponentFromComponentTemplate(addComponentFromComponentTemplate) {
    context.addComponentFromComponentTemplate = addComponentFromComponentTemplate;
  }

  function setCreateComponent(createComponent) {
    context.createComponent = createComponent;
  }

  function setDragState(dragState) {
    context.dragState = dragState;
  }

  function setIsDraftEnabled(isDraftEnabled) {
    context.isDraftEnabled = isDraftEnabled;
  }

  function setIsShowingContentOnly(isShowingContentOnly) {
    context.isShowingContentOnly = isShowingContentOnly;
  }

  function setMoveComponent(moveComponent) {
    context.moveComponent = moveComponent;
  }

  function setPage(page) {
    context.page = page;
  }

  function setPageSchema(pageSchema) {
    context.pageSchema = pageSchema;
  }

  function setSelectedId(selectedId) {
    context.selectedId = selectedId;
  }

  function setSetContextMenu(setContextMenu) {
    context.setContextMenu = setContextMenu;
  }

  function setSetDragState(setDragState) {
    context.setDragState = setDragState;
  }

  function setSetSelectedId(setSelectedId) {
    context.setSelectedId = setSelectedId;
  }

  return {
    context,
    setActiveDropZoneRef,
    setAddComponent,
    setAddComponentFromComponentTemplate,
    setCreateComponent,
    setDragState,
    setIsDraftEnabled,
    setIsShowingContentOnly,
    setMoveComponent,
    setPage,
    setPageSchema,
    setSelectedId,
    setSetContextMenu,
    setSetDragState,
    setSetSelectedId,
  };
}
