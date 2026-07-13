// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { useContext } from "react";

import { WebPageBuilderActionsContext, WebPageBuilderContext, WebPageBuilderDataContext, WebPageBuilderPageSchemaContext, WebPageBuilderPageStateContext, WebPageBuilderRendererContext, WebPageBuilderRuntimeContext, WebPageBuilderUIContext } from "./WebPageBuilderContext";

export function useWebPageBuilder() {
  return useContext(WebPageBuilderContext);
}

export function useWebPageBuilderActions() {
  return useContext(WebPageBuilderActionsContext);
}

export function useWebPageBuilderData() {
  return useContext(WebPageBuilderDataContext);
}

export function useWebPageBuilderPageSchema() {
  return useContext(WebPageBuilderPageSchemaContext);
}

export function useWebPageBuilderPageState() {
  return useContext(WebPageBuilderPageStateContext);
}

export function useWebPageBuilderRenderer() {
  return useContext(WebPageBuilderRendererContext);
}

export function useWebPageBuilderRuntime() {
  return useContext(WebPageBuilderRuntimeContext);
}

export function useWebPageBuilderUI() {
  return useContext(WebPageBuilderUIContext);
}
