// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

export function createActionEngine(expressionEngine = null, isMountedRef = null, router = null, setPageData = null, setState = null, signIn = null, signOut = null, signUp = null, socketBroadcast = null, socketConnect = null, socketDataAdd = null, socketDataClear = null, socketDataRemove = null, socketDisconnect = null, socketEmit = null, updateComponent = null) {
  const CANVAS_IMAGE_CACHE = new Map();

  const actionContext = {
    expressionEngine,
    isMountedRef,
    router,
    setPageData,
    setState,
    signIn,
    signOut,
    signUp,
    socketBroadcast,
    socketConnect,
    socketDataAdd,
    socketDataClear,
    socketDataRemove,
    socketDisconnect,
    socketEmit,
    updateComponent,
  };

  async function executeAction(action, modelScope = null, baseContext = actionContext) {
    const context = createExecutionContext(baseContext, modelScope);

    return execute(action, context);
  }

  function setExpressionEngine(expressionEngine) {
    actionContext.expressionEngine = expressionEngine;
  }

  function setIsMountedRef(isMountedRef) {
    actionContext.isMountedRef = isMountedRef;
  }

  function setRouter(router) {
    actionContext.router = router;
  }

  function setSetPageData(setPageData) {
    actionContext.setPageData = setPageData;
  }

  function setSetState(setState) {
    actionContext.setState = setState;
  }

  function setSignIn(signIn) {
    actionContext.signIn = signIn;
  }

  function setSignOut(signOut) {
    actionContext.signOut = signOut;
  }

  function setSignUp(signUp) {
    actionContext.signUp = signUp;
  }

  function setSocketBroadcast(socketBroadcast) {
    actionContext.socketBroadcast = socketBroadcast;
  }

  function setSocketConnect(socketConnect) {
    actionContext.socketConnect = socketConnect;
  }

  function setSocketDataAdd(socketDataAdd) {
    actionContext.socketDataAdd = socketDataAdd;
  }

  function setSocketDataClear(socketDataClear) {
    actionContext.socketDataClear = socketDataClear;
  }

  function setSocketDataRemove(socketDataRemove) {
    actionContext.socketDataRemove = socketDataRemove;
  }

  function setSocketDisconnect(socketDisconnect) {
    actionContext.socketDisconnect = socketDisconnect;
  }

  function setSocketEmit(socketEmit) {
    actionContext.socketEmit = socketEmit;
  }

  function setUpdateComponent(updateComponent) {
    actionContext.updateComponent = updateComponent;
  }

  function addDeep(object, path, value) {
    const parts = parsePath(path);

    const result = Array.isArray(object) ? [...object] : { ...object };

    let current = result;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const next = parts[i + 1];

      const isLast = i === parts.length - 1;
      const isPush = part === "__push__";
      const isIndex = /^\d+$/.test(part);

      const key = isIndex ? Number(part) : part;

      if (isLast) {
        if (Array.isArray(current)) {
          if (isPush) {
            current.push(value);
          } else if (isIndex) {
            current[key] = value;
          }
        } else {
          if (isPush) {
            return object;
          }

          current[key] = value;
        }

        break;
      }

      const nextIsArray = next === "__push__" || /^\d+$/.test(next);

      if (current[key] === undefined) {
        current[key] = nextIsArray ? [] : {};
      } else {
        current[key] = Array.isArray(current[key]) ? [...current[key]] : { ...current[key] };
      }

      current = current[key];
    }

    return result;
  }

  async function addStateValue(config, context) {
    try {
      const { path, value } = config;

      if (!path) {
        return false;
      }

      const resolvedValue = resolveDeep(value, context);

      context.setState((prev) => {
        return addDeep(prev || {}, path, resolvedValue);
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  async function canvasCircle(config, context) {
    try {
      const ctx = context?.expressionEngine?.context?.state?.runtime?.canvas?.ctx;

      if (!ctx) {
        return false;
      }

      const { fill, opacity, radius, stroke, strokeWidth, x, y } = config;

      const resolvedFill = resolveDeep(fill, context);
      const resolvedOpacity = resolveDeep(opacity, context);
      const resolvedRadius = resolveDeep(radius, context);
      const resolvedStroke = resolveDeep(stroke, context);
      const resolvedStrokeWidth = resolveDeep(strokeWidth, context);
      const resolvedX = resolveDeep(x, context);
      const resolvedY = resolveDeep(y, context);

      if (typeof resolvedFill !== "string" || typeof resolvedOpacity !== "number" || typeof resolvedRadius !== "number" || typeof resolvedStroke !== "string" || typeof resolvedStrokeWidth !== "number" || typeof resolvedX !== "number" || typeof resolvedY !== "number") {
        return false;
      }

      ctx.save();

      ctx.globalAlpha = resolvedOpacity;

      if (resolvedStrokeWidth) {
        ctx.lineWidth = resolvedStrokeWidth;
      }

      if (resolvedFill) {
        ctx.fillStyle = resolvedFill;
      }

      if (resolvedStroke) {
        ctx.strokeStyle = resolvedStroke;
      }

      ctx.beginPath();
      ctx.arc(resolvedX, resolvedY, resolvedRadius, 0, Math.PI * 2);

      if (resolvedFill) {
        ctx.fill();
      }

      if (resolvedStroke) {
        ctx.stroke();
      }

      ctx.restore();

      return true;
    } catch (error) {
      return false;
    }
  }

  async function canvasClear(config, context) {
    try {
      const ctx = context?.expressionEngine?.context?.state?.runtime?.canvas?.ctx;
      const canvas = context?.expressionEngine?.context?.state?.runtime?.canvas;

      if (!ctx || !canvas) {
        return false;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      return true;
    } catch (error) {
      return false;
    }
  }

  async function canvasImage(config, context) {
    try {
      const ctx = context?.expressionEngine?.context?.state?.runtime?.canvas?.ctx;

      if (!ctx) {
        return false;
      }

      const { height, opacity, src, width, x, y } = config;

      const resolvedHeight = resolveDeep(height, context);
      const resolvedOpacity = resolveDeep(opacity, context);
      const resolvedSrc = resolveDeep(src, context);
      const resolvedWidth = resolveDeep(width, context);
      const resolvedX = resolveDeep(x, context);
      const resolvedY = resolveDeep(y, context);

      if (typeof resolvedHeight !== "number" || typeof resolvedOpacity !== "number" || typeof resolvedSrc !== "string" || typeof resolvedX !== "number" || typeof resolvedY !== "number" || typeof resolvedWidth !== "number") {
        return false;
      }

      if (!resolvedSrc) {
        return false;
      }

      let image = CANVAS_IMAGE_CACHE.get(resolvedSrc);

      if (!image) {
        image = new Image();

        image.src = resolvedSrc;

        CANVAS_IMAGE_CACHE.set(resolvedSrc, image);

        return true;
      }

      if (!image.complete) {
        return true;
      }

      ctx.save();

      ctx.globalAlpha = resolvedOpacity;

      ctx.drawImage(image, resolvedX, resolvedY, resolvedWidth, resolvedHeight);

      ctx.restore();

      return true;
    } catch (error) {
      return false;
    }
  }

  async function canvasLine(config, context) {
    try {
      const ctx = context?.expressionEngine?.context?.state?.runtime?.canvas?.ctx;

      if (!ctx) {
        return false;
      }

      const { opacity, stroke, strokeWidth, x1, x2, y1, y2 } = config;

      const resolvedOpacity = resolveDeep(opacity, context);
      const resolvedStroke = resolveDeep(stroke, context);
      const resolvedStrokeWidth = resolveDeep(strokeWidth, context);
      const resolvedX1 = resolveDeep(x1, context);
      const resolvedX2 = resolveDeep(x2, context);
      const resolvedY1 = resolveDeep(y1, context);
      const resolvedY2 = resolveDeep(y2, context);

      if (typeof resolvedOpacity !== "number" || typeof resolvedStroke !== "string" || typeof resolvedStrokeWidth !== "number" || typeof resolvedX1 !== "number" || typeof resolvedX2 !== "number" || typeof resolvedY1 !== "number" || typeof resolvedY2 !== "number") {
        return false;
      }

      ctx.save();

      ctx.globalAlpha = resolvedOpacity;

      if (resolvedStrokeWidth) {
        ctx.lineWidth = resolvedStrokeWidth;
      }

      if (resolvedStroke) {
        ctx.strokeStyle = resolvedStroke;
      }

      ctx.beginPath();
      ctx.moveTo(resolvedX1, resolvedY1);
      ctx.lineTo(resolvedX2, resolvedY2);
      ctx.stroke();
      ctx.restore();

      return true;
    } catch (error) {
      return false;
    }
  }

  async function canvasPolygon(config, context) {
    try {
      const ctx = context?.expressionEngine?.context?.state?.runtime?.canvas?.ctx;

      if (!ctx) {
        return false;
      }

      const { fill, opacity, points, stroke, strokeWidth } = config;

      const resolvedFill = resolveDeep(fill, context);
      const resolvedOpacity = resolveDeep(opacity, context);
      const resolvedPoints = resolveDeep(points, context);
      const resolvedStroke = resolveDeep(stroke, context);
      const resolvedStrokeWidth = resolveDeep(strokeWidth, context);

      if (typeof resolvedFill !== "string" || typeof resolvedOpacity !== "number" || !Array.isArray(resolvedPoints) || typeof resolvedStroke !== "string" || typeof resolvedStrokeWidth !== "number") {
        return false;
      }

      if (resolvedPoints.length === 0) {
        return true;
      }

      for (let i = 0; i < resolvedPoints.length; i++) {
        const point = resolvedPoints[i];

        if (typeof point?.x !== "number" || typeof point?.y !== "number") {
          return false;
        }
      }

      ctx.save();

      ctx.globalAlpha = resolvedOpacity;

      if (resolvedStrokeWidth) {
        ctx.lineWidth = resolvedStrokeWidth;
      }

      if (resolvedFill) {
        ctx.fillStyle = resolvedFill;
      }

      if (resolvedStroke) {
        ctx.strokeStyle = resolvedStroke;
      }

      ctx.beginPath();

      ctx.moveTo(resolvedPoints[0].x, resolvedPoints[0].y);

      for (let i = 1; i < resolvedPoints.length; i++) {
        ctx.lineTo(resolvedPoints[i].x, resolvedPoints[i].y);
      }

      ctx.closePath();

      if (resolvedFill) {
        ctx.fill();
      }

      if (resolvedStroke) {
        ctx.stroke();
      }

      ctx.restore();

      return true;
    } catch (error) {
      return false;
    }
  }

  async function canvasRectangle(config, context) {
    try {
      const ctx = context?.expressionEngine?.context?.state?.runtime?.canvas?.ctx;

      if (!ctx) {
        return false;
      }

      const { fill, height, opacity, radius, stroke, strokeWidth, width, x, y } = config;

      const resolvedFill = resolveDeep(fill, context);
      const resolvedHeight = resolveDeep(height, context);
      const resolvedOpacity = resolveDeep(opacity, context);
      const resolvedRadius = resolveDeep(radius, context);
      const resolvedStroke = resolveDeep(stroke, context);
      const resolvedStrokeWidth = resolveDeep(strokeWidth, context);
      const resolvedWidth = resolveDeep(width, context);
      const resolvedX = resolveDeep(x, context);
      const resolvedY = resolveDeep(y, context);

      if (typeof resolvedFill !== "string" || typeof resolvedHeight !== "number" || typeof resolvedOpacity !== "number" || typeof resolvedRadius !== "number" || typeof resolvedStroke !== "string" || typeof resolvedStrokeWidth !== "number" || typeof resolvedWidth !== "number" || typeof resolvedX !== "number" || typeof resolvedY !== "number") {
        return false;
      }

      ctx.save();

      ctx.globalAlpha = resolvedOpacity;

      if (resolvedStrokeWidth) {
        ctx.lineWidth = resolvedStrokeWidth;
      }

      if (resolvedFill) {
        ctx.fillStyle = resolvedFill;
      }

      if (resolvedStroke) {
        ctx.strokeStyle = resolvedStroke;
      }

      ctx.beginPath();

      if (resolvedRadius > 0) {
        ctx.roundRect(resolvedX, resolvedY, resolvedWidth, resolvedHeight, resolvedRadius);
      } else {
        ctx.rect(resolvedX, resolvedY, resolvedWidth, resolvedHeight);
      }

      if (resolvedFill) {
        ctx.fill();
      }

      if (resolvedStroke) {
        ctx.stroke();
      }

      ctx.restore();

      return true;
    } catch (error) {
      return false;
    }
  }

  async function canvasRestore(config, context) {
    try {
      const ctx = context?.expressionEngine?.context?.state?.runtime?.canvas?.ctx;

      if (!ctx) {
        return false;
      }

      ctx.restore();

      return true;
    } catch {
      return false;
    }
  }

  async function canvasRotate(config, context) {
    try {
      const ctx = context?.expressionEngine?.context?.state?.runtime?.canvas?.ctx;

      if (!ctx) {
        return false;
      }

      const resolvedAngle = resolveDeep(config.angle, context);

      if (typeof resolvedAngle !== "number") {
        return false;
      }

      ctx.rotate((resolvedAngle * Math.PI) / 180);

      return true;
    } catch (error) {
      return false;
    }
  }

  async function canvasSave(config, context) {
    try {
      const ctx = context?.expressionEngine?.context?.state?.runtime?.canvas?.ctx;

      if (!ctx) {
        return false;
      }

      ctx.save();

      return true;
    } catch {
      return false;
    }
  }

  async function canvasScale(config, context) {
    try {
      const ctx = context?.expressionEngine?.context?.state?.runtime?.canvas?.ctx;

      if (!ctx) {
        return false;
      }

      const resolvedX = resolveDeep(config.x, context);
      const resolvedY = resolveDeep(config.y, context);

      if (typeof resolvedX !== "number" || typeof resolvedY !== "number") {
        return false;
      }

      ctx.scale(resolvedX, resolvedY);

      return true;
    } catch (error) {
      return false;
    }
  }

  async function canvasText(config, context) {
    try {
      const ctx = context?.expressionEngine?.context?.state?.runtime?.canvas?.ctx;

      if (!ctx) {
        return false;
      }

      const { align, color, fontFamily, fontSize, fontWeight, opacity, text, x, y } = config;

      const resolvedAlign = resolveDeep(align, context);
      const resolvedColor = resolveDeep(color, context);
      const resolvedFontFamily = resolveDeep(fontFamily, context);
      const resolvedFontSize = resolveDeep(fontSize, context);
      const resolvedFontWeight = resolveDeep(fontWeight, context);
      const resolvedOpacity = resolveDeep(opacity, context);
      const resolvedText = resolveDeep(text, context);
      const resolvedX = resolveDeep(x, context);
      const resolvedY = resolveDeep(y, context);

      if (typeof resolvedAlign !== "string" || typeof resolvedColor !== "string" || typeof resolvedFontFamily !== "string" || typeof resolvedFontSize !== "number" || typeof resolvedFontWeight !== "string" || typeof resolvedOpacity !== "number" || typeof resolvedText !== "string" || typeof resolvedX !== "number" || typeof resolvedY !== "number") {
        return false;
      }

      ctx.save();

      ctx.globalAlpha = resolvedOpacity;

      if (resolvedColor) {
        ctx.fillStyle = resolvedColor;
      }

      if (resolvedAlign) {
        ctx.textAlign = resolvedAlign;
      }

      if (resolvedFontFamily && resolvedFontSize && resolvedFontWeight) {
        ctx.font = `${resolvedFontWeight} ${resolvedFontSize}px ${resolvedFontFamily}`;
      }

      ctx.fillText(resolvedText, resolvedX, resolvedY);
      ctx.restore();

      return true;
    } catch (error) {
      return false;
    }
  }

  async function canvasTranslate(config, context) {
    try {
      const ctx = context?.expressionEngine?.context?.state?.runtime?.canvas?.ctx;

      if (!ctx) {
        return false;
      }

      const resolvedX = resolveDeep(config.x, context);
      const resolvedY = resolveDeep(config.y, context);

      if (typeof resolvedX !== "number" || typeof resolvedY !== "number") {
        return false;
      }

      ctx.translate(resolvedX, resolvedY);

      return true;
    } catch (error) {
      return false;
    }
  }

  function createExecutionContext(baseContext, modelScope = null) {
    const runId = crypto.randomUUID();

    let cancelled = false;

    if (modelScope !== null && modelScope !== undefined) {
      return {
        ...baseContext,
        expressionEngine: {
          ...(baseContext.expressionEngine ?? {}),
          context: {
            ...(baseContext.expressionEngine?.context ?? {}),
            modelScope,
          },
        },
        runId,
        cancel: () => {
          cancelled = true;
        },
        isCancelled: () => cancelled,
      };
    }

    return {
      ...baseContext,
      runId,
      cancel: () => {
        cancelled = true;
      },
      isCancelled: () => cancelled,
    };
  }

  function deepFlatten(value) {
    if (value === null || value === undefined) {
      return [];
    }

    if (Array.isArray(value)) {
      return value.flatMap(deepFlatten);
    }

    return [value];
  }

  async function execute(action, context) {
    try {
      if (!action || typeof action !== "object" || Array.isArray(action) || !context || typeof context !== "object" || Array.isArray(context) || (typeof context.isCancelled === "function" && context.isCancelled())) {
        return false;
      }

      if (context?.isMountedRef && !context?.isMountedRef?.current) {
        return false;
      }

      if (action.conditions?.length) {
        const passed = action.conditions.every((condition) => context?.expressionEngine?.executeExpression?.(condition?.expression ? condition.expression : condition, null, context?.expressionEngine?.context));

        if (!passed) {
          return false;
        }
      }

      const result = await runAction(action, context);

      if (result === false) {
        return false;
      }

      if ((typeof context?.isCancelled === "function" && context?.isCancelled?.()) || (context?.isMountedRef && !context?.isMountedRef?.current)) {
        return false;
      }

      if (!Array.isArray(action.runAfter) || action.runAfter.length === 0) {
        return true;
      }

      if (typeof result?.branch === "number") {
        const branch = result.branch;

        if (branch >= 0 && branch < action.runAfter.length) {
          const next = action.runAfter[branch];

          if (!next) {
            return false;
          }

          const currentContext =
            result?.state && typeof result.state === "object" && !Array.isArray(result.state)
              ? {
                  ...context,
                  expressionEngine: {
                    ...(context?.expressionEngine ?? {}),
                    context: {
                      ...(context?.expressionEngine?.context ?? {}),
                      state: {
                        ...(context?.expressionEngine?.context?.state ?? {}),
                        runtime: {
                          ...(context?.expressionEngine?.context?.state?.runtime ?? {}),
                          ...result.state,
                        },
                      },
                    },
                  },
                }
              : context;

          const nextResult = await execute(next, currentContext);

          if ((typeof currentContext.isCancelled === "function" && currentContext.isCancelled()) || !nextResult) {
            return false;
          }

          return nextResult;
        } else {
          return false;
        }
      }

      if (Array.isArray(result?.items)) {
        const items = result.items;

        for (const [index, item] of items.entries()) {
          const currentContext = {
            ...context,
            expressionEngine: {
              ...(context?.expressionEngine ?? {}),
              context: {
                ...(context?.expressionEngine?.context ?? {}),
                modelScope: item,
                state: {
                  ...(context?.expressionEngine?.context?.state ?? {}),
                  runtime: {
                    ...(context?.expressionEngine?.context?.state?.runtime ?? {}),
                    iteration: {
                      item,
                      index,
                      count: items.length,
                      first: index === 0,
                      last: index === items.length - 1,
                    },
                  },
                },
              },
            },
          };

          for (const next of action.runAfter) {
            const nextResult = await execute(next, currentContext);

            if ((typeof currentContext.isCancelled === "function" && currentContext.isCancelled()) || !nextResult) {
              return false;
            }
          }
        }

        return true;
      }

      if (result === true) {
        for (const next of action.runAfter) {
          const nextResult = await execute(next, context);

          if ((typeof context?.isCancelled === "function" && context?.isCancelled?.()) || !nextResult) {
            return false;
          }
        }

        return true;
      }

      return false;
    } catch {
      return false;
    }
  }

  async function forEach(config, context) {
    try {
      const { items } = config;

      const resolvedItems = resolveDeep(items, context);

      if (resolvedItems === null || resolvedItems === undefined) {
        return { items: [] };
      }

      if (Array.isArray(resolvedItems)) {
        return { items: deepFlatten(resolvedItems) };
      }

      if (typeof resolvedItems === "object") {
        return { items: Object.values(resolvedItems) };
      }

      return { items: [resolvedItems] };
    } catch (error) {
      return false;
    }
  }

  async function ifAction(config, context) {
    try {
      const { condition } = config;

      const resolvedCondition = resolveDeep(condition, context);

      return { branch: resolvedCondition ? 0 : 1 };
    } catch (error) {
      return false;
    }
  }

  function isExpression(value) {
    return value && typeof value === "object" && value.type === "expression" && value.expression && typeof value.expression === "object";
  }

  async function navigate(config, context) {
    try {
      const { to } = config;

      if (!to) {
        return false;
      }

      let url = to;

      context?.router?.push?.(url);

      return true;
    } catch (error) {
      return false;
    }
  }

  function parsePath(path) {
    return (
      path.match(/([^[.\]]+)|\[(\d*)\]/g)?.map((part) => {
        if (part === "[]") {
          return "__push__";
        }

        if (part.startsWith("[")) {
          return part.slice(1, -1);
        }

        return part;
      }) ?? []
    );
  }

  async function print(config, context) {
    try {
      const { data } = config;

      const resolvedData = resolveDeep(data, context);

      console.log(JSON.stringify(resolvedData, null, 2));

      return true;
    } catch (error) {
      return false;
    }
  }

  function resolveDeep(value, context) {
    if (isExpression(value)) {
      return context?.expressionEngine?.executeExpression?.(value.expression, null, context?.expressionEngine?.context);
    }

    if (Array.isArray(value)) {
      return value.map((v) => resolveDeep(v, context));
    }

    if (value && typeof value === "object") {
      const result = {};

      for (const [key, v] of Object.entries(value)) {
        result[key] = resolveDeep(v, context);
      }

      return result;
    }

    return value;
  }

  async function runAction(action, context) {
    switch (action.type) {
      case "addStateValue":
        return addStateValue(action.config, context);
      case "canvasCircle":
        return canvasCircle(action.config, context);
      case "canvasClear":
        return canvasClear(action.config, context);
      case "canvasImage":
        return canvasImage(action.config, context);
      case "canvasLine":
        return canvasLine(action.config, context);
      case "canvasPolygon":
        return canvasPolygon(action.config, context);
      case "canvasRectangle":
        return canvasRectangle(action.config, context);
      case "canvasRestore":
        return canvasRestore(action.config, context);
      case "canvasRotate":
        return canvasRotate(action.config, context);
      case "canvasSave":
        return canvasSave(action.config, context);
      case "canvasScale":
        return canvasScale(action.config, context);
      case "canvasText":
        return canvasText(action.config, context);
      case "canvasTranslate":
        return canvasTranslate(action.config, context);
      case "forEach":
        return forEach(action.config, context);
      case "if":
        return ifAction(action.config, context);
      case "navigate":
        return navigate(action.config, context);
      case "print":
        return print(action.config, context);
      case "setStateValue":
        return setStateValue(action.config, context);
      case "socketBroadcast":
        return socketBroadcast(action.config, context);
      case "socketConnect":
        return socketConnect(action.config, context);
      case "socketDataAdd":
        return socketDataAdd(action.config, context);
      case "socketDataClear":
        return socketDataClear(action.config, context);
      case "socketDataRemove":
        return socketDataRemove(action.config, context);
      case "socketDisconnect":
        return socketDisconnect(action.config, context);
      case "socketEmit":
        return socketEmit(action.config, context);
      case "updateComponent":
        return updateComponent(action.config, context);
      case "userSignIn":
        return userSignIn(action.config, context);
      case "userSignOut":
        return userSignOut(action.config, context);
      case "userSignUp":
        return userSignUp(action.config, context);
      case "wait":
        return wait(action.config, context);
      default:
        return false;
    }
  }

  function setDeep(object, path, value) {
    const parts = parsePath(path);

    const result = Array.isArray(object) ? [...object] : { ...object };

    let current = result;

    for (let i = 0; i < parts.length - 1; i++) {
      const key = parts[i];
      const next = parts[i + 1];

      if (key === "__push__") {
        return object;
      }

      const isIndex = /^\d+$/.test(key);
      const isIndexNext = next === "__push__" || /^\d+$/.test(next);

      const actualKey = isIndex ? Number(key) : key;

      if (current[actualKey] !== undefined) {
        if (Array.isArray(current[actualKey])) {
          current[actualKey] = [...current[actualKey]];
        } else if (current[actualKey] && typeof current[actualKey] === "object") {
          current[actualKey] = { ...current[actualKey] };
        } else {
          return object;
        }
      } else {
        current[actualKey] = isIndexNext ? [] : {};
      }

      current = current[actualKey];
    }

    const lastKey = parts[parts.length - 1];

    if (lastKey === "__push__") {
      if (!Array.isArray(current)) {
        return object;
      }

      current.push(value);
    } else {
      const actualLastKey = /^\d+$/.test(lastKey) ? Number(lastKey) : lastKey;

      current[actualLastKey] = value;
    }

    return result;
  }

  async function setStateValue(config, context) {
    try {
      const { path, value } = config;

      if (!path) {
        return false;
      }

      const resolvedValue = resolveDeep(value, context);

      context?.setState?.((prev) => {
        const next = setDeep(prev || {}, path, resolvedValue);

        return next;
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  async function socketBroadcast(config, context) {
    try {
      const { data } = config;

      const resolvedData = resolveDeep(data, context);

      context?.socketBroadcast?.(resolvedData);

      return true;
    } catch (error) {
      return false;
    }
  }

  async function socketConnect(config, context) {
    try {
      context?.socketConnect?.();

      return true;
    } catch (error) {
      return false;
    }
  }

  async function socketDataAdd(config, context) {
    try {
      const { data } = config;

      const resolvedData = resolveDeep(data, context);

      context?.socketDataAdd?.(resolvedData);

      return true;
    } catch (error) {
      return false;
    }
  }

  async function socketDataClear(config, context) {
    try {
      context?.socketDataClear?.();

      return true;
    } catch (error) {
      return false;
    }
  }

  async function socketDataRemove(config, context) {
    try {
      const { data } = config;

      const resolvedData = resolveDeep(data, context);

      context?.socketDataRemove?.(resolvedData);

      return true;
    } catch (error) {
      return false;
    }
  }

  async function socketDisconnect(config, context) {
    try {
      context?.socketDisconnect?.();

      return true;
    } catch (error) {
      return false;
    }
  }

  async function socketEmit(config, context) {
    try {
      const { data, room } = config;

      const resolvedData = resolveDeep(data, context);

      context?.socketEmit?.(room, resolvedData);

      return true;
    } catch (error) {
      return false;
    }
  }

  async function updateComponent(config, context) {
    try {
      const { componentId, data } = config;

      if (!componentId) {
        return false;
      }

      const resolvedData = resolveDeep(data, context);

      context?.updateComponent?.(componentId, {
        props: { ...resolvedData },
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  async function userSignIn(config, context) {
    try {
      const { email, password } = config;

      const resolvedEmail = resolveDeep(email, context);
      const resolvedPassword = resolveDeep(password, context);

      const response = await context?.signIn?.({ email: resolvedEmail, password: resolvedPassword });

      const message = response?.message ?? "";

      const websiteUser = response?.websiteUser ?? null;

      return { branch: websiteUser ? 0 : 1, state: { signIn: { message, user: websiteUser } } };
    } catch (error) {
      return false;
    }
  }

  async function userSignOut(config, context) {
    try {
      await context?.signOut?.();

      return true;
    } catch (error) {
      return false;
    }
  }

  async function userSignUp(config, context) {
    try {
      const { code, email, name, password } = config;

      const resolvedCode = resolveDeep(code, context);
      const resolvedEmail = resolveDeep(email, context);
      const resolvedName = resolveDeep(name, context);
      const resolvedPassword = resolveDeep(password, context);

      const response = await context?.signUp?.({ code: resolvedCode, email: resolvedEmail, name: resolvedName, password: resolvedPassword });

      const message = response?.message ?? "";

      const websiteUser = response?.websiteUser ?? null;

      return { branch: websiteUser ? 0 : 1, state: { signUp: { message, user: websiteUser } } };
    } catch (error) {
      return false;
    }
  }

  async function wait(config, context) {
    try {
      const { delay } = config;

      if (typeof delay !== "number") {
        return false;
      }

      return new Promise((resolve) => setTimeout(() => resolve(true), delay));
    } catch (error) {
      return false;
    }
  }

  return {
    context: actionContext,
    executeAction,
    setExpressionEngine,
    setIsMountedRef,
    setRouter,
    setSetPageData,
    setSetState,
    setSignIn,
    setSignOut,
    setSignUp,
    setSocketBroadcast,
    setSocketConnect,
    setSocketDataAdd,
    setSocketDataClear,
    setSocketDataRemove,
    setSocketDisconnect,
    setSocketEmit,
    setUpdateComponent,
  };
}
