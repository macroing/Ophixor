// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { isEmail } from "validator";

import { coercion } from "./coercion";
import { getValueByPath } from "./path";

export function createExpressionEngine(componentIndex = {}, models = {}, nowTick = 0, pageData = {}, platformUser = { email: "", isAuthenticated: false, isAdmin: false, isOwner: false }, relationIndexes = {}, socketDataArray = [], socketStatus = "", state = {}, user = { email: "", isAuthenticated: false, name: "" }, viewport = { height: 0, isDesktop: false, isMobile: false, isTablet: false, name: "", orientation: "", width: 0 }, website = { description: "", name: "" }) {
  const cache = new WeakMap();

  const context = {
    componentIndex,
    modelScope: pageData,
    models,
    nowTick,
    pageData,
    platformUser: {
      email: platformUser?.email ?? "",
      isAuthenticated: platformUser?.isAuthenticated ?? false,
      isAdmin: platformUser?.isAdmin ?? false,
      isOwner: platformUser?.isOwner ?? false,
    },
    relationIndexes,
    socketDataArray,
    socketStatus,
    state,
    user: {
      email: user?.email ?? "",
      isAuthenticated: user?.isAuthenticated ?? false,
      name: user?.name ?? "",
    },
    viewport: {
      height: viewport?.height ?? 0,
      isDesktop: viewport?.isDesktop ?? false,
      isMobile: viewport?.isMobile ?? false,
      isTablet: viewport?.isTablet ?? false,
      name: viewport?.name ?? "",
      orientation: viewport?.orientation ?? "",
      width: viewport?.width ?? 0,
    },
    website: {
      description: website?.description ?? "",
      language: website?.defaultLanguage ?? "en",
      name: website?.name ?? "",
    },
  };

  function castFinal(value, type) {
    switch (type) {
      case "array":
        return Array.isArray(value) ? value : [];
      case "boolean":
        return coercion.boolean(value);
      case "color":
        return coercion.string(value);
      case "items":
        return Array.isArray(value) ? value : [];
      case "number":
        return coercion.number(value);
      case "object":
        return typeof value === "object" ? value : null;
      case "select":
        return coercion.string(value);
      case "string":
        return coercion.string(value);
      case "switch":
        return coercion.boolean(value);
      case "text":
        return coercion.string(value);
      case "textarea":
        return coercion.string(value);
      default:
        return value;
    }
  }

  function collectDependencies(node, deps = new Set()) {
    if (!node || typeof node !== "object") {
      return deps;
    }

    switch (node.type) {
      case "canvasDeltaTime":
        deps.add("state.runtime.canvas.frame.delta");

        break;
      case "canvasFPS":
        deps.add("state.runtime.canvas.frame.fps");

        break;
      case "canvasFrame":
        deps.add("state.runtime.canvas.frame.count");

        break;
      case "canvasHeight":
        deps.add("state.runtime.canvas.height");

        break;
      case "canvasKeyDown":
        deps.add("state.runtime.canvas.keyboard.keys." + node.key); //Probably not working?

        break;
      case "canvasMouseButton":
        deps.add("state.runtime.canvas.mouse.button");

        break;
      case "canvasMouseDown":
        deps.add("state.runtime.canvas.mouse.down");

        break;
      case "canvasMouseMoved":
        deps.add("state.runtime.canvas.mouse.moved");

        break;
      case "canvasMousePressed":
        deps.add("state.runtime.canvas.mouse.pressed");

        break;
      case "canvasMouseReleased":
        deps.add("state.runtime.canvas.mouse.released");

        break;
      case "canvasMouseWheel":
        deps.add("state.runtime.canvas.mouse.wheel");

        break;
      case "canvasMouseX":
        deps.add("state.runtime.canvas.mouse.x");

        break;
      case "canvasMouseY":
        deps.add("state.runtime.canvas.mouse.y");

        break;
      case "canvasTime":
        deps.add("state.runtime.canvas.frame.time");

        break;
      case "canvasWidth":
        deps.add("state.runtime.canvas.width");

        break;
      case "isDesktop":
        deps.add("viewport.isDesktop");

        break;
      case "isLandscape":
        deps.add("viewport.orientation");

        break;
      case "isMobile":
        deps.add("viewport.isMobile");

        break;
      case "isPlatformUserAdmin":
        deps.add("platformUser.isAdmin");

        break;
      case "isPlatformUserAuthenticated":
        deps.add("platformUser.isAuthenticated");

        break;
      case "isPlatformUserWebsiteOwner":
        deps.add("platformUser.isOwner");

        break;
      case "isPortrait":
        deps.add("viewport.orientation");

        break;
      case "isSocketConnected":
        deps.add("socketStatus");

        break;
      case "isSocketDisconnected":
        deps.add("socketStatus");

        break;
      case "isSocketReconnecting":
        deps.add("socketStatus");

        break;
      case "isTablet":
        deps.add("viewport.isTablet");

        break;
      case "isUserAuthenticated":
        deps.add("user.isAuthenticated");

        break;
      case "lookup":
        deps.add("pageData");

        break;
      case "now":
        deps.add("nowTick");

        break;
      case "path":
        deps.add("model." + node.value);

        break;
      case "platformUserEmail":
        deps.add("platformUser.email");

        break;
      case "prop":
        deps.add(`${node.componentId}.${node.prop}`);

        break;
      case "socketData":
        deps.add("state.runtime.socket.data");

        break;
      case "socketDataArray":
        deps.add("socketDataArray");

        break;
      case "state":
        deps.add("state");

        break;
      case "userEmail":
        deps.add("user.email");

        break;
      case "userName":
        deps.add("user.name");

        break;
      case "viewportOrientation":
        deps.add("viewport.orientation");

        break;
      case "viewportWidth":
        deps.add("viewport.width");

        break;
      case "viewportHeight":
        deps.add("viewport.height");

        break;
      case "websiteDescription":
        deps.add("website.description");

        break;
      case "websiteLanguage":
        deps.add("website.language");

        break;
      case "websiteName":
        deps.add("website.name");

        break;
      default:
        break;
    }

    if (Array.isArray(node)) {
      node.forEach((v) => collectDependencies(v, deps));
    } else {
      Object.values(node).forEach((value) => {
        if (Array.isArray(value)) {
          value.forEach((v) => collectDependencies(v, deps));
        } else if (value && typeof value === "object") {
          collectDependencies(value, deps);
        }
      });
    }

    return deps;
  }

  function compileExpression(ast) {
    const code = compileNode(ast);

    const fn = new Function("ctx", "get", "coerce", "deepCount", "deepEvery", "deepFilter", "deepFirstNonNullable", "deepFlatMap", "deepFlatten", "deepMap", "deepReduce", "deepSome", "isEmail", `const v = ${code}; return v;`);

    return (context) => fn(context, getValueByPath, coercion, deepCount, deepEvery, deepFilter, deepFirstNonNullable, deepFlatMap, deepFlatten, deepMap, deepReduce, deepSome, isEmail);
  }

  function executeExpression(ast, modelScope = null, ctx = context) {
    if (!ast) {
      return undefined;
    }

    let fn = cache.get(ast);

    if (!fn) {
      fn = compileExpression(ast);

      cache.set(ast, fn);
    }

    const result = fn(modelScope !== null && modelScope !== undefined ? { ...ctx, modelScope } : ctx);

    return result;
  }

  function setComponentIndex(componentIndex) {
    context.componentIndex = componentIndex;
  }

  function setModels(models) {
    context.models = models;
  }

  function setNowTick(nowTick) {
    context.nowTick = nowTick;
  }

  function setPageData(pageData) {
    context.pageData = pageData;
  }

  function setPlatformUser(platformUser) {
    context.platformUser = platformUser;
  }

  function setRelationIndexes(relationIndexes) {
    context.relationIndexes = relationIndexes;
  }

  function setSocketDataArray(socketDataArray) {
    context.socketDataArray = socketDataArray;
  }

  function setSocketStatus(socketStatus) {
    context.socketStatus = socketStatus;
  }

  function setState(state) {
    context.state = state;
  }

  function setUser(user) {
    context.user = user;
  }

  function setViewport(viewport) {
    context.viewport = viewport;
  }

  function setWebsite(website) {
    context.website = website;
  }

  //Implementation details:

  function compileNode(node, scope = "ctx.modelScope") {
    if (!node || typeof node !== "object" || Array.isArray(node)) {
      return "null";
    }

    const q = (v) => JSON.stringify(v);

    switch (node.type) {
      case "abs":
        return `Math.abs(coerce.number(${compileNode(node.value, scope)}))`;
      case "acos":
        return `Math.acos(coerce.number(${compileNode(node.x, scope)}))`;
      case "acosh":
        return `Math.acosh(coerce.number(${compileNode(node.x, scope)}))`;
      case "add":
        return `deepReduce([${node.values.map((n) => compileNode(n, scope)).join(",")}], (sum, value) => sum + coerce.number(value), 0)`;
      case "all":
        return `(() => {
        const array = ${compileNode(node.array, scope)};

        if (!Array.isArray(array)) {
          return true;
        }

        function all(value) {
          if(Array.isArray(value)) {
            return value.every(v => all(v));
          } else {
            return coerce.boolean(value);
          }
        }

        return array.every(value => all(value));
      })()`;
      case "and":
        return `deepEvery([${node.values.map((n) => compileNode(n, scope)).join(",")}], value => coerce.boolean(value))`;
      case "any":
        return `(() => {
        const array = ${compileNode(node.array, scope)};

        if (!Array.isArray(array)) {
          return false;
        }

        function any(value) {
          if(Array.isArray(value)) {
            return value.some(v => any(v));
          } else {
            return coerce.boolean(value);
          }
        }

        return array.some(value => any(value));
      })()`;
      case "asin":
        return `Math.asin(coerce.number(${compileNode(node.x, scope)}))`;
      case "asinh":
        return `Math.asinh(coerce.number(${compileNode(node.x, scope)}))`;
      case "atan":
        return `Math.atan(coerce.number(${compileNode(node.x, scope)}))`;
      case "atan2":
        return `Math.atan2(coerce.number(${compileNode(node.y, scope)}), coerce.number(${compileNode(node.x, scope)}))`;
      case "atanh":
        return `Math.atanh(coerce.number(${compileNode(node.x, scope)}))`;
      case "average":
        return `(() => {
        const flat = deepFlatten(${compileNode(node.array, scope)});

        if (flat.length === 0) {
          return 0;
        }

        const sum = flat.reduce((acc, value) => {
          return acc + coerce.number(value);
        }, 0);

        return sum / flat.length;
      })()`;
      case "canvasDeltaTime":
        return 'coerce.number(get(ctx.state, "runtime.canvas.frame.delta"))';
      case "canvasFPS":
        return 'coerce.number(get(ctx.state, "runtime.canvas.frame.fps"))';
      case "canvasFrame":
        return 'coerce.number(get(ctx.state, "runtime.canvas.frame.count"))';
      case "canvasHeight":
        return 'coerce.number(get(ctx.state, "runtime.canvas.height"))';
      case "canvasKeyDown":
        return `coerce.boolean(get(ctx.state, "runtime.canvas.keyboard.keys." + coerce.string(${compileNode(node.key, scope)})))`;
      case "canvasMouseButton":
        return 'coerce.string(get(ctx.state, "runtime.canvas.mouse.button"))';
      case "canvasMouseDown":
        return 'coerce.boolean(get(ctx.state, "runtime.canvas.mouse.down"))';
      case "canvasMouseMoved":
        return 'coerce.boolean(get(ctx.state, "runtime.canvas.mouse.moved"))';
      case "canvasMousePressed":
        return 'coerce.boolean(get(ctx.state, "runtime.canvas.mouse.pressed"))';
      case "canvasMouseReleased":
        return 'coerce.boolean(get(ctx.state, "runtime.canvas.mouse.released"))';
      case "canvasMouseWheel":
        return 'coerce.number(get(ctx.state, "runtime.canvas.mouse.wheel"))';
      case "canvasMouseX":
        return 'coerce.number(get(ctx.state, "runtime.canvas.mouse.x"))';
      case "canvasMouseY":
        return 'coerce.number(get(ctx.state, "runtime.canvas.mouse.y"))';
      case "canvasTime":
        return 'coerce.number(get(ctx.state, "runtime.canvas.frame.time"))';
      case "canvasWidth":
        return 'coerce.number(get(ctx.state, "runtime.canvas.width"))';
      case "ceil":
        return `Math.ceil(coerce.number(${compileNode(node.value, scope)}))`;
      case "clamp":
        return `Math.min(coerce.number(${compileNode(node.max, scope)}), Math.max(coerce.number(${compileNode(node.min, scope)}), coerce.number(${compileNode(node.value, scope)})))`;
      case "coalesce":
        return `deepFirstNonNullable([${node.values.map((n) => compileNode(n, scope)).join(",")}])`;
      case "concat":
        return `deepFlatten([${node.values.map((v) => compileNode(v, scope)).join(",")}]).map(coerce.string).join("")`;
      case "contains":
        return `(() => {
        const value = ${compileNode(node.value, scope)};
        const search = ${compileNode(node.search, scope)};

        return coerce.string(value).includes(coerce.string(search));
      })()`;
      case "cos":
        return `Math.cos(coerce.number(${compileNode(node.x, scope)}))`;
      case "cosh":
        return `Math.cosh(coerce.number(${compileNode(node.x, scope)}))`;
      case "count":
        return `deepCount(${compileNode(node.array, scope)})`;
      case "dateAdd":
        return `(() => {
        const input = ${compileNode(node.date, scope)};
        const amount = coerce.number(${compileNode(node.amount, scope)});
        const unit = ${JSON.stringify(node.unit || "days")};
        const date = new Date(input);

        if (isNaN(date.getTime())) {
          return 0;
        }

        switch (unit) {
          case "seconds":
            date.setSeconds(date.getSeconds() + amount);

            break;
          case "minutes":
            date.setMinutes(date.getMinutes() + amount);

            break;
          case "hours":
            date.setHours(date.getHours() + amount);

            break;
          case "days":
            date.setDate(date.getDate() + amount);

            break;
          case "months":
            date.setMonth(date.getMonth() + amount);

            break;
          case "years":
            date.setFullYear(date.getFullYear() + amount);

            break;
          default:
            date.setDate(date.getDate() + amount);

            break;
        }

        return date.getTime();
      })()`;
      case "dateDiff":
        return `(() => {
        const a = new Date(${compileNode(node.start, scope)});
        const b = new Date(${compileNode(node.end, scope)});

        if (isNaN(a.getTime()) || isNaN(b.getTime())) {
          return 0;
        }

        const unit = ${JSON.stringify(node.unit || "days")};
        const difference = b - a;

        switch (unit) {
          case "seconds":
            return Math.floor(difference / 1000);
          case "minutes":
            return Math.floor(difference / (1000 * 60));
          case "hours":
            return Math.floor(difference / (1000 * 60 * 60));
          case "days":
            return Math.floor(difference / (1000 * 60 * 60 * 24));
          default:
            return difference;
        }
      })()`;
      case "datePart":
        return `(() => {
        const date = new Date(${compileNode(node.date, scope)});
        const part = ${JSON.stringify(node.part)};

        if (isNaN(date.getTime())) {
          return 0;
        }

        switch (part) {
          case "year":
            return date.getFullYear();
          case "month":
            return date.getMonth() + 1;
          case "day":
            return date.getDate();
          case "hour":
            return date.getHours();
          case "minute":
            return date.getMinutes();
          case "second":
            return date.getSeconds();
          default:
            return 0;
        }
      })()`;
      case "degreesToRadians":
        return `(coerce.number(${compileNode(node.degrees, scope)}) * Math.PI / 180)`;
      case "distinct":
        return `(() => {
        return Array.from(new Set(deepFlatten(${compileNode(node.array, scope)}).map(v => JSON.stringify(v)))).map(v => JSON.parse(v));
      })()`;
      case "divide":
        return `(() => {
        const left = coerce.number(${compileNode(node.left, scope)});
        const right = coerce.number(${compileNode(node.right, scope)});

        if (right === 0) {
          return 0;
        }

        return left / right;
      })()`;
      case "equals":
        return `(Object.is(${compileNode(node.left, scope)}, ${compileNode(node.right, scope)}))`;
      case "filter":
        return `(() => {
        const value = ${compileNode(node.array, scope)};
        const recursive = coerce.boolean(${compileNode(node.recursive, scope)});

        function filter(input) {
          if (!Array.isArray(input)) {
            return coerce.boolean(${compileNode(node.condition, "input")}) ? input : undefined;
          }

          const result = input.map(item => {
            if (recursive || !Array.isArray(item)) {
              return filter(item);
            }

            return coerce.boolean(${compileNode(node.condition, "item")}) ? item : undefined;
          }).filter(item => item !== undefined);

          return result;
        }

        return Array.isArray(value) ? filter(value) : [];
      })()`;
      case "first":
        return `(() => {
        const flat = deepFlatten(${compileNode(node.array, scope)});

        return flat.length ? flat[0] : null;
      })()`;
      case "floor":
        return `Math.floor(coerce.number(${compileNode(node.value, scope)}))`;
      case "formatDate":
        return `(() => {
        const date = new Date(${compileNode(node.date, scope)});
        const locale = coerce.string(${compileNode(node.locale, scope)});

        if (isNaN(date.getTime()) || !locale) {
          return "";
        }

        try {
          return date.toLocaleString(locale, {
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
          });
        } catch(error) {
          return "";
        }
      })()`;
      case "getByKey":
        return `(coerce.object(${compileNode(node.object, scope)})?.[coerce.string(${compileNode(node.key, scope)})] ?? null)`;
      case "greaterThan":
        return `(coerce.number(${compileNode(node.left, scope)}) > coerce.number(${compileNode(node.right, scope)}))`;
      case "greaterThanOrEqualTo":
        return `(coerce.number(${compileNode(node.left, scope)}) >= coerce.number(${compileNode(node.right, scope)}))`;
      case "groupBy":
        return `(() => {
        const array = deepFlatten(${compileNode(node.array, scope)});
        const groups = new Map();

        array.forEach(item => {
          const key = ${compileNode(node.key, "item")};
          const keyStr = JSON.stringify(key);

          if (!groups.has(keyStr)) {
            groups.set(keyStr, {
              key,
              items: [],
            });
          }

          groups.get(keyStr).items.push(item);
        });

        return Array.from(groups.values());
      })()`;
      case "hoursToMilliseconds":
        return `(coerce.number(${compileNode(node.hours, scope)}) * (60 * 60 * 1000))`;
      case "hoursToMinutes":
        return `(coerce.number(${compileNode(node.hours, scope)}) * 60)`;
      case "hoursToSeconds":
        return `(coerce.number(${compileNode(node.hours, scope)}) * (60 * 60))`;
      case "if":
        return `(coerce.boolean(${compileNode(node.condition, scope)}) ? ${compileNode(node.then, scope)} : ${compileNode(node.else, scope)})`;
      case "includes":
        return `deepFlatten(${compileNode(node.value, scope)}).some(v => Object.is(v, ${compileNode(node.search, scope)}))`;
      case "isDesktop":
        return "(ctx.viewport?.isDesktop === true)";
      case "isEmail":
        return `isEmail(coerce.string(${compileNode(node.value, scope)}))`;
      case "isLandscape":
        return '(ctx.viewport?.orientation === "landscape")';
      case "isMobile":
        return "(ctx.viewport?.isMobile === true)";
      case "isPlatformUserAdmin":
        return "(ctx.platformUser?.isAdmin === true)";
      case "isPlatformUserAuthenticated":
        return "(ctx.platformUser?.isAuthenticated === true)";
      case "isPlatformUserWebsiteOwner":
        return "(ctx.platformUser?.isOwner === true)";
      case "isPortrait":
        return '(ctx.viewport?.orientation === "portrait")';
      case "isSocketConnected":
        return '(ctx.socketStatus === "Connected")';
      case "isSocketDisconnected":
        return '(ctx.socketStatus === "Disconnected")';
      case "isSocketReconnecting":
        return '(ctx.socketStatus === "Reconnecting")';
      case "isTablet":
        return "(ctx.viewport?.isTablet === true)";
      case "isUserAuthenticated":
        return "(ctx.user?.isAuthenticated === true)";
      case "join":
        return `deepFlatten(${compileNode(node.array, scope)}).join(coerce.string(${compileNode(node.separator, scope)}))`;
      case "last":
        return `(() => {
        const flat = deepFlatten(${compileNode(node.array, scope)});

        return flat.length ? flat[flat.length - 1] : null;
      })()`;
      case "length":
        return `deepCount(${compileNode(node.array, scope)})`;
      case "lessThan":
        return `(coerce.number(${compileNode(node.left, scope)}) < coerce.number(${compileNode(node.right, scope)}))`;
      case "lessThanOrEqualTo":
        return `(coerce.number(${compileNode(node.left, scope)}) <= coerce.number(${compileNode(node.right, scope)}))`;
      case "literal":
        return `(${JSON.stringify(node.value ?? null)})`;
      case "lookup":
        return `(() => {
        const array = deepFlatten(${compileNode(node.array, scope)});
        const foreign = ctx.pageData?.[${JSON.stringify(node.from)}] || [];

        if (!Array.isArray(array)) {
          return [];
        }

        return array.map(item => {
          const localValue = get(item, ${q(node.localField)});
          const matches = foreign.filter(f => Object.is(get(f, ${q(node.foreignField)}), localValue));

          return {
            ...item,
            [${q(node.as)}]: matches
          };
        });
      })()`;
      case "lowercase":
        return `coerce.string(${compileNode(node.value, scope)}).toLowerCase()`;
      case "map":
        return `deepMap(${compileNode(node.array, scope)}, item => (${compileNode(node.expression, "item")}))`;
      case "max":
        return `(() => {
        const flat = deepFlatten(${compileNode(node.array, scope)}).map(coerce.number);

        return flat.length ? Math.max(...flat) : 0;
      })()`;
      case "millisecondsToHours":
        return `(coerce.number(${compileNode(node.milliseconds, scope)}) / (60 * 60 * 1000))`;
      case "millisecondsToMinutes":
        return `(coerce.number(${compileNode(node.milliseconds, scope)}) / (60 * 1000))`;
      case "millisecondsToSeconds":
        return `(coerce.number(${compileNode(node.milliseconds, scope)}) / 1000)`;
      case "min":
        return `(() => {
        const flat = deepFlatten(${compileNode(node.array, scope)}).map(coerce.number);

        return flat.length ? Math.min(...flat) : 0;
      })()`;
      case "minutesToHours":
        return `(coerce.number(${compileNode(node.minutes, scope)}) / 60)`;
      case "minutesToMilliseconds":
        return `(coerce.number(${compileNode(node.minutes, scope)}) * (60 * 1000))`;
      case "minutesToSeconds":
        return `(coerce.number(${compileNode(node.minutes, scope)}) * 60)`;
      case "multiply":
        return `deepReduce([${node.values.map((n) => compileNode(n, scope)).join(",")}], (acc, value) => acc * coerce.number(value), 1)`;
      case "not":
        return `(!(coerce.boolean(${compileNode(node.value, scope)})))`;
      case "now":
        return `(new Date(ctx.nowTick).getTime())`;
      case "object":
        return `({
        ${Object.entries(node.fields)
          .map(([key, value]) => `${JSON.stringify(key)}: ${compileNode(value, scope)}`)
          .join(",")}
      })`;
      case "or":
        return `deepSome([${node.values.map((n) => compileNode(n, scope)).join(",")}], value => coerce.boolean(value))`;
      case "PI":
        return "Math.PI";
      case "path":
        if (node.value === "" || node.value === "__item__") {
          return scope;
        }

        return `get(${scope}, ${q(node.value ?? node.path ?? "")})`;
      case "pipeline":
        return `(() => {
        let result = ${compileNode(node.input, scope)};

        ${node.stages.map((stage) => `result = ${compileNode(stage, "result")};`).join("")}

        return result;
      })()`;
      case "platformUserEmail":
        return `(typeof ctx.platformUser?.email === "string" ? ctx.platformUser.email : "")`;
      case "pow":
        return `Math.pow(coerce.number(${compileNode(node.base, scope)}), coerce.number(${compileNode(node.exponent, scope)}))`;
      case "prop":
        return `ctx.componentIndex?.[${q(node.componentId)}]?.props?.[${q(node.prop)}]`;
      case "radiansToDegrees":
        return `(coerce.number(${compileNode(node.radians, scope)}) * 180 / Math.PI)`;
      case "random":
        return `(() => {
        const minOrMax = coerce.number(${compileNode(node.min, scope)});
        const maxOrMin = coerce.number(${compileNode(node.max, scope)});
        const min = Math.min(minOrMax, maxOrMin);
        const max = Math.max(minOrMax, maxOrMin);
        const random = Math.random() * (max - min) + min;

        return random;
      })()`;
      case "range":
        return `(() => {
        const n = coerce.number(${compileNode(node.count, scope)});

        if (!isFinite(n) || n <= 0) {
          return [];
        }

        return Array.from({ length: Math.floor(n) }, (_, i) => i);
      })()`;
      case "replace":
        return `(() => {
        const value = coerce.string(${compileNode(node.value, scope)});
        const search = coerce.string(${compileNode(node.search, scope)});
        const replace = coerce.string(${compileNode(node.replace, scope)});

        if (search === "") {
          return value;
        }

        return value.split(search).join(replace);
      })()`;
      case "round":
        return `Math.round(coerce.number(${compileNode(node.value, scope)}))`;
      case "secondsToHours":
        return `(coerce.number(${compileNode(node.seconds, scope)}) / (60 * 60))`;
      case "secondsToMilliseconds":
        return `(coerce.number(${compileNode(node.seconds, scope)}) * 1000)`;
      case "secondsToMinutes":
        return `(coerce.number(${compileNode(node.seconds, scope)}) / 60)`;
      case "sin":
        return `Math.sin(coerce.number(${compileNode(node.x, scope)}))`;
      case "sinh":
        return `Math.sinh(coerce.number(${compileNode(node.x, scope)}))`;
      case "socketData":
        return 'get(ctx.state, "runtime.socket.data")';
      case "socketDataArray":
        return "(Array.isArray(ctx.socketDataArray) ? ctx.socketDataArray : [])";
      case "sort":
        return `(() => {
        const array = deepFlatten(${compileNode(node.array, scope)});

        if (!Array.isArray(array)) {
          return [];
        }

        const direction = ${JSON.stringify(node.direction)} === "desc" ? -1 : 1;

        return [...array].sort((a, b) => {
          const valueA = ${compileNode(node.value, "a")};
          const valueB = ${compileNode(node.value, "b")};

          if (valueA < valueB) {
            return -1 * direction;
          }

          if (valueA > valueB) {
            return +1 * direction;
          }

          return 0;
        });
      })()`;
      case "split":
        return `coerce.string(${compileNode(node.value, scope)}).split(coerce.string(${compileNode(node.separator, scope)}))`;
      case "sqrt":
        return `Math.sqrt(coerce.number(${compileNode(node.value, scope)}))`;
      case "state":
        if (node.value === "" || node.value === "__item__") {
          return "ctx.state";
        }

        return `get(ctx.state, ${q(node.value ?? "")})`;
      case "stringLength":
        return `coerce.string(${compileNode(node.value, scope)}).length`;
      case "substring":
        return `(() => {
        const start = coerce.number(${compileNode(node.start, scope)});
        const length = coerce.number(${compileNode(node.length, scope)});

        return coerce.string(${compileNode(node.value, scope)}).substring(start, start + length);
      })()`;
      case "subtract":
        return `(coerce.number(${compileNode(node.left, scope)}) - coerce.number(${compileNode(node.right, scope)}))`;
      case "sum":
        return `deepReduce(${compileNode(node.array, scope)}, (sum, value) => sum + coerce.number(value), 0)`;
      case "tan":
        return `Math.tan(coerce.number(${compileNode(node.x, scope)}))`;
      case "tanh":
        return `Math.tanh(coerce.number(${compileNode(node.x, scope)}))`;
      case "toArray":
        return `coerce.array(${compileNode(node.value, scope)})`;
      case "toBoolean":
        return `coerce.boolean(${compileNode(node.value, scope)})`;
      case "toNumber":
        return `coerce.number(${compileNode(node.value, scope)})`;
      case "toObject":
        return `coerce.object(${compileNode(node.value, scope)})`;
      case "toString":
        return `coerce.string(${compileNode(node.value, scope)})`;
      case "trim":
        return `coerce.string(${compileNode(node.value, scope)}).trim()`;
      case "uppercase":
        return `coerce.string(${compileNode(node.value, scope)}).toUpperCase()`;
      case "userEmail":
        return `(typeof ctx.user?.email === "string" ? ctx.user.email : "")`;
      case "userName":
        return `(typeof ctx.user?.name === "string" ? ctx.user.name : "")`;
      case "viewportOrientation":
        return `(typeof ctx.viewport?.orientation === "string" ? ctx.viewport.orientation : "portrait")`;
      case "viewportWidth":
        return `(typeof ctx.viewport?.width === "number" ? ctx.viewport.width : 0)`;
      case "viewportHeight":
        return `(typeof ctx.viewport?.height === "number" ? ctx.viewport.height : 0)`;
      case "websiteDescription":
        return `(typeof ctx.website?.description === "string" ? ctx.website.description : "")`;
      case "websiteLanguage":
        return '(ctx.website?.language === "en" ? "en" : ctx.website?.language === "sv" ? "sv" : "en")';
      case "websiteName":
        return `(typeof ctx.website?.name === "string" ? ctx.website.name : "")`;
      default:
        return "null";
    }
  }

  function deepCount(value) {
    return deepReduce(value, (count) => count + 1, 0);
  }

  function deepEvery(value, predicate) {
    return deepFlatten(value).every(predicate);
  }

  function deepFilter(value, predicate) {
    if (!Array.isArray(value)) {
      return predicate(value) ? [value] : [];
    }

    return value.flatMap((v) => deepFilter(v, predicate));
  }

  function deepFirstNonNullable(value) {
    const flat = deepFlatten(value);

    for (const item of flat) {
      if (item !== null && item !== undefined) {
        return item;
      }
    }

    return null;
  }

  function deepFlatMap(value, mapper) {
    return deepFlatten(value).map(mapper);
  }

  function deepFlatten(value) {
    if (Array.isArray(value)) {
      return value.flatMap(deepFlatten);
    }

    return [value];
  }

  function deepMap(value, mapper) {
    if (Array.isArray(value)) {
      return value.map((v) => deepMap(v, mapper));
    }

    return mapper(value);
  }

  function deepReduce(value, reducer, initial) {
    let acc = initial;

    const visit = (v) => {
      if (Array.isArray(v)) {
        for (const item of v) {
          visit(item);
        }
      } else {
        acc = reducer(acc, v);
      }
    };

    visit(value);

    return acc;
  }

  function deepSome(value, predicate) {
    return deepFlatten(value).some(predicate);
  }

  return {
    castFinal,
    collectDependencies,
    compileExpression,
    context,
    executeExpression,
    setComponentIndex,
    setModels,
    setNowTick,
    setPageData,
    setPlatformUser,
    setRelationIndexes,
    setSocketDataArray,
    setSocketStatus,
    setState,
    setUser,
    setViewport,
    setWebsite,
  };
}
