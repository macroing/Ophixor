// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { equals } from "@/lib/web-page-builder/transform/core/equals";
import { getValueByPath } from "../expression/path";

export function createRendererEngine(actionEngine, expressionEngine) {
  const EMPTY_OBJECT = {};

  const components = new Map();

  const componentDependencies = new Map();

  const componentIndexRebuildingRules = [];

  const dependencyIndex = new Map();

  function addComponentIndexRebuildingRule(componentIndexRebuildingRule) {
    try {
      componentIndexRebuildingRules.push(componentIndexRebuildingRule);
    } catch (error) {
      console.log(error.message);
    }
  }

  function createInitialSnapshot(snapshotDataFactory, scopeFactory, componentSchema) {
    try {
      if (typeof snapshotDataFactory === "function" && typeof scopeFactory === "function" && componentSchema !== null && typeof componentSchema === "object" && !Array.isArray(componentSchema)) {
        const snapshotData = snapshotDataFactory();

        if (snapshotData !== null && typeof snapshotData === "object" && !Array.isArray(snapshotData)) {
          const scope = scopeFactory()?.scope;

          if (snapshotData.type === "DataSourceSnapshotDataFactory") {
            const resolvedScope = resolveDataSource(snapshotData.dataSource, scope);

            return resolvedScope;
          } else if (snapshotData.type === "PropsSnapshotDataFactory" && snapshotData.props && typeof snapshotData.props === "object" && !Array.isArray(snapshotData.props)) {
            const resolvedProps = resolveBindings(snapshotData.props, scope, componentSchema);

            return resolvedProps;
          } else {
            return null;
          }
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.log(error.message);

      return null;
    }
  }

  function createSnapshot(snapshotDataFactory, scopeFactory, componentId, componentInstanceId, componentSchema) {
    try {
      if (typeof snapshotDataFactory === "function" && typeof scopeFactory === "function" && typeof componentId === "string" && typeof componentInstanceId === "string" && componentSchema !== null && typeof componentSchema === "object" && !Array.isArray(componentSchema)) {
        const snapshotData = snapshotDataFactory();

        if (snapshotData !== null && typeof snapshotData === "object" && !Array.isArray(snapshotData)) {
          const scope = scopeFactory()?.scope;

          if (snapshotData.type === "DataSourceSnapshotDataFactory") {
            const oldComponentDependencies = componentDependencies.get(`${componentId}.${componentInstanceId}`);
            const newComponentDependencies = {};

            function dependencyCollector(type, value) {
              if (type === "expression") {
                const dependencies = expressionEngine.collectDependencies(value);

                dependencies.forEach((dependency) => (newComponentDependencies[dependency] = true));
              } else if (type === "model") {
                newComponentDependencies["models"] = true;
                newComponentDependencies["pageData"] = true;
              }
            }

            const resolvedScope = resolveDataSource(snapshotData.dataSource, scope, dependencyCollector);

            if (oldComponentDependencies === undefined) {
              for (const dependency of Object.keys(newComponentDependencies)) {
                registerDependencyFor(dependency, componentId, componentInstanceId);
              }

              componentDependencies.set(`${componentId}.${componentInstanceId}`, newComponentDependencies);
            } else {
              for (const oldDependency of Object.keys(oldComponentDependencies)) {
                if (!Object.hasOwn(newComponentDependencies, oldDependency)) {
                  unregisterDependencyFor(oldDependency, componentId, componentInstanceId);
                }
              }

              for (const newDependency of Object.keys(newComponentDependencies)) {
                if (!Object.hasOwn(oldComponentDependencies, newDependency)) {
                  registerDependencyFor(newDependency, componentId, componentInstanceId);
                }
              }

              componentDependencies.set(`${componentId}.${componentInstanceId}`, newComponentDependencies);
            }

            return resolvedScope;
          } else if (snapshotData.type === "PropsSnapshotDataFactory" && snapshotData.props && typeof snapshotData.props === "object" && !Array.isArray(snapshotData.props)) {
            const oldComponentDependencies = componentDependencies.get(`${componentId}.${componentInstanceId}`);
            const newComponentDependencies = {};

            function dependencyCollector(type, value) {
              if (type === "expression") {
                const dependencies = expressionEngine.collectDependencies(value);

                dependencies.forEach((dependency) => (newComponentDependencies[dependency] = true));
              } else if (type === "model") {
                newComponentDependencies["models"] = true;
                newComponentDependencies["pageData"] = true;
              } else if (type === "self") {
                newComponentDependencies[`${componentId}.${value}`] = true;
              } else if (type === "self-viewport") {
                newComponentDependencies["viewport.name"] = true;
              }
            }

            const resolvedProps = resolveBindings(snapshotData.props, scope, componentSchema, dependencyCollector, componentId, componentInstanceId);

            if (oldComponentDependencies === undefined) {
              for (const dependency of Object.keys(newComponentDependencies)) {
                registerDependencyFor(dependency, componentId, componentInstanceId);
              }

              componentDependencies.set(`${componentId}.${componentInstanceId}`, newComponentDependencies);
            } else {
              for (const oldDependency of Object.keys(oldComponentDependencies)) {
                if (!Object.hasOwn(newComponentDependencies, oldDependency)) {
                  unregisterDependencyFor(oldDependency, componentId, componentInstanceId);
                }
              }

              for (const newDependency of Object.keys(newComponentDependencies)) {
                if (!Object.hasOwn(oldComponentDependencies, newDependency)) {
                  registerDependencyFor(newDependency, componentId, componentInstanceId);
                }
              }

              componentDependencies.set(`${componentId}.${componentInstanceId}`, newComponentDependencies);
            }

            return resolvedProps;
          } else {
            return null;
          }
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.log(error.message);

      return null;
    }
  }

  function dataSourceSnapshotDataFactory(componentId) {
    return () => ({
      type: "DataSourceSnapshotDataFactory",
      dataSource: expressionEngine.context.componentIndex[componentId].dataSource,
    });
  }

  function getComponent(componentId) {
    try {
      if (typeof componentId === "string") {
        const component = components.get(componentId);

        if (component !== null && typeof component === "object" && !Array.isArray(component)) {
          return component;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.log(error.message);

      return null;
    }
  }

  function getComponentInstance(componentId, componentInstanceId) {
    try {
      if (typeof componentId === "string" && typeof componentInstanceId === "string") {
        const component = components.get(componentId);

        if (component !== null && typeof component === "object" && !Array.isArray(component)) {
          const componentInstance = component.componentInstances[componentInstanceId];

          if (componentInstance !== null && typeof componentInstance === "object" && !Array.isArray(componentInstance)) {
            return componentInstance;
          } else {
            return null;
          }
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.log(error.message);

      return null;
    }
  }

  function getSnapshot(componentId, componentInstanceId) {
    try {
      if (typeof componentId === "string" && typeof componentInstanceId === "string") {
        const component = components.get(componentId);

        if (component !== null && typeof component === "object" && !Array.isArray(component)) {
          const componentInstance = component.componentInstances[componentInstanceId];

          if (componentInstance !== null && typeof componentInstance === "object" && !Array.isArray(componentInstance)) {
            return componentInstance.snapshot;
          } else {
            return null;
          }
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.log(error.message);

      return null;
    }
  }

  function propsSnapshotDataFactory(componentId, propsRef = null) {
    return () => ({
      type: "PropsSnapshotDataFactory",
      props: expressionEngine.context.componentIndex[componentId]?.props ?? propsRef?.current,
    });
  }

  function registerComponent(componentId, componentInstanceId, componentSchema, scopeFactory, snapshotDataFactory) {
    try {
      if (typeof componentId === "string" && typeof componentInstanceId === "string" && componentSchema !== null && typeof componentSchema === "object" && !Array.isArray(componentSchema) && typeof scopeFactory === "function" && typeof snapshotDataFactory === "function") {
        let component = components.get(componentId);

        if (component !== null && typeof component === "object" && !Array.isArray(component)) {
          if (component.componentInstances === undefined || !(component.componentInstances !== null && typeof component.componentInstances === "object" && !Array.isArray(component.componentInstances))) {
            component.componentInstances = {};
          }

          if (component.componentSchema === undefined || !(component.componentSchema !== null && typeof component.componentSchema === "object" && !Array.isArray(component.componentSchema))) {
            component.componentSchema = componentSchema;
          }

          if (Object.hasOwn(component.componentInstances, componentInstanceId)) {
            const componentInstance = component.componentInstances[componentInstanceId];

            componentInstance.componentInstanceId = componentInstanceId;
            componentInstance.listeners = new Set();
            componentInstance.onUpdate = null;
            componentInstance.scopeFactory = scopeFactory;
            componentInstance.snapshot = null;
            componentInstance.snapshotDataFactory = snapshotDataFactory;

            componentInstance.snapshot = createSnapshot(snapshotDataFactory, scopeFactory, componentId, componentInstanceId, component.componentSchema);

            componentInstance.onUpdate = () => {
              const snapshotDataFactory = componentInstance.snapshotDataFactory;
              const scopeFactory = componentInstance.scopeFactory;
              const snapshot = createSnapshot(snapshotDataFactory, scopeFactory, componentId, componentInstanceId, component.componentSchema);

              componentInstance.snapshot = snapshot;

              componentInstance.listeners.forEach((listener) => listener());
            };
          } else {
            const componentInstance = {
              componentInstanceId,
              listeners: new Set(),
              onUpdate: null,
              scopeFactory,
              snapshot: null,
              snapshotDataFactory,
            };

            component.componentInstances[componentInstanceId] = componentInstance;

            componentInstance.snapshot = createSnapshot(snapshotDataFactory, scopeFactory, componentId, componentInstanceId, component.componentSchema);

            componentInstance.onUpdate = () => {
              const snapshotDataFactory = componentInstance.snapshotDataFactory;
              const scopeFactory = componentInstance.scopeFactory;
              const snapshot = createSnapshot(snapshotDataFactory, scopeFactory, componentId, componentInstanceId, component.componentSchema);

              componentInstance.snapshot = snapshot;

              componentInstance.listeners.forEach((listener) => listener());
            };
          }
        } else {
          const componentInstance = {
            componentInstanceId,
            listeners: new Set(),
            onUpdate: null,
            scopeFactory,
            snapshot: null,
            snapshotDataFactory,
          };

          componentInstance.onUpdate = () => {
            const snapshotDataFactory = componentInstance.snapshotDataFactory;
            const scopeFactory = componentInstance.scopeFactory;
            const snapshot = createSnapshot(snapshotDataFactory, scopeFactory, componentId, componentInstanceId, componentSchema);

            componentInstance.snapshot = snapshot;

            componentInstance.listeners.forEach((listener) => listener());
          };

          component = {
            componentId,
            componentInstances: {
              [componentInstanceId]: componentInstance,
            },
            componentSchema,
          };

          components.set(componentId, component);

          componentInstance.snapshot = createSnapshot(snapshotDataFactory, scopeFactory, componentId, componentInstanceId, componentSchema);
        }

        return component;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error.message);

      return null;
    }
  }

  function resolveBindings(props, scope, schema, dependencyCollector = null, componentId = "", componentInstanceId = "", depth = 0) {
    try {
      if (!containsBinding(props)) {
        if (typeof dependencyCollector === "function") {
          const resolved = {};

          const name = expressionEngine?.context?.viewport?.name || "desktop";

          for (const key in depth === 0 ? schema.props : props) {
            let currentValue = depth === 0 ? (props[key] ?? schema.props[key].defaultValue) : props[key];

            if (currentValue?.[name]) {
              currentValue = currentValue[name];
            }

            dependencyCollector("self", key);

            const propSchema = schema?.props?.[key];

            if (depth === 0 && propSchema?.cssProperty && typeof dependencyCollector === "function") {
              dependencyCollector("self-viewport", key);
            }

            if (key in props) {
              resolved[key] = currentValue;
            }
          }

          if (equals(props, resolved)) {
            return props;
          }

          return resolved;
        }

        return props;
      }

      const resolved = {}; //Do not use EMPTY_OBJECT because the for loop adds to it!

      const name = expressionEngine?.context?.viewport?.name || "desktop";

      const isSchemaPropsUsed = depth === 0 && typeof dependencyCollector === "function";

      for (const key in isSchemaPropsUsed ? schema.props : props) {
        let currentValue = isSchemaPropsUsed ? (props[key] ?? schema.props[key].defaultValue) : props[key];

        if (currentValue?.[name]) {
          currentValue = currentValue[name];
        }

        if (isSchemaPropsUsed) {
          dependencyCollector("self", key);
        }

        const propSchema = schema?.props?.[key];
        const propSchemaType = propSchema?.type;

        if (key in props && propSchemaType === "action") {
          resolved[key] = currentValue;

          continue;
        }

        if (isSchemaPropsUsed && propSchema?.cssProperty) {
          dependencyCollector("self-viewport", key);
        }

        if (currentValue?.type === "expression") {
          const applyFinal = (result) => {
            const casted = propSchemaType ? expressionEngine?.castFinal?.(result, propSchemaType) : result;

            return casted !== undefined ? casted : (currentValue.fallback ?? "");
          };

          if (typeof dependencyCollector === "function") {
            dependencyCollector("expression", currentValue.expression);
          }

          const value = expressionEngine?.executeExpression(currentValue.expression, scope, expressionEngine?.context);

          resolved[key] = applyFinal(value);

          continue;
        }

        if (currentValue?.type === "model") {
          if (typeof dependencyCollector === "function") {
            dependencyCollector("model", currentValue);
          }

          if (typeof currentValue.path === "string") {
            const resolvedValue = getValueByPath(scope, currentValue.path);

            resolved[key] = resolvedValue !== undefined ? resolvedValue : (currentValue.fallback ?? "");
          } else {
            resolved[key] = currentValue.fallback ?? "";
          }

          continue;
        }

        if (key in props && Array.isArray(currentValue)) {
          resolved[key] = currentValue.map((item) => (typeof item === "object" ? resolveBindings(item, scope, schema, dependencyCollector, componentId, componentInstanceId, depth + 1) : item));

          continue;
        }

        if (key in props && currentValue && typeof currentValue === "object") {
          resolved[key] = resolveBindings(currentValue, scope, schema, dependencyCollector, componentId, componentInstanceId, depth + 1);

          continue;
        }

        if (key in props) {
          resolved[key] = currentValue;
        }
      }

      if (equals(props, resolved)) {
        return props;
      }

      return resolved;
    } catch (error) {
      console.log(error.message);

      return props;
    }
  }

  function scopeFactory(scopeRef) {
    return () => ({
      type: "ScopeFactory",
      scope: scopeRef?.current,
    });
  }

  function setComponentIndex(componentIndex) {
    try {
      expressionEngine.setComponentIndex(componentIndex);

      const keys = new Set();

      for (let i = 0; i < componentIndexRebuildingRules.length; i++) {
        const componentIndexRebuildingRule = componentIndexRebuildingRules[i];

        const type = componentIndexRebuildingRule.type;

        if (type === "addComponent") {
          keys.add(componentIndexRebuildingRule.parentId);
          keys.add(componentIndexRebuildingRule.componentId);
        } else if (type === "removeComponent") {
        } else if (type === "updateComponent") {
          const componentId = componentIndexRebuildingRule.componentId;
          const patch = componentIndexRebuildingRule.patch;

          if (patch && typeof patch === "object" && !Array.isArray(patch) && patch.props && typeof patch.props === "object" && !Array.isArray(patch.props)) {
            const propKeys = Object.keys(patch.props);

            for (const propKey of propKeys) {
              keys.add(`${componentId}.${propKey}`);
            }
          }
        }
      }

      if (keys.size > 0) {
        notifyDependencyChange(Array.from(keys));
      }

      componentIndexRebuildingRules.length = 0;
    } catch (error) {
      console.log(error.message);
    }
  }

  function setExpressionEngine(expressionEngine) {
    try {
      actionEngine.setExpressionEngine(expressionEngine);
    } catch (error) {
      console.log(error.message);
    }
  }

  function setIsMountedRef(isMountedRef) {
    try {
      actionEngine.setIsMountedRef(isMountedRef);
    } catch (error) {
      console.log(error.message);
    }
  }

  function setModels(models) {
    try {
      expressionEngine.setModels(models);

      notifyDependencyChange("models");
    } catch (error) {
      console.log(error.message);
    }
  }

  function setNowTick(nowTick) {
    try {
      expressionEngine.setNowTick(nowTick);

      notifyDependencyChange("nowTick");
    } catch (error) {
      console.log(error.message);
    }
  }

  function setPageData(pageData) {
    try {
      expressionEngine.setPageData(pageData);

      notifyDependencyChange("pageData");
    } catch (error) {
      console.log(error.message);
    }
  }

  function setPlatformUser(platformUser) {
    try {
      let isNotifyingOfEmail = false;
      let isNotifyingOfIsAdmin = false;
      let isNotifyingOfIsAuthenticated = false;
      let isNotifyingOfIsOwner = false;

      if (expressionEngine.context.platformUser?.email !== platformUser?.email) {
        isNotifyingOfEmail = true;
      }

      if (expressionEngine.context.platformUser?.isAdmin !== platformUser?.isAdmin) {
        isNotifyingOfIsAdmin = true;
      }

      if (expressionEngine.context.platformUser?.isAuthenticated !== platformUser?.isAuthenticated) {
        isNotifyingOfIsAuthenticated = true;
      }

      if (expressionEngine.context.platformUser?.isOwner !== platformUser?.isOwner) {
        isNotifyingOfIsOwner = true;
      }

      expressionEngine.setPlatformUser(platformUser);

      const dependencies = [];

      if (isNotifyingOfEmail) {
        dependencies.push("platformUser.email");
      }

      if (isNotifyingOfIsAdmin) {
        dependencies.push("platformUser.isAdmin");
      }

      if (isNotifyingOfIsAuthenticated) {
        dependencies.push("platformUser.isAuthenticated");
      }

      if (isNotifyingOfIsOwner) {
        dependencies.push("platformUser.isOwner");
      }

      if (dependencies.length > 0) {
        notifyDependencyChange(dependencies);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  function setRelationIndexes(relationIndexes) {
    try {
      expressionEngine.setRelationIndexes(relationIndexes);
    } catch (error) {
      console.log(error.message);
    }
  }

  function setRouter(router) {
    try {
      actionEngine.setRouter(router);
    } catch (error) {
      console.log(error.message);
    }
  }

  function setSetPageData(setPageData) {
    try {
      actionEngine.setSetPageData(setPageData);
    } catch (error) {
      console.log(error.message);
    }
  }

  function setSetState(setState) {
    try {
      actionEngine.setSetState(setState);
    } catch (error) {
      console.log(error.message);
    }
  }

  function setSignIn(signIn) {
    try {
      actionEngine.setSignIn(signIn);
    } catch (error) {
      console.log(error.message);
    }
  }

  function setSignOut(signOut) {
    try {
      actionEngine.setSignOut(signOut);
    } catch (error) {
      console.log(error.message);
    }
  }

  function setSignUp(signUp) {
    try {
      actionEngine.setSignUp(signUp);
    } catch (error) {
      console.log(error.message);
    }
  }

  function setSocketBroadcast(socketBroadcast) {
    try {
      actionEngine.setSocketBroadcast(socketBroadcast);
    } catch (error) {
      console.log(error.message);
    }
  }

  function setSocketConnect(socketConnect) {
    try {
      actionEngine.setSocketConnect(socketConnect);
    } catch (error) {
      console.log(error.message);
    }
  }

  function setSocketDataAdd(socketDataAdd) {
    try {
      actionEngine.setSocketDataAdd(socketDataAdd);
    } catch (error) {
      console.log(error.message);
    }
  }

  function setSocketDataArray(socketDataArray) {
    try {
      expressionEngine.setSocketDataArray(socketDataArray);
    } catch (error) {
      console.log(error.message);
    }
  }

  function setSocketDataClear(socketDataClear) {
    try {
      actionEngine.setSocketDataClear(socketDataClear);
    } catch (error) {
      console.log(error.message);
    }
  }

  function setSocketDataRemove(socketDataRemove) {
    try {
      actionEngine.setSocketDataRemove(socketDataRemove);
    } catch (error) {
      console.log(error.message);
    }
  }

  function setSocketDisconnect(socketDisconnect) {
    try {
      actionEngine.setSocketDisconnect(socketDisconnect);
    } catch (error) {
      console.log(error.message);
    }
  }

  function setSocketEmit(socketEmit) {
    try {
      actionEngine.setSocketEmit(socketEmit);
    } catch (error) {
      console.log(error.message);
    }
  }

  function setSocketStatus(socketStatus) {
    try {
      let isNotifyingOfSocketStatus = false;

      if (expressionEngine.context.socketStatus !== socketStatus) {
        isNotifyingOfSocketStatus = true;
      }

      expressionEngine.setSocketStatus(socketStatus);

      if (isNotifyingOfSocketStatus) {
        notifyDependencyChange("socketStatus");
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  function setState(state) {
    try {
      expressionEngine.setState(state);

      notifyDependencyChange("state");
    } catch (error) {
      console.log(error.message);
    }
  }

  function setUpdateComponent(updateComponent) {
    try {
      actionEngine.setUpdateComponent(updateComponent);
    } catch (error) {
      console.log(error.message);
    }
  }

  function setUser(user) {
    try {
      let isNotifyingOfEmail = false;
      let isNotifyingOfIsAuthenticated = false;
      let isNotifyingOfName = false;

      if (expressionEngine.context.user?.email !== user?.email) {
        isNotifyingOfEmail = true;
      }

      if (expressionEngine.context.user?.isAuthenticated !== user?.isAuthenticated) {
        isNotifyingOfIsAuthenticated = true;
      }

      if (expressionEngine.context.user?.name !== user?.name) {
        isNotifyingOfName = true;
      }

      expressionEngine.setUser(user);

      const dependencies = [];

      if (isNotifyingOfEmail) {
        dependencies.push("user.email");
      }

      if (isNotifyingOfIsAuthenticated) {
        dependencies.push("user.isAuthenticated");
      }

      if (isNotifyingOfName) {
        dependencies.push("user.name");
      }

      if (dependencies.length > 0) {
        notifyDependencyChange(dependencies);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  function setViewport(viewport) {
    try {
      let isNotifyingOfHeight = false;
      let isNotifyingOfIsDesktop = false;
      let isNotifyingOfIsMobile = false;
      let isNotifyingOfIsTablet = false;
      let isNotifyingOfName = false;
      let isNotifyingOfOrientation = false;
      let isNotifyingOfWidth = false;

      if (expressionEngine.context.viewport?.height !== viewport?.height) {
        isNotifyingOfHeight = true;
      }

      if (expressionEngine.context.viewport?.isDesktop !== viewport?.isDesktop) {
        isNotifyingOfIsDesktop = true;
      }

      if (expressionEngine.context.viewport?.isMobile !== viewport?.isMobile) {
        isNotifyingOfIsMobile = true;
      }

      if (expressionEngine.context.viewport?.isTablet !== viewport?.isTablet) {
        isNotifyingOfIsTablet = true;
      }

      if (expressionEngine.context.viewport?.name !== viewport?.name) {
        isNotifyingOfName = true;
      }

      if (expressionEngine.context.viewport?.orientation !== viewport?.orientation) {
        isNotifyingOfOrientation = true;
      }

      if (expressionEngine.context.viewport?.width !== viewport?.width) {
        isNotifyingOfWidth = true;
      }

      expressionEngine.setViewport(viewport);

      const dependencies = [];

      if (isNotifyingOfHeight) {
        dependencies.push("viewport.height");
      }

      if (isNotifyingOfIsDesktop) {
        dependencies.push("viewport.isDesktop");
      }

      if (isNotifyingOfIsMobile) {
        dependencies.push("viewport.isMobile");
      }

      if (isNotifyingOfIsTablet) {
        dependencies.push("viewport.isTablet");
      }

      if (isNotifyingOfName) {
        dependencies.push("viewport.name");
      }

      if (isNotifyingOfOrientation) {
        dependencies.push("viewport.orientation");
      }

      if (isNotifyingOfWidth) {
        dependencies.push("viewport.width");
      }

      if (dependencies.length > 0) {
        notifyDependencyChange(dependencies);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  function setWebsite(website) {
    try {
      let isNotifyingOfDescription = false;
      let isNotifyingOfLanguage = false;
      let isNotifyingOfName = false;

      if (expressionEngine.context.website?.description !== website?.description) {
        isNotifyingOfDescription = true;
      }

      if (expressionEngine.context.website?.language !== website?.language) {
        isNotifyingOfLanguage = true;
      }

      if (expressionEngine.context.website?.name !== website?.name) {
        isNotifyingOfName = true;
      }

      expressionEngine.setWebsite(website);

      const dependencies = [];

      if (isNotifyingOfDescription) {
        dependencies.push("website.description");
      }

      if (isNotifyingOfLanguage) {
        dependencies.push("website.language");
      }

      if (isNotifyingOfName) {
        dependencies.push("website.name");
      }

      if (dependencies.length > 0) {
        notifyDependencyChange(dependencies);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  function subscribe(componentId, componentInstanceId, listener) {
    try {
      if (typeof componentId === "string" && typeof componentInstanceId === "string" && typeof listener === "function") {
        let component = components.get(componentId);

        if (!(component !== null && typeof component === "object" && !Array.isArray(component))) {
          return null;
        }

        if (!(component.componentInstances !== null && typeof component.componentInstances === "object" && !Array.isArray(component.componentInstances))) {
          return null;
        }

        const componentInstance = component.componentInstances[componentInstanceId];

        if (componentInstance !== null && typeof componentInstance === "object" && !Array.isArray(componentInstance)) {
          componentInstance.listeners.add(listener);

          return () => {
            componentInstance.listeners.delete(listener);
          };
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.log(error.message);

      return null;
    }
  }

  function unregisterComponent(componentId, componentInstanceId) {
    try {
      if (typeof componentId === "string" && typeof componentInstanceId === "string") {
        const component = components.get(componentId);

        if (component !== null && typeof component === "object" && !Array.isArray(component)) {
          const componentInstances = component.componentInstances;

          if (componentInstances !== null && typeof componentInstances === "object" && !Array.isArray(componentInstances) && componentInstances.hasOwnProperty(componentInstanceId)) {
            unregisterDependenciesFor(componentId, componentInstanceId);

            delete componentInstances[componentInstanceId];

            const keys = Object.keys(componentInstances);

            if (keys.length === 0) {
              components.delete(componentId);
            }
          }
        }

        componentDependencies.delete(`${componentId}.${componentInstanceId}`);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  function updateSnapshot(componentId, componentInstanceId, snapshot) {
    try {
      if (typeof componentId === "string" && typeof componentInstanceId === "string") {
        const component = components.get(componentId);

        if (component !== null && typeof component === "object" && !Array.isArray(component)) {
          const componentInstances = component.componentInstances;

          if (componentInstances !== null && typeof componentInstances === "object" && !Array.isArray(componentInstances) && componentInstances.hasOwnProperty(componentInstanceId)) {
            const componentInstance = componentInstances[componentInstanceId];

            if (componentInstance !== null && typeof componentInstance === "object" && !Array.isArray(componentInstance)) {
              const oldSnapshot = componentInstance.snapshot;
              const newSnapshot = snapshot;

              if (!equals(oldSnapshot, newSnapshot)) {
                componentInstance.snapshot = newSnapshot;

                componentInstance.listeners.forEach((listener) => listener());
              }
            }
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  //Implementation details:

  function applyFilter(item, filter) {
    const left = getValueByPath(item, filter.field);

    const right = filter.value?.type === "expression" ? expressionEngine?.executeExpression?.(filter.value.expression, item) : filter.value;

    switch (filter.operator) {
      case "contains":
        return String(left).includes(right);
      case "equals":
        return left === right;
      case "greater_than":
        return left > right;
      case "greater_than_or_equal_to":
        return left >= right;
      case "less_than":
        return left < right;
      case "less_than_or_equal_to":
        return left <= right;
      default:
        return true;
    }
  }

  function applySort(items, sortRules) {
    return [...items].sort((a, b) => {
      for (const rule of sortRules) {
        const av = getValueByPath(a, rule.field);
        const bv = getValueByPath(b, rule.field);

        if (av < bv) {
          return rule.direction === "asc" ? -1 : 1;
        }

        if (av > bv) {
          return rule.direction === "asc" ? 1 : -1;
        }
      }

      return 0;
    });
  }

  function containsBinding(value) {
    try {
      if (!value || typeof value !== "object") {
        return false;
      }

      if (Array.isArray(value)) {
        return value.some(containsBinding);
      }

      if (value.type === "expression") {
        return true;
      }

      for (const key in value) {
        if (containsBinding(value[key])) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.log(error.message);

      return false;
    }
  }

  function notifyDependencyChange(dependency) {
    try {
      const componentInstanceSet = new Set();

      if (typeof dependency === "string") {
        const dependencyEntry = dependencyIndex.get(dependency);

        if (dependencyEntry !== null && typeof dependencyEntry === "object" && !Array.isArray(dependencyEntry)) {
          for (const [componentId, component] of Object.entries(dependencyEntry)) {
            if (component !== null && typeof component === "object" && !Array.isArray(component)) {
              for (const [componentInstanceId, componentInstance] of Object.entries(component)) {
                if (componentInstance !== null && typeof componentInstance === "object" && !Array.isArray(componentInstance) && typeof componentInstance.onUpdate === "function") {
                  componentInstanceSet.add(componentInstance);
                }
              }
            }
          }
        }
      } else if (Array.isArray(dependency)) {
        for (const currentDependency of dependency) {
          const dependencyEntry = dependencyIndex.get(currentDependency);

          if (dependencyEntry !== null && typeof dependencyEntry === "object" && !Array.isArray(dependencyEntry)) {
            for (const [componentId, component] of Object.entries(dependencyEntry)) {
              if (component !== null && typeof component === "object" && !Array.isArray(component)) {
                for (const [componentInstanceId, componentInstance] of Object.entries(component)) {
                  if (componentInstance !== null && typeof componentInstance === "object" && !Array.isArray(componentInstance) && typeof componentInstance.onUpdate === "function") {
                    componentInstanceSet.add(componentInstance);
                  }
                }
              }
            }
          }
        }
      }

      if (componentInstanceSet.size > 0) {
        for (const componentInstance of componentInstanceSet) {
          componentInstance.onUpdate();
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  function registerDependencyFor(dependency, componentId, componentInstanceId) {
    try {
      if (typeof dependency === "string" && typeof componentId === "string" && typeof componentInstanceId === "string") {
        let dependencyEntry = dependencyIndex.get(dependency);

        if (!(dependencyEntry !== null && typeof dependencyEntry === "object" && !Array.isArray(dependencyEntry))) {
          dependencyEntry = {};

          dependencyIndex.set(dependency, dependencyEntry);
        }

        if (dependencyEntry !== null && typeof dependencyEntry === "object" && !Array.isArray(dependencyEntry)) {
          if (!Object.hasOwn(dependencyEntry, componentId)) {
            dependencyEntry[componentId] = {};
          }

          let dependencyEntryInstance = dependencyEntry[componentId];

          if (!(dependencyEntryInstance !== null && typeof dependencyEntryInstance === "object" && !Array.isArray(dependencyEntryInstance))) {
            dependencyEntryInstance = {};

            dependencyEntry[componentId] = dependencyEntryInstance;
          }

          const componentInstance = getComponentInstance(componentId, componentInstanceId);

          dependencyEntryInstance[componentInstanceId] = componentInstance;
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  function resolveDataSource(dataSource, scope, dependencyCollector = null) {
    try {
      if (!dataSource) {
        return scope;
      }

      if (dataSource.type === "expression") {
        if (typeof dependencyCollector === "function") {
          dependencyCollector("expression", dataSource.expression);
        }

        const result = expressionEngine?.executeExpression?.(dataSource.expression, scope);

        return Array.isArray(result) ? result : [];
      }

      if (dataSource.type === "model") {
        const query = dataSource.query;

        if (!query) {
          return scope;
        }

        if (typeof dependencyCollector === "function") {
          dependencyCollector("model", query);
        }

        let items = scope && getValueByPath(scope, query.from) !== undefined ? getValueByPath(scope, query.from) : getValueByPath(expressionEngine?.context?.pageData, query.from);

        if (!Array.isArray(items)) {
          return items ?? EMPTY_OBJECT;
        }

        const modelName = query.from.split(".").pop();
        const modelSchema = expressionEngine?.context?.models?.[modelName];

        if (modelSchema) {
          items = items.map((item) => resolveRelations(item, modelSchema));
        }

        if (Array.isArray(query.filter) && query.filter.length) {
          items = items.filter((item) => query.filter.every((f) => applyFilter(item, f)));
        }

        if (Array.isArray(query.sort) && query.sort.length) {
          items = applySort(items, query.sort);
        }

        if (typeof query.limit === "number") {
          items = items.slice(0, query.limit);
        }

        return items;
      }

      if (dataSource.type === "integration") {
        let items = scope;

        if (!Array.isArray(items)) {
          return items ?? EMPTY_OBJECT;
        }

        if (Array.isArray(dataSource.query?.filter)) {
          items = items.filter((item) => dataSource.query.filter.every((f) => applyFilter(item, f)));
        }

        if (Array.isArray(dataSource.query?.sort)) {
          items = applySort(items, dataSource.query.sort);
        }

        return items;
      }

      return scope;
    } catch (error) {
      console.log(error.message);

      return scope;
    }
  }

  function resolveRelations(item, modelSchema) {
    try {
      if (!item || !modelSchema?.fields) {
        return item;
      }

      const resolved = { ...item };

      for (const fieldName in modelSchema.fields) {
        const field = modelSchema.fields[fieldName];
        const value = resolved[fieldName];

        if (field.type === "relation") {
          if (typeof value === "string") {
            const index = expressionEngine?.context?.relationIndexes?.[field.model];

            if (index) {
              resolved[fieldName] = index.get(value) ?? null;
            }
          }
        }

        if (field.type === "collection" && Array.isArray(value)) {
          resolved[fieldName] = value.map((entry) => resolveRelations(entry, { fields: field.fields }));
        }
      }

      return resolved;
    } catch (error) {
      console.log(error.message);

      return item;
    }
  }

  function unregisterDependenciesFor(componentId, componentInstanceId) {
    try {
      if (typeof componentId === "string" && typeof componentInstanceId === "string") {
        for (const [dependency, dependencyEntry] of dependencyIndex.entries()) {
          if (dependencyEntry !== null && typeof dependencyEntry === "object" && !Array.isArray(dependencyEntry)) {
            if (Object.hasOwn(dependencyEntry, componentId)) {
              const component = dependencyEntry[componentId];

              if (component !== null && typeof component === "object" && !Array.isArray(component)) {
                if (Object.hasOwn(component, componentInstanceId)) {
                  delete component[componentInstanceId];
                }

                if (Object.keys(component).length === 0) {
                  delete dependencyEntry[componentId];
                }
              }
            }

            if (Object.keys(dependencyEntry).length === 0) {
              dependencyIndex.delete(dependency);
            }
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  function unregisterDependencyFor(dependency, componentId, componentInstanceId) {
    try {
      if (typeof dependency === "string" && typeof componentId === "string" && typeof componentInstanceId === "string") {
        const dependencyEntry = dependencyIndex.get(dependency);

        if (dependencyEntry !== null && typeof dependencyEntry === "object" && !Array.isArray(dependencyEntry)) {
          if (Object.hasOwn(dependencyEntry, componentId)) {
            const component = dependencyEntry[componentId];

            if (component !== null && typeof component === "object" && !Array.isArray(component)) {
              if (Object.hasOwn(component, componentInstanceId)) {
                delete component[componentInstanceId];
              }

              if (Object.keys(component).length === 0) {
                delete dependencyEntry[componentId];
              }
            }
          }

          if (Object.keys(dependencyEntry).length === 0) {
            dependencyIndex.delete(dependency);
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return {
    addComponentIndexRebuildingRule,
    createInitialSnapshot,
    createSnapshot,
    dataSourceSnapshotDataFactory,
    getComponent,
    getComponentInstance,
    getSnapshot,
    propsSnapshotDataFactory,
    registerComponent,
    resolveBindings,
    scopeFactory,
    setComponentIndex,
    setExpressionEngine,
    setIsMountedRef,
    setModels,
    setNowTick,
    setPageData,
    setPlatformUser,
    setRelationIndexes,
    setRouter,
    setSetPageData,
    setSetState,
    setSignIn,
    setSignOut,
    setSignUp,
    setSocketBroadcast,
    setSocketConnect,
    setSocketDataAdd,
    setSocketDataArray,
    setSocketDataClear,
    setSocketDataRemove,
    setSocketDisconnect,
    setSocketEmit,
    setSocketStatus,
    setState,
    setUpdateComponent,
    setUser,
    setViewport,
    setWebsite,
    subscribe,
    unregisterComponent,
    updateSnapshot,
  };
}
