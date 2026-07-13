// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useSyncExternalStore } from "react";

import Alert from "../alert/Alert";
import Badge from "../badge/Badge";
import Button from "../button/Button";
import Canvas from "../canvas/Canvas";
import Card from "../card/Card";
import Checkbox from "../checkbox/Checkbox";
import ComponentWrapper from "./ComponentWrapper";
import ConsentPlaceholder from "../runtime/privacy/ConsentPlaceholder";
import Dialog from "../dialog/Dialog";
import Divider from "../divider/Divider";
import Element from "../element/Element";
import Footer from "../footer/Footer";
import Form from "../form/Form";
import Grid from "../grid/Grid";
import Heading from "../heading/Heading";
import Image from "../image/Image";
import Input from "../input/Input";
import Label from "../label/Label";
import Link from "../link/Link";
import List from "../list/List";
import ListItem from "../list-item/ListItem";
import Map from "../map/Map";
import MenuBar from "../menu-bar/MenuBar";
import Page from "../page/Page";
import RadioGroup from "../radio-group/RadioGroup";
import RichText from "../rich-text/RichText";
import Section from "../section/Section";
import Select from "../select/Select";
import SideBar from "../side-bar/SideBar";
import Spacer from "../spacer/Spacer";
import Spinner from "../spinner/Spinner";
import Switch from "../switch/Switch";
import Table from "../table/Table";
import TableData from "../table-data/TableData";
import TableHeader from "../table-header/TableHeader";
import TableRow from "../table-row/TableRow";
import Text from "../text/Text";
import TextArea from "../text-area/TextArea";
import { DataModelProvider } from "./DataModelProvider";
import { generateId } from "../../page/identity/generateId";
import { useDataModel } from "./useDataModel";
import { useIntegration } from "../runtime/integration/useIntegration";
import { useWebPageBuilderRenderer } from "../../context/useWebPageBuilder";
import { cleanResolvedProps, retrieveViewProps } from "./editor-helpers";
import { useConsent } from "../runtime/privacy/useConsent";
import { useSocketActions } from "../runtime/socket/useSocketActions";

const EMPTY_OBJECT = {};

const ComponentInstanceRenderer = memo(({ component, componentSchema, index, isEmpty = false, parentId, props, slotName }) => {
  const parentModel = useDataModel();

  const { actionEngine, dataStore, expressionEngine, rendererEngine } = useWebPageBuilderRenderer();

  const resolveUrl = dataStore.context.resolveUrl;

  const Component = componentRegistry[component.type];

  const broadcastAction = component.type === "Page" ? props.onBroadcast : null;
  const emitAction = component.type === "Page" ? props.onEmit : null;

  useSocketActions(broadcastAction, emitAction, actionEngine);

  const componentId = component?.id;
  const componentInstanceId = useMemo(() => generateId("component"), []);

  const propsRef = useRef(props);
  const scopeRef = useRef(parentModel);

  const initialSnapshot = useMemo(() => {
    return rendererEngine.createInitialSnapshot(rendererEngine.propsSnapshotDataFactory(componentId, propsRef), rendererEngine.scopeFactory(scopeRef), componentSchema);
  }, [componentId, componentSchema, rendererEngine]);

  const resolvedProps = useSyncExternalStore(
    useCallback(
      (callback) => {
        rendererEngine.registerComponent(componentId, componentInstanceId, componentSchema, rendererEngine.scopeFactory(scopeRef), rendererEngine.propsSnapshotDataFactory(componentId, propsRef));

        const unsubscribe = rendererEngine.subscribe(componentId, componentInstanceId, callback);

        return () => {
          if (typeof unsubscribe === "function") {
            unsubscribe();
          }

          rendererEngine.unregisterComponent(componentId, componentInstanceId);
        };
      },
      [componentId, componentInstanceId, componentSchema, rendererEngine],
    ),
    useCallback(() => {
      let snapshot = rendererEngine.getSnapshot(componentId, componentInstanceId);

      if (snapshot === null) {
        snapshot = initialSnapshot;
      }

      return snapshot;
    }, [componentId, componentInstanceId, initialSnapshot, rendererEngine]),
    useCallback(() => {
      return initialSnapshot;
    }, [initialSnapshot]),
  );

  useEffect(() => {
    propsRef.current = props;
  }, [props]);

  useEffect(() => {
    scopeRef.current = parentModel;
  }, [parentModel]);

  const reactiveProps = useMemo(() => {
    const enhancedProps = enhanceWithInteractions(component, componentSchema, resolvedProps ?? {}, actionEngine, parentModel);
    const retrievedViewProps = retrieveViewProps(enhancedProps, expressionEngine?.context?.viewport);
    const cleanedProps = cleanResolvedProps(retrievedViewProps);

    return cleanedProps;
  }, [actionEngine, component, componentSchema, expressionEngine, parentModel, resolvedProps]);

  const slotProps = useMemo(() => renderSlots(component), [component]);

  const { hasConsent } = useConsent();

  const requiredConsent = props?.consent;

  if (!Component) {
    return null;
  }

  if (requiredConsent && !hasConsent(requiredConsent)) {
    return (
      <ComponentWrapper component={component} index={index} parentId={parentId} slotName={slotName}>
        {(editorProps) => (editorProps?.editor?.isShowingContentOnly && isEmpty ? null : <ConsentPlaceholder component={component} type={requiredConsent} />)}
      </ComponentWrapper>
    );
  }

  return (
    <ComponentWrapper component={component} index={index} parentId={parentId} slotName={slotName}>
      {(editorProps) => (editorProps?.editor?.isShowingContentOnly && isEmpty ? null : <Component componentId={component.id} editor={editorProps?.editor} resolveUrl={resolveUrl} {...reactiveProps} {...slotProps} />)}
    </ComponentWrapper>
  );
});

