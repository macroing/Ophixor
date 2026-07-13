// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useEffect, useRef } from "react";

import ComponentRenderer from "./ComponentRenderer";
import { DataModelProvider } from "./DataModelProvider";
import { useWebPageBuilderRenderer } from "../../context/useWebPageBuilder";

export default function PageViewer(props) {
  const isMountedRef = useRef(false);

  const { dataStore } = useWebPageBuilderRenderer();

  const page = dataStore?.context?.page;
  const pageData = dataStore?.context?.pageData;

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return (
    <DataModelProvider value={pageData}>
      <ComponentRenderer component={page} index={0} isMountedRef={isMountedRef} parentId={page?.id || "page"} slotName="body" />
    </DataModelProvider>
  );
}
