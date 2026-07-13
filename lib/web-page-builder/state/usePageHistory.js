// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { useCallback, useMemo, useReducer, useState } from "react";

import { equals } from "../transform/core/equals";
import { pageHistoryReducer } from "./pageHistoryReducer";
import { useLanguage } from "@/context/language";
import { validatePage } from "../validation/validators";

export function usePageHistory(initialPage, pageSchema, isShowingContentOnly) {
  const { language } = useLanguage();

  const [validatedInitialPage] = useState(() => (initialPage ? validatePage(initialPage, pageSchema, language) : null));
  const [draftPage, setDraftPage] = useState(isShowingContentOnly ? validatedInitialPage : null);

  const [history, dispatch] = useReducer(pageHistoryReducer, {
    past: [],
    present: validatedInitialPage,
    future: [],
  });

  const page = draftPage ?? history.present;

  const draftCancel = useCallback(() => {
    setDraftPage(null);
  }, []);

  const draftSave = useCallback(() => {
    dispatch({ type: "SET_PAGE", page: draftPage });

    setDraftPage(null);
  }, [draftPage]);

  const draftStart = useCallback(() => {
    setDraftPage(structuredClone(history.present));
  }, [history.present]);

  const hasPageChanged = useMemo(() => {
    if (isShowingContentOnly) {
      return false;
    }

    return !equals(stripMetadata(page), stripMetadata(history.present));
  }, [history.present, isShowingContentOnly, page]);

  const redo = useCallback(() => {
    dispatch({ type: "REDO" });
  }, []);

  const setPage = useCallback(
    (pageOrUpdater) => {
      if (draftPage !== null) {
        setDraftPage((previousDraftPage) => (typeof pageOrUpdater === "function" ? pageOrUpdater(previousDraftPage) : pageOrUpdater));
      } else {
        dispatch(typeof pageOrUpdater === "function" ? { type: "SET_PAGE", updater: pageOrUpdater } : { type: "SET_PAGE", page: pageOrUpdater });
      }
    },
    [draftPage],
  );

  const undo = useCallback(() => {
    dispatch({ type: "UNDO" });
  }, []);

  return useMemo(
    () => ({
      hasPageChanged,
      page,
      setPage,
      undo,
      redo,
      canUndo: history.past.length > 0,
      canRedo: history.future.length > 0,
      draftStart,
      draftSave,
      draftCancel,
      isDraftEnabled: draftPage !== null,
    }),
    [draftCancel, draftPage, draftSave, draftStart, hasPageChanged, history.future.length, history.past.length, page, redo, setPage, undo],
  );
}

function stripMetadata(page) {
  const { metadata, ...rest } = page;

  return rest;
}