export default function ComponentRenderer({ component, index, isDataSourceTurnedOff = false, isEmpty = false, parentId, resolvedProps, slotName }) {
  const { dataStore } = useWebPageBuilderRenderer();

  const pageSchema = dataStore.context.pageSchema;

  const Component = componentRegistry[component.type];

  const componentSchema = component.type === "Page" ? pageSchema : pageSchema?.componentSchemas[component.type];

  const parentModel = useDataModel();

  const props = resolvedProps ?? component.props;

  if (!Component) {
    return null;
  }

  if (component.dataSource?.type === "integration" && !isDataSourceTurnedOff) {
    return <IntegrationRenderer component={component} componentSchema={componentSchema} index={index} parentId={parentId} parentModel={parentModel} props={props} slotName={slotName} />;
  }

  if (component.dataSource && !isDataSourceTurnedOff) {
    return <DataSourceRenderer component={component} componentSchema={componentSchema} index={index} parentId={parentId} props={props} slotName={slotName} />;
  }

  return <ComponentInstanceRenderer component={component} componentSchema={componentSchema} index={index} isEmpty={isEmpty} parentId={parentId} props={props} slotName={slotName} />;
}

const DataSourceItemRenderer = memo(({ component, componentSchema, index, isDataSourceTurnedOff, isEmpty, parentId, props, scope, slotName }) => {
  const { rendererEngine } = useWebPageBuilderRenderer();

  const componentId = component?.id;
  const componentInstanceId = useMemo(() => generateId("component"), []);

  const propsRef = useRef(props);
  const scopeRef = useRef(scope);

  const initialSnapshot = useMemo(() => {
    return rendererEngine.createInitialSnapshot(rendererEngine.propsSnapshotDataFactory(componentId, propsRef), rendererEngine.scopeFactory(scopeRef), componentSchema);
  }, [componentId, componentSchema, rendererEngine]);

  const reactiveProps = useSyncExternalStore(
    useCallback(
      (callback) => {
        rendererEngine.registerComponent(componentId, componentInstanceId, componentSchema, rendererEngine.scopeFactory(scopeRef), rendererEngine.propsSnapshotDataFactory(componentId, propsRef));

        const unsubscribe = rendererEngine.subscribe(componentId, componentInstanceId, callback);

        return () => {
          if (typeof unsubscribe === "function") {
            unsubscribe();
          }

          rendererEngine.unregisterComponent(componentId, componentInstanceId);
        };
      },
      [componentId, componentInstanceId, componentSchema, rendererEngine],
    ),
    useCallback(() => {
      let snapshot = rendererEngine.getSnapshot(componentId, componentInstanceId);

      if (snapshot === null) {
        snapshot = initialSnapshot;
      }

      return snapshot;
    }, [componentId, componentInstanceId, initialSnapshot, rendererEngine]),
    useCallback(() => {
      return initialSnapshot;
    }, [initialSnapshot]),
  );

  useEffect(() => {
    propsRef.current = props;
  }, [props]);

  useEffect(() => {
    scopeRef.current = scope;
  }, [scope]);

  return (
    <DataModelProvider value={scope}>
      <ComponentRenderer component={component} index={index} isDataSourceTurnedOff={isDataSourceTurnedOff} isEmpty={isEmpty} parentId={parentId} resolvedProps={reactiveProps} slotName={slotName} />
    </DataModelProvider>
  );
});

function DataSourceRenderer({ component, componentSchema, index, parentId, props, slotName }) {
  const parentModel = useDataModel();

  const { rendererEngine } = useWebPageBuilderRenderer();

  const componentId = component?.id;
  const componentInstanceId = useMemo(() => generateId("component"), []);

  const scopeRef = useRef(parentModel);

  const initialSnapshot = useMemo(() => {
    return rendererEngine.createInitialSnapshot(rendererEngine.dataSourceSnapshotDataFactory(componentId), rendererEngine.scopeFactory(scopeRef), componentSchema);
  }, [componentId, componentSchema, rendererEngine]);

  const reactiveScope = useSyncExternalStore(
    useCallback(
      (callback) => {
        rendererEngine.registerComponent(componentId, componentInstanceId, componentSchema, rendererEngine.scopeFactory(scopeRef), rendererEngine.dataSourceSnapshotDataFactory(componentId));

        const unsubscribe = rendererEngine.subscribe(componentId, componentInstanceId, callback);

        return () => {
          if (typeof unsubscribe === "function") {
            unsubscribe();
          }

          rendererEngine.unregisterComponent(componentId, componentInstanceId);
        };
      },
      [componentId, componentInstanceId, componentSchema, rendererEngine],
    ),
    useCallback(() => {
      let snapshot = rendererEngine.getSnapshot(componentId, componentInstanceId);

      if (snapshot === null) {
        snapshot = initialSnapshot;
      }

      return snapshot;
    }, [componentId, componentInstanceId, initialSnapshot, rendererEngine]),
    useCallback(() => {
      return initialSnapshot;
    }, [initialSnapshot]),
  );

  useEffect(() => {
    scopeRef.current = parentModel;
  }, [parentModel]);

  if (Array.isArray(reactiveScope)) {
    if (reactiveScope.length === 0) {
      return <DataSourceItemRenderer component={component} componentSchema={componentSchema} index={index} isDataSourceTurnedOff={true} isEmpty={true} parentId={parentId} props={props} scope={EMPTY_OBJECT} slotName={slotName} />;
    }

    return reactiveScope.map((item, itemIndex) => <DataSourceItemRenderer component={component} componentSchema={componentSchema} index={index} isDataSourceTurnedOff={true} isEmpty={false} key={component.id + "-" + itemIndex} parentId={parentId} props={props} scope={item} slotName={slotName} />);
  }

  if (reactiveScope !== null && typeof reactiveScope !== "object") {
    return <DataSourceItemRenderer component={component} componentSchema={componentSchema} index={index} isDataSourceTurnedOff={true} isEmpty={false} parentId={parentId} props={props} scope={reactiveScope} slotName={slotName} />;
  }

  const scope = reactiveScope ?? EMPTY_OBJECT;

  const isEmpty = scope === EMPTY_OBJECT || !scope || (typeof scope === "object" && Object.keys(scope).length === 0);

  return <DataSourceItemRenderer component={component} componentSchema={componentSchema} index={index} isDataSourceTurnedOff={true} isEmpty={isEmpty} parentId={parentId} props={props} scope={scope} slotName={slotName} />;
}

const IntegrationItemRenderer = memo(({ component, componentSchema, index, isDataSourceTurnedOff, isEmpty, parentId, props, scope, slotName }) => {
  const { rendererEngine } = useWebPageBuilderRenderer();

  const componentId = component?.id;
  const componentInstanceId = useMemo(() => generateId("component"), []);

  const propsRef = useRef(props);
  const scopeRef = useRef(scope);

  const initialSnapshot = useMemo(() => {
    return rendererEngine.createInitialSnapshot(rendererEngine.propsSnapshotDataFactory(componentId, propsRef), rendererEngine.scopeFactory(scopeRef), componentSchema);
  }, [componentId, componentSchema, rendererEngine]);

  const reactiveProps = useSyncExternalStore(
    useCallback(
      (callback) => {
        rendererEngine.registerComponent(componentId, componentInstanceId, componentSchema, rendererEngine.scopeFactory(scopeRef), rendererEngine.propsSnapshotDataFactory(componentId, propsRef));

        const unsubscribe = rendererEngine.subscribe(componentId, componentInstanceId, callback);

        return () => {
          if (typeof unsubscribe === "function") {
            unsubscribe();
          }

          rendererEngine.unregisterComponent(componentId, componentInstanceId);
        };
      },
      [componentId, componentInstanceId, componentSchema, rendererEngine],
    ),
    useCallback(() => {
      let snapshot = rendererEngine.getSnapshot(componentId, componentInstanceId);

      if (snapshot === null) {
        snapshot = initialSnapshot;
      }

      return snapshot;
    }, [componentId, componentInstanceId, initialSnapshot, rendererEngine]),
    useCallback(() => {
      return initialSnapshot;
    }, [initialSnapshot]),
  );

  useEffect(() => {
    propsRef.current = props;
  }, [props]);

  useEffect(() => {
    scopeRef.current = scope;
  }, [scope]);

  return (
    <DataModelProvider value={scope}>
      <ComponentRenderer component={component} index={index} isDataSourceTurnedOff={isDataSourceTurnedOff} isEmpty={isEmpty} parentId={parentId} resolvedProps={reactiveProps} slotName={slotName} />
    </DataModelProvider>
  );
});

function IntegrationRenderer({ component, componentSchema, index, isMountedRef, parentId, parentModel, props, slotName }) {
  const { dataStore, rendererEngine } = useWebPageBuilderRenderer();

  const setIntegrationDataMap = dataStore.context.setIntegrationDataMap;

  const resolveExpression = (expr) => {
    const resolved = rendererEngine?.resolveBindings({ value: expr }, parentModel, componentSchema)?.value;

    if (resolved && typeof resolved === "object" && "type" in resolved) {
      if (resolved.type === "literal") {
        return resolved.value;
      }
    }

    return resolved;
  };

  const { data, loading, error } = useIntegration(component.dataSource, resolveExpression, [component.dataSource, parentModel]);

  useLayoutEffect(() => {
    if (data) {
      setIntegrationDataMap((prev) => ({
        ...prev,
        [component.id]: data,
      }));
    }
  }, [data]);

  if (loading || error) {
    return null;
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return <IntegrationItemRenderer component={component} componentSchema={componentSchema} index={index} isDataSourceTurnedOff={true} isEmpty={true} isMountedRef={isMountedRef} parentId={parentId} props={props} scope={EMPTY_OBJECT} slotName={slotName} />;
    }

    return data.map((item, itemIndex) => <IntegrationItemRenderer component={component} componentSchema={componentSchema} index={index} isDataSourceTurnedOff={true} isEmpty={false} isMountedRef={isMountedRef} key={component.id + "-" + itemIndex} parentId={parentId} props={props} scope={item} slotName={slotName} />);
  }

  const scope = data ?? EMPTY_OBJECT;

  const isEmpty = scope === EMPTY_OBJECT || !scope || (typeof scope === "object" && Object.keys(scope).length === 0);

  return <IntegrationItemRenderer component={component} componentSchema={componentSchema} index={index} isDataSourceTurnedOff={true} isEmpty={isEmpty} isMountedRef={isMountedRef} parentId={parentId} props={props} scope={scope} slotName={slotName} />;
}

function enhanceWithInteractions(component, componentSchema, props, actionEngine, modelScope) {
  const enhanced = { ...props };

  if ("checked" in props || "checked" in componentSchema.props || "value" in props || "value" in componentSchema.props || props.onChange) {
    const original = props.onChange;

    enhanced.onChange = async (e) => {
      if ("checked" in props || "checked" in componentSchema.props) {
        const checked = e.target.checked;

        actionEngine?.context?.updateComponent?.(component.id, {
          props: { checked },
        });
      }

      if ("value" in props || "value" in componentSchema.props) {
        const value = e.target.value;

        actionEngine?.context?.updateComponent?.(component.id, {
          props: { value },
        });
      }

      if (original && typeof original === "function") {
        original(e);
      } else if (original && typeof original === "object") {
        await actionEngine?.executeAction?.(original, modelScope);
      }
    };
  }

  const eventMap = {
    onClick: { handler: "onClick" },
    onMouseDown: { handler: "onMouseDown" },
    onMouseMove: { handler: "onMouseMove" },
    onMouseUp: { handler: "onMouseUp" },
    onRender: { handler: "onRender", eventIsContext: true },
    onSubmit: { handler: "onSubmit", preventDefault: true },
    onUpdate: { handler: "onUpdate", eventIsContext: true },
  };

  Object.entries(eventMap).forEach(([propKey, config]) => {
    if (props[propKey] && typeof props[propKey] === "object") {
      enhanced[config.handler] = async (e) => {
        if (config.preventDefault) {
          e.preventDefault();
        }

        if (config.eventIsContext) {
          if (e && typeof e === "object" && !Array.isArray(e)) {
            await actionEngine?.executeAction?.(props[propKey], null, {
              ...(actionEngine?.context ?? {}),
              expressionEngine: {
                ...(actionEngine?.context?.expressionEngine ?? {}),
                context: {
                  ...(actionEngine?.context?.expressionEngine?.context ?? {}),
                  state: {
                    ...(actionEngine?.context?.expressionEngine?.context?.state ?? {}),
                    runtime: {
                      ...(actionEngine?.context?.expressionEngine?.context?.state?.runtime ?? {}),
                      ...e,
                    },
                  },
                },
              },
            });
          }
        } else {
          await actionEngine?.executeAction?.(props[propKey], modelScope);
        }
      };
    }
  });

  return enhanced;
}

function renderSlots(component) {
  const slotEntries = Object.entries(component?.slots || EMPTY_OBJECT);

  if (slotEntries.length === 0) {
    return EMPTY_OBJECT;
  }

  if (slotEntries.length === 1) {
    const [slotName, slotComponents] = slotEntries[0];

    return {
      children: (slotComponents || []).map((slotComponent, slotComponentIndex) => <ComponentRenderer component={slotComponent} index={slotComponentIndex} isEmpty={(slotComponents || []).length === 0} key={slotComponent.id} parentId={component.id} slotName={slotName} />),
    };
  }

  const namedSlots = {}; //Do not use EMPTY_OBJECT because the for loop adds to it!

  for (const [slotName, slotComponents] of slotEntries) {
    namedSlots[slotName] = (slotComponents || []).map((slotComponent, slotComponentIndex) => <ComponentRenderer component={slotComponent} index={slotComponentIndex} isEmpty={(slotComponents || []).length === 0} key={slotComponent.id} parentId={component.id} slotName={slotName} />);
  }

  return { children: { slots: namedSlots } };
}

const componentRegistry = {
  Alert,
  Badge,
  Button,
  Canvas,
  Card,
  Checkbox,
  Dialog,
  Divider,
  Element,
  Footer,
  Form,
  Grid,
  Heading,
  Image,
  Input,
  Label,
  Link,
  List,
  ListItem,
  Map,
  MenuBar,
  Page,
  RadioGroup,
  RichText,
  Section,
  Select,
  SideBar,
  Spacer,
  Spinner,
  Switch,
  Table,
  TableData,
  TableHeader,
  TableRow,
  Text,
  TextArea,
};
