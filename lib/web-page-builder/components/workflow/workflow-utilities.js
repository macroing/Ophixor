// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { clone } from "../../transform/core/clone";
import { generateId } from "../../page/identity/generateId";
import { getActionSchema } from "../runtime/action/action-schema";
import { getExpressionSchema } from "../runtime/expression/expression-schema";
import { sanitizeAction, sanitizeExpression } from "../../validation/sanitizers";

export const NODE_WIDTH = 240;
export const NODE_HEIGHT = 40;

export const H_GAP = 80;
export const V_GAP = 120;

export const GRID_SIZE = 20;

export const SNAP_DISTANCE = 10;

export const SIZE_PER_BLOCK = 40;
export const SIZE_PER_COUNT = 24;
export const SIZE_PER_SPACE = 8;

export const ACTION_SCHEMA = getActionSchema();

export const EXPRESSION_SCHEMA = getExpressionSchema();

/*
 * Edge direction convention:
 *
 * Edges point FROM the node that owns or consumes a dependency and TO the node that produces the value.
 *
 * Example:
 * Action parameter -> Expression
 *
 * This means graph traversal follows dependency ownership and not runtime execution or dataflow direction.
 */

export function actionToWorkflow(action, oldGraph = null) {
  if (!action) {
    return {
      nodes: {},
      edges: [],
    };
  }

  return layoutWorkflow([action], null, oldGraph);
}

export function addDynamicPort(node, key, port) {
  return {
    ...node,
    data: {
      ...node.data,
      dynamicPorts: {
        ...node.data.dynamicPorts,
        [key]: [...getDynamicPorts(node.data, key), port],
      },
    },
  };
}

export function canConnect(from, to, graph = null) {
  if (from.nodeId === to.nodeId) {
    return false;
  }

  if ((from.port === "input" && to.port === "output") || (from.port === "output" && to.port === "input")) {
    const actualFrom = from.port === "input" ? from : to;
    const actualTo = to.port === "output" ? to : from;

    if (actualTo.nodeKind === "action") {
      return actualFrom.nodeKind === "action";
    }

    if (!actualFrom.portData) {
      return false;
    }

    if (graph) {
      const inputPortId = resolvePortId(actualFrom.port, actualFrom.portData);

      const outputPortId = resolvePortId(actualTo.port, actualTo.portData);

      const isInputUsed = isPortConnected(graph, actualFrom.nodeId, inputPortId, "from");

      const isOutputUsed = isPortConnected(graph, actualTo.nodeId, outputPortId, "to");

      if (isInputUsed || isOutputUsed) {
        return false;
      }
    }

    const fromSchema = actualFrom?.schema;
    const fromType = fromSchema?.itemType || fromSchema?.type;

    const toSchema = actualTo?.schema;
    const toType = toSchema?.returnType;

    return canConnectByType(fromType, toType);
  }

  return false;
}

export function castExpressionToType(expression, expectedType) {
  if (!expression || !expectedType) {
    return expression;
  }

  const actualType = EXPRESSION_SCHEMA[expression?.type]?.returnType;

  if (canConnectByType(actualType, expectedType)) {
    return expression;
  }

  switch (expectedType) {
    case "array":
      return {
        id: generateId("expression"),
        type: "toArray",
        value: isExpressionWrapper(expression) ? expression.expression : expression,
      };
    case "boolean":
      return {
        id: generateId("expression"),
        type: "toBoolean",
        value: isExpressionWrapper(expression) ? expression.expression : expression,
      };
    case "number":
      return {
        id: generateId("expression"),
        type: "toNumber",
        value: isExpressionWrapper(expression) ? expression.expression : expression,
      };
    case "string":
      return {
        id: generateId("expression"),
        type: "toString",
        value: isExpressionWrapper(expression) ? expression.expression : expression,
      };
    default:
      return expression;
  }
}

export function computeEdgeBounds(nodes, padding = 2000) {
  const nodeList = Object.values(nodes);

  if (nodeList.length === 0) {
    return {
      left: 0,
      top: 0,
      width: padding * 2,
      height: padding * 2,
    };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const node of nodeList) {
    minX = Math.min(minX, node.position.x);
    minY = Math.min(minY, node.position.y);
    maxX = Math.max(maxX, node.position.x + NODE_WIDTH);
    maxY = Math.max(maxY, node.position.y + getNodeHeight(node));
  }

  return {
    left: minX - padding,
    top: minY - padding,
    width: maxX - minX + padding * 2,
    height: maxY - minY + padding * 2,
  };
}

export function computeExportedNodeSet(graph, isExpressionOnly = false) {
  const exported = new Set();

  if (!graph?.nodes) {
    return exported;
  }

  function walk(nodeId) {
    if (!nodeId || exported.has(nodeId)) {
      return;
    }

    exported.add(nodeId);

    for (const edge of graph.edges) {
      if (edge.from.nodeId === nodeId) {
        walk(edge.to.nodeId);
      }
    }
  }

  if (isExpressionOnly) {
    const root = Object.values(graph.nodes).find((node) => {
      return (
        node.kind === "expression" &&
        !graph.edges.some((edge) => {
          return edge.type === "data" && edge.to.nodeId === node.id;
        })
      );
    });

    if (root) {
      walk(root.id);
    }
  } else {
    const root = Object.values(graph.nodes).find((node) => {
      return (
        node.kind === "action" &&
        !graph.edges.some((edge) => {
          return edge.type === "control" && edge.to.nodeId === node.id;
        })
      );
    });

    if (root) {
      walk(root.id);
    }
  }

  return exported;
}

export function computeSize(count, isInternalOnly = false, isExcludingPadding = false) {
  const internalSize = count * SIZE_PER_COUNT + (count > 0 ? (count - 1) * SIZE_PER_SPACE : 0) + (count > 0 ? 2 * SIZE_PER_SPACE : 0);

  if (isInternalOnly) {
    return internalSize;
  }

  const size = SIZE_PER_BLOCK + internalSize;

  if (isExcludingPadding) {
    return size;
  }

  const padding = size % SIZE_PER_BLOCK === 0 ? 0 : SIZE_PER_BLOCK - (size % SIZE_PER_BLOCK);

  return size + padding;
}

export function computeWorkflowCenterOffset(nodes, bounds, scale = 1) {
  const nodeList = Object.values(nodes || {});

  if (!nodeList.length || !bounds) {
    return { x: 0, y: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const node of nodeList) {
    const width = NODE_WIDTH;
    const height = getNodeHeight(node);

    minX = Math.min(minX, node.position.x);
    minY = Math.min(minY, node.position.y);

    maxX = Math.max(maxX, node.position.x + width);
    maxY = Math.max(maxY, node.position.y + height);
  }

  const workflowCenterX = (minX + maxX) / 2;
  const workflowCenterY = (minY + maxY) / 2;

  return {
    x: bounds.width / 2 - workflowCenterX * scale,
    y: bounds.height / 2 - workflowCenterY * scale,
  };
}

export function createDefaultAction(type) {
  if (typeof type !== "string") {
    return null;
  }

  const schema = ACTION_SCHEMA[type];

  if (!schema) {
    return null;
  }

  const action = {
    type,
    config: {
      id: generateId("action"),
      ...clone(Object.fromEntries(Object.entries(schema.parameters).map(([key, parameter]) => [key, parameter.defaultValue]))),
    },
    conditions: [],
    runAfter: [],
  };

  const sanitizedAction = sanitizeAction(action);

  return sanitizedAction;
}

export function createDefaultExpression(type) {
  if (typeof type !== "string") {
    return null;
  }

  const schema = EXPRESSION_SCHEMA[type];

  if (!schema) {
    return null;
  }

  const expression = {
    id: generateId("expression"),
    type,
    ...clone(Object.fromEntries(Object.entries(schema.parameters).map(([key, parameter]) => [key, parameter.defaultValue]))),
  };

  const sanitizedExpression = sanitizeExpression(expression);

  return sanitizedExpression;
}

export function createDynamicPort(id = generateId("port")) {
  return {
    id,
  };
}

export function createEdge({ graph, fromNodeId, fromPortId = "output", fromSchema = null, toNodeId, toPortId, type = "data" }) {
  const edge = {
    id: `${fromNodeId}-${fromPortId}-${toNodeId}-${toPortId}`,
    type,
    from: {
      nodeId: fromNodeId,
      portId: fromPortId,
      schema: fromSchema,
    },
    to: {
      nodeId: toNodeId,
      portId: toPortId,
    },
  };

  if (graph) {
    graph.edges.push(edge);
  }

  return edge;
}

export function expressionToWorkflow(expression, oldGraph = null) {
  if (!expression) {
    return {
      nodes: {},
      edges: [],
    };
  }

  return layoutWorkflow(null, [expression], oldGraph);
}

export function findClosestPort(fromPort, worldPos, nodes, graph = null) {
  let best = null;
  let bestDist = Infinity;

  const fromNode = nodes[fromPort.nodeId];

  if (!fromNode) {
    return null;
  }

  function testCandidate(node, port, portData = null) {
    if (node.id === fromNode.id || (portData && typeof portData === "object" && !Array.isArray(portData) && !portData.isConnectable)) {
      return;
    }

    const candidate = {
      nodeKind: node.kind,
      nodeId: node.id,
      port,
      portData,
      schema: portData?.schema ?? node?.schema,
    };

    if (!canConnect(fromPort, candidate, graph)) {
      return;
    }

    const pos = getPortPosition(node, port, portData);

    if (!pos) {
      return;
    }

    const dx = worldPos.x - pos.x;
    const dy = worldPos.y - pos.y;

    const dist = dx * dx + dy * dy;

    if (dist < 100 && dist < bestDist) {
      bestDist = dist;
      best = candidate;
    }
  }

  for (const node of Object.values(nodes)) {
    if (node.id === fromNode.id) {
      continue;
    } else if (node.kind === "action") {
      testCandidate(node, "output");

      testCandidate(node, "input");

      for (const inputPort of node.ports.inputs || []) {
        testCandidate(node, "input", inputPort);
      }
    } else if (node.kind === "expression") {
      testCandidate(node, "output");

      for (const inputPort of node.ports.inputs || []) {
        testCandidate(node, "input", inputPort);
      }
    }
  }

  return best;
}

export function findParentNodeFor(id, graph) {
  const edge = graph.edges.find((edge) => edge.to.nodeId === id);

  if (!edge) {
    return null;
  }

  return graph.nodes[edge.from.nodeId] || null;
}

export function getBezierPath(from, to) {
  const dy = Math.abs(to.y - from.y);

  const curve = Math.max(40, dy * 0.5);

  return `
    M ${from.x} ${from.y}
    C ${from.x} ${from.y + curve},
      ${to.x} ${to.y - curve},
      ${to.x} ${to.y}
  `;
}

export function getBezierPathDirectionAware(from, to) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  const isVertical = Math.abs(dy) > Math.abs(dx);

  if (isVertical) {
    const c = dy * 0.5;

    return `
      M ${from.x} ${from.y}
      C ${from.x} ${from.y + c},
        ${to.x} ${to.y - c},
        ${to.x} ${to.y}
    `;
  }

  const c = dx * 0.5;

  return `
    M ${from.x} ${from.y}
    C ${from.x + c} ${from.y},
      ${to.x - c} ${to.y},
      ${to.x} ${to.y}
  `;
}

export function getDynamicPorts(nodeData, key) {
  return Array.isArray(nodeData?.dynamicPorts?.[key]) ? nodeData.dynamicPorts[key] : [];
}

/*
 * This function returns the port for inputNode.
 *
 * This function assumes inputNode has an input port and outputNode has an output port.
 *
 * If inputNode is an action node with an input port on the bottom and outputNode is an action node with an output port at the top, then the returned port is on the bottom.
 *
 * If inputNode is an action node with an input port on the right side and outputNode is an expression node with an output port on the left side, then the returned port is on the right side.
 *
 * If inputNode is an expression node with an input port on the right side and outputNode is an expression node with an output port on the left side, then the returned port is on the right side.
 */
export function getEdgeInputOffset(inputNode, outputNode, edge) {
  if (inputNode.kind === "action") {
    if (outputNode.kind === "action") {
      return {
        x: NODE_WIDTH / 2,
        y: getNodeHeight(inputNode),
      };
    } else if (outputNode.kind === "expression") {
      const index = inputNode.ports.inputs.findIndex((port) => port.id === edge.from.portId);

      if (index === -1) {
        return null;
      }

      return {
        x: NODE_WIDTH,
        y: getInputPortY(index),
      };
    } else {
      return null;
    }
  } else if (inputNode.kind === "expression" && outputNode.kind === "expression") {
    const index = inputNode.ports.inputs.findIndex((port) => port.id === edge.from.portId);

    if (index === -1) {
      return null;
    }

    return {
      x: NODE_WIDTH,
      y: getInputPortY(index),
    };
  } else {
    return null;
  }
}

/*
 * This function returns the port for outputNode.
 *
 * This function assumes inputNode has an input port and outputNode has an output port.
 *
 * If inputNode is an action node with an input port on the bottom and outputNode is an action node with an output port at the top, then the returned port is at the top.
 *
 * If inputNode is an action node with an input port on the right side and outputNode is an expression node with an output port on the left side, then the returned port is on the left side.
 *
 * If inputNode is an expression node with an input port on the right side and outputNode is an expression node with an output port on the left side, then the returned port is on the left side.
 */
export function getEdgeOutputOffset(inputNode, outputNode) {
  if (inputNode.kind === "action") {
    if (outputNode.kind === "action") {
      return {
        x: NODE_WIDTH / 2,
        y: 0,
      };
    } else if (outputNode.kind === "expression") {
      return {
        x: 0,
        y: NODE_HEIGHT / 2,
      };
    } else {
      return null;
    }
  } else if (inputNode.kind === "expression" && outputNode.kind === "expression") {
    return {
      x: 0,
      y: NODE_HEIGHT / 2,
    };
  } else {
    return null;
  }
}

export function getNodeHeight(node) {
  return computeSize(node?.ports?.inputs?.length || 0);
}

export function getPortPosition(node, portType, portData) {
  switch (portType) {
    case "input":
      if (portData) {
        const index = node.ports.inputs.findIndex((p) => p.id === portData.id);

        switch (portData.side) {
          case "bottom":
            return {
              x: node.position.x + NODE_WIDTH / 2,
              y: node.position.y + getNodeHeight(node),
            };
          case "left":
            return {
              x: node.position.x,
              y: node.position.y + (index !== -1 ? getInputPortY(index) : NODE_HEIGHT / 2),
            };
          case "right":
            return {
              x: node.position.x + NODE_WIDTH,
              y: node.position.y + (index !== -1 ? getInputPortY(index) : NODE_HEIGHT / 2),
            };
          case "top":
            return {
              x: node.position.x + NODE_WIDTH / 2,
              y: node.position.y,
            };
          default:
            return null;
        }
      } else if (node.kind === "action") {
        return {
          x: node.position.x + NODE_WIDTH / 2,
          y: node.position.y + getNodeHeight(node),
        };
      } else {
        return null;
      }
    case "output":
      if (node.kind === "action") {
        return {
          x: node.position.x + NODE_WIDTH / 2,
          y: node.position.y,
        };
      } else if (node.kind === "expression") {
        return {
          x: node.position.x,
          y: node.position.y + NODE_HEIGHT / 2,
        };
      } else {
        return null;
      }
    default:
      return null;
  }
}

export function graphToWorkflow(graph) {
  const roots = Object.values(graph.nodes).filter((node) => {
    return node.kind === "action" && !graph.edges.some((edge) => edge.type === "control" && edge.to.nodeId === node.id);
  });

  return roots.map((node) => buildActionWorkflow(node.id, graph));
}

export function isNodeExported(nodeId, graph, isExpressionOnly = false) {
  return computeExportedNodeSet(graph, isExpressionOnly).has(nodeId);
}

export function isPortConnected(graph, nodeId, portId, direction = "either") {
  if (!graph?.edges) {
    return false;
  }

  return graph.edges.some((edge) => {
    const matchesFrom = edge.from.nodeId === nodeId && edge.from.portId === portId;

    const matchesTo = edge.to.nodeId === nodeId && edge.to.portId === portId;

    switch (direction) {
      case "from":
        return matchesFrom;
      case "to":
        return matchesTo;
      default:
        return matchesFrom || matchesTo;
    }
  });
}

export function isVariadicParameter(parameter) {
  if (Array.isArray(parameter.type)) {
    for (const currentType of parameter.type) {
      if (isVariadicParameter(currentType)) {
        return true;
      }
    }

    return false;
  }

  if (typeof parameter?.type !== "string") {
    return false;
  }

  return parameter.type.startsWith("array") || parameter.type === "object";
}

export function isVariadicParameterArray(parameter) {
  if (Array.isArray(parameter.type)) {
    for (const currentType of parameter.type) {
      if (isVariadicParameterArray(currentType)) {
        return true;
      }
    }

    return false;
  }

  if (typeof parameter?.type !== "string") {
    return false;
  }

  return parameter.type.startsWith("array");
}

export function layoutWorkflow(actions, expressions = null, oldGraph = null, position = null) {
  const result = workflowToGraph(actions, expressions, oldGraph);

  const graph = result.graph;
  const addedNodeIds = result.addedNodeIds;

  const childrenMap = {};
  const parentsCount = {};

  for (const id in graph.nodes) {
    childrenMap[id] = [];
    parentsCount[id] = 0;
  }

  for (const edge of graph.edges) {
    if (!childrenMap[edge.from.nodeId]) {
      continue;
    }

    if (parentsCount[edge.to.nodeId] === undefined) {
      continue;
    }

    childrenMap[edge.from.nodeId].push(edge.to.nodeId);
    parentsCount[edge.to.nodeId]++;
  }

  const roots = Object.keys(graph.nodes).filter((id) => parentsCount[id] === 0);

  const depthMap = {};

  function dfsDepth(id, depth) {
    if (depthMap[id] !== undefined && depthMap[id] <= depth) {
      return;
    }

    depthMap[id] = depth;

    for (const child of childrenMap[id]) {
      dfsDepth(child, depth + 1);
    }
  }

  roots.forEach((r) => dfsDepth(r, 0));

  let cursor = 0;

  const xMap = {};

  function dfsX(id) {
    const children = childrenMap[id] || [];

    if (!children.length) {
      xMap[id] = cursor++;

      return xMap[id];
    }

    const childXs = children.map(dfsX);

    const min = Math.min(...childXs);
    const max = Math.max(...childXs);

    xMap[id] = (min + max) / 2;

    return xMap[id];
  }

  roots.forEach(dfsX);

  let maximumNodeHeight = NODE_HEIGHT;

  for (const id in graph.nodes) {
    const node = graph.nodes[id];

    maximumNodeHeight = Math.max(maximumNodeHeight, getNodeHeight(node));
  }

  for (const id in graph.nodes) {
    const node = graph.nodes[id];

    if (!addedNodeIds.has(id)) {
      continue;
    }

    if (position) {
      node.position = {
        x: position.x,
        y: position.y,
      };
    } else if (node.kind === "action" || node.kind === "expression") {
      node.position = {
        x: (xMap[id] || 0) * (NODE_WIDTH + H_GAP),
        y: (depthMap[id] || 0) * (maximumNodeHeight + V_GAP),
      };
    }
  }

  const usedPositions = new Set();

  function key(x, y) {
    return `${x}|${y}`;
  }

  function occupy(x, y) {
    usedPositions.add(key(x, y));
  }

  function isFree(x, y) {
    return !usedPositions.has(key(x, y));
  }

  for (const node of Object.values(graph.nodes)) {
    if (node.kind === "action" || node.kind === "expression") {
      occupy(node.position.x, node.position.y);
    }
  }

  function getIncomingExpressions(nodeId) {
    return graph.edges
      .filter((edge) => {
        if (edge.type !== "data" && edge.type !== "condition") {
          return false;
        }

        return edge.from.nodeId === nodeId;
      })
      .map((edge) => graph.nodes[edge.to.nodeId])
      .filter((node) => node?.kind === "expression");
  }

  function getExpressionTreeHeight(nodeId, visited = new Set()) {
    if (visited.has(nodeId)) {
      return 0;
    }

    visited.add(nodeId);

    const node = graph.nodes[nodeId];

    if (!node) {
      return 0;
    }

    const incoming = getIncomingExpressions(nodeId);

    const ownHeight = getNodeHeight(node) + V_GAP;

    if (!incoming.length) {
      return ownHeight;
    }

    return (
      ownHeight +
      incoming.reduce((sum, child) => {
        return sum + getExpressionTreeHeight(child.id, new Set(visited));
      }, 0)
    );
  }

  function placeExpressionTree(node, anchorX, anchorY, depth = 1, visited = new Set()) {
    if (visited.has(node.id)) {
      return;
    }

    visited.add(node.id);

    const incoming = getIncomingExpressions(node.id);

    let currentY = anchorY;

    for (const exprNode of incoming) {
      if (!addedNodeIds.has(exprNode.id)) {
        continue;
      }

      const subtreeHeight = getExpressionTreeHeight(exprNode.id);

      let x = anchorX + depth * (NODE_WIDTH + H_GAP);
      let y = currentY;

      while (!isFree(x, y)) {
        y += V_GAP;
      }

      exprNode.position = {
        x,
        y,
      };

      occupy(x, y);

      placeExpressionTree(exprNode, anchorX, y, depth + 1, new Set(visited));

      currentY += subtreeHeight;
    }
  }

  for (const node of Object.values(graph.nodes)) {
    if (node.kind !== "action" && node.kind !== "expression") {
      continue;
    }

    placeExpressionTree(node, node.position.x, node.position.y);
  }

  let currentSequenceNumber = 1;

  for (const id in graph.nodes) {
    const node = graph.nodes[id];

    node.label = node.kind === "action" ? ACTION_SCHEMA[node.type]?.label || node.type : node.kind === "expression" ? EXPRESSION_SCHEMA[node.type]?.label || node.type : node.type;
    node.sequenceNumber = currentSequenceNumber++;
  }

  return graph;
}

export function removeDynamicPort(node, key, portId) {
  return {
    ...node,
    data: {
      ...node.data,
      dynamicPorts: {
        ...node.data.dynamicPorts,
        [key]: getDynamicPorts(node.data, key).filter((port) => port.id !== portId),
      },
    },
  };
}

export function removeEdgesForPort(graph, nodeId, portId) {
  graph.edges = graph.edges.filter((edge) => {
    return !((edge.from.nodeId === nodeId && edge.from.portId === portId) || (edge.to.nodeId === nodeId && edge.to.portId === portId));
  });
}

export function resolvePortId(port, portData = null) {
  if (portData?.id) {
    return portData.id;
  }

  return port;
}

export function screenToWorld(x, y, offset, scale, rect) {
  return {
    x: (x - rect.left - offset.x) / scale,
    y: (y - rect.top - offset.y) / scale,
  };
}

export function snap(value, gridSize = GRID_SIZE) {
  return Math.round(value / gridSize) * gridSize;
}

export function workflowToAction(graph, actionNodeId = null) {
  const actionNodes = Object.values(graph.nodes).filter((node) => {
    return node.kind === "action";
  });

  if (actionNodes.length === 0) {
    return null;
  }

  let rootId = actionNodeId;

  if (!rootId) {
    const root = actionNodes.find((node) => {
      return !graph.edges.some((edge) => {
        return (edge.type === "data" || edge.type === "condition") && edge.to.nodeId === node.id;
      });
    });

    rootId = root?.id;
  }

  if (!rootId) {
    return null;
  }

  return buildActionWorkflow(rootId, graph);
}

export function workflowToExpression(graph, expressionNodeId = null) {
  const expressionNodes = Object.values(graph.nodes).filter((node) => {
    return node.kind === "expression";
  });

  if (expressionNodes.length === 0) {
    return null;
  }

  let rootId = expressionNodeId;

  if (!rootId) {
    const root = expressionNodes.find((node) => {
      return !graph.edges.some((edge) => {
        return (edge.type === "data" || edge.type === "condition") && edge.to.nodeId === node.id;
      });
    });

    rootId = root?.id;
  }

  if (!rootId) {
    return null;
  }

  return buildExpressionWorkflow(rootId, graph);
}

export function workflowToGraph(actions, expressions = null, oldGraph = null, dataScope = null) {
  let graph = {
    nodes: {},
    edges: [],
  };

  const addedNodeIds = new Set();

  if (oldGraph) {
    graph = {
      nodes: clone(oldGraph.nodes),
      edges: clone(oldGraph.edges),
    };
  }

  function track(id) {
    if (id) {
      addedNodeIds.add(id);
    }
  }

  if (Array.isArray(actions)) {
    actions.forEach((action) => {
      buildAction(action, graph, ACTION_SCHEMA, EXPRESSION_SCHEMA, track, dataScope);
    });
  }

  if (Array.isArray(expressions)) {
    expressions.forEach((expression) => {
      const isExprNode = isExpressionNode(expression);
      const isExprWrapper = isExpressionWrapper(expression);

      if (!isExprNode && !isExprWrapper) {
        return;
      }

      buildExpression(isExprNode ? expression : expression.expression, graph, EXPRESSION_SCHEMA, track, dataScope);
    });
  }

  return {
    graph,
    addedNodeIds,
  };
}

function buildAction(actionToBuild, graph, actionSchema, expressionSchema, track, dataScope = null) {
  if (!actionToBuild) {
    return null;
  }

  const schema = actionSchema[actionToBuild.type];

  if (!schema) {
    return null;
  }

  const conditionSchema = schema.condition;

  const action = { ...actionToBuild };

  ensureDynamicPorts(action, schema);

  const node = createNode({
    id: action.config.id,
    kind: "action",
    type: action.type,
    data: action,
    schema,
    dataScope,
  });

  graph.nodes[node.id] = node;

  createOutputPort(node, "top", schema);

  const conditionPorts = getDynamicPorts(action, "conditions");

  conditionPorts.forEach((portInfo, index) => {
    createInputPort({
      node,
      key: "conditions",
      label: "Condition " + (portInfo.label || portInfo.id),
      dataType: "boolean",
      variadic: true,
      side: "right",
      subKey: portInfo.id,
      schema: conditionSchema,
    });
  });

  Object.entries(schema.parameters || {}).forEach(([key, parameter]) => {
    const variadic = isVariadicParameter(parameter);

    const value = action.config[key];

    if (variadic) {
      const ports = getDynamicPorts(action, key);

      ports.forEach((portInfo, index) => {
        createInputPort({
          node,
          key,
          label: parameter.label + " " + (portInfo.label || portInfo.id),
          dataType: parameter.type,
          variadic: true,
          side: "right",
          subKey: portInfo.id,
          isConnectable: parameter.isExpressionAllowed,
          schema: parameter,
        });
      });
    } else {
      createInputPort({
        node,
        key,
        label: parameter.label,
        dataType: parameter.type,
        side: "right",
        isConnectable: parameter.isExpressionAllowed,
        schema: parameter,
      });
    }
  });

  action.conditions?.forEach((condition, index) => {
    const isExprNode = isExpressionNode(condition);
    const isExprWrapper = isExpressionWrapper(condition);

    if (!isExprNode && !isExprWrapper) {
      return;
    }

    const port = conditionPorts[index];

    const childId = buildExpression(isExprNode ? condition : condition.expression, graph, expressionSchema, track, dataScope);

    if (childId) {
      createEdge({
        graph,
        fromNodeId: node.id,
        fromPortId: `conditions["${port.id}"]`,
        toNodeId: childId,
        toPortId: "output",
        type: "condition",
      });
    }
  });

  Object.entries(schema.parameters || {}).forEach(([key, parameter]) => {
    const value = action.config[key];

    const variadic = isVariadicParameter(parameter);

    if (variadic) {
      const isExprNode = isExpressionNode(value);
      const isExprWrapper = isExpressionWrapper(value);

      if (parameter.type === "object" && !isExprNode && !isExprWrapper) {
        const values = value && typeof value === "object" && !Array.isArray(value) ? { ...value } : {};

        const entries = Object.entries(values);

        entries.forEach(([childKey, child], index) => {
          const isChildExprNode = isExpressionNode(child);
          const isChildExprWrapper = isExpressionWrapper(child);

          if (!isChildExprNode && !isChildExprWrapper) {
            return;
          }

          const childId = buildExpression(isChildExprNode ? child : child.expression, graph, expressionSchema, track, dataScope);

          if (childId && parameter.isExpressionAllowed) {
            createEdge({
              graph,
              fromNodeId: node.id,
              fromPortId: `${key}["${childKey}"]`,
              fromSchema: parameter,
              toNodeId: childId,
              toPortId: "output",
            });
          }
        });
      } else if (!isExprNode && !isExprWrapper) {
        const values = Array.isArray(value) ? value : [];

        const ports = getDynamicPorts(action, key);

        values.forEach((child, index) => {
          const isChildExprNode = isExpressionNode(child);
          const isChildExprWrapper = isExpressionWrapper(child);

          if (!isChildExprNode && !isChildExprWrapper) {
            return;
          }

          const childId = buildExpression(isChildExprNode ? child : child.expression, graph, expressionSchema, track, dataScope);

          if (childId && parameter.isExpressionAllowed) {
            const portInfo = ports[index];

            if (portInfo) {
              createEdge({
                graph,
                fromNodeId: node.id,
                fromPortId: `${key}["${portInfo.id}"]`,
                fromSchema: parameter,
                toNodeId: childId,
                toPortId: "output",
              });
            }
          }
        });
      } else {
        //Do nothing?
      }
    } else {
      const isExprNode = isExpressionNode(value);
      const isExprWrapper = isExpressionWrapper(value);

      if (!isExprNode && !isExprWrapper) {
        return;
      }

      const childId = buildExpression(isExprNode ? value : value.expression, graph, expressionSchema, track, dataScope);

      if (childId && parameter.isExpressionAllowed) {
        createEdge({
          graph,
          fromNodeId: node.id,
          fromPortId: key,
          fromSchema: parameter,
          toNodeId: childId,
          toPortId: "output",
        });
      }
    }
  });

  action.runAfter?.forEach((child) => {
    const childId = buildAction(child, graph, actionSchema, expressionSchema, track, dataScope);

    if (childId) {
      createEdge({
        graph,
        fromNodeId: node.id,
        fromPortId: "input",
        toNodeId: childId,
        toPortId: "output",
        type: "control",
      });
    }
  });

  if (typeof track === "function") {
    track(node.id);
  }

  return node.id;
}

function buildActionWorkflow(nodeId, graph) {
  const node = graph.nodes[nodeId];

  if (!node || !node?.data?.type) {
    return null;
  }

  const schema = ACTION_SCHEMA[node.data.type];

  if (!schema) {
    return null;
  }

  const result = sanitizeAction({
    type: node.data.type,
    config: {
      id: node.data.config?.id || generateId("action"),
      ...clone(Object.fromEntries(Object.entries(schema.parameters).map(([key, parameter]) => [key, isVariadicParameter(parameter) ? parameter.defaultValue : (node.data.config?.[key] ?? parameter.defaultValue)]))),
    },
    conditions: [],
    runAfter: [],
  });

  if (!result) {
    return null;
  }

  const incoming = graph.edges.filter((e) => e.from.nodeId === nodeId);

  const cache = {};

  for (const edge of incoming) {
    if (edge.type === "control") {
      result.runAfter.push(buildActionWorkflow(edge.to.nodeId, graph));

      continue;
    }

    if (edge.type === "condition") {
      result.conditions.push({
        type: "expression",
        expression: buildExpressionWorkflow(edge.to.nodeId, graph),
      });

      continue;
    }

    if (edge.type === "data") {
      const expression = buildExpressionWorkflow(edge.to.nodeId, graph);

      const port = node.ports.inputs.find((inputPort) => inputPort.id === edge.from.portId);
      const portKey = port?.key;

      const parameterSchema = node.schema?.parameters?.[portKey];

      const type = parameterSchema?.type;

      const isArray = Array.isArray(type) && type.some((currentType) => typeof currentType === "string" && currentType.startsWith("array")) ? true : typeof type === "string" && type.startsWith("array") ? true : false;

      if (isArray) {
        if (!cache[portKey]) {
          cache[portKey] = true;

          result.config[portKey] = [];
        }

        result.config[portKey].push({
          type: "expression",
          expression,
        });
      } else {
        setByPortPath(result.config, edge.from.portId, {
          type: "expression",
          expression,
        });
      }
    }
  }

  return result;
}

function buildExpression(exprToBuild, graph, expressionSchema, track, dataScope = null) {
  if (!exprToBuild) {
    return null;
  }

  const schema = expressionSchema[exprToBuild.type];

  if (!schema) {
    return null;
  }

  const expr = { ...exprToBuild };

  ensureDynamicPorts(expr, schema);

  const node = createNode({
    id: expr.id,
    kind: "expression",
    type: expr.type,
    data: expr,
    schema,
    dataScope,
  });

  graph.nodes[node.id] = node;

  createOutputPort(node, "left", schema);

  Object.entries(schema.parameters || {}).forEach(([key, parameter]) => {
    const value = expr[key];

    const variadic = isVariadicParameter(parameter);

    if (variadic) {
      const ports = getDynamicPorts(expr, key);

      ports.forEach((portInfo, index) => {
        createInputPort({
          node,
          key,
          label: parameter.label + " " + (portInfo.label || portInfo.id),
          dataType: parameter.type,
          variadic: true,
          side: "right",
          subKey: portInfo.id,
          isConnectable: parameter.isExpressionAllowed,
          schema: parameter,
        });
      });
    } else {
      createInputPort({
        node,
        key,
        label: parameter.label,
        dataType: parameter.type,
        side: "right",
        isConnectable: parameter.isExpressionAllowed,
        schema: parameter,
      });
    }
  });

  Object.entries(schema.parameters || {}).forEach(([key, parameter]) => {
    const value = expr[key];

    const variadic = isVariadicParameter(parameter);

    if (variadic) {
      const isExprNode = isExpressionNode(value);
      const isExprWrapper = isExpressionWrapper(value);

      if (parameter.type === "object" && !isExprNode && !isExprWrapper) {
        const values = value && typeof value === "object" && !Array.isArray(value) ? { ...value } : {};

        const entries = Object.entries(values);

        entries.forEach(([childKey, child], index) => {
          const isChildExprNode = isExpressionNode(child);
          const isChildExprWrapper = isExpressionWrapper(child);

          if (!isChildExprNode && !isChildExprWrapper) {
            return;
          }

          const childId = buildExpression(isChildExprNode ? child : child.expression, graph, expressionSchema, track, dataScope);

          if (childId && parameter.isExpressionAllowed) {
            createEdge({
              graph,
              fromNodeId: node.id,
              fromPortId: `${key}["${childKey}"]`,
              fromSchema: parameter,
              toNodeId: childId,
              toPortId: "output",
            });
          }
        });
      } else if (!isExprNode && !isExprWrapper) {
        const values = Array.isArray(value) ? value : [];

        const ports = getDynamicPorts(expr, key);

        values.forEach((child, index) => {
          const isChildExprNode = isExpressionNode(child);
          const isChildExprWrapper = isExpressionWrapper(child);

          if (!isChildExprNode && !isChildExprWrapper) {
            return;
          }

          const childId = buildExpression(isChildExprNode ? child : child.expression, graph, expressionSchema, track, dataScope);

          if (childId && parameter.isExpressionAllowed) {
            const portInfo = ports[index];

            if (portInfo) {
              createEdge({
                graph,
                fromNodeId: node.id,
                fromPortId: `${key}["${portInfo.id}"]`,
                fromSchema: parameter,
                toNodeId: childId,
                toPortId: "output",
              });
            }
          }
        });
      } else {
        //Do nothing?
      }
    } else {
      const isExprNode = isExpressionNode(value);
      const isExprWrapper = isExpressionWrapper(value);

      if (!isExprNode && !isExprWrapper) {
        return;
      }

      const childId = buildExpression(isExprNode ? value : value.expression, graph, expressionSchema, track, dataScope);

      if (childId && parameter.isExpressionAllowed) {
        createEdge({
          graph,
          fromNodeId: node.id,
          fromPortId: key,
          fromSchema: parameter,
          toNodeId: childId,
          toPortId: "output",
        });
      }
    }
  });

  if (typeof track === "function") {
    track(node.id);
  }

  return node.id;
}

function buildExpressionWorkflow(nodeId, graph) {
  const node = graph.nodes[nodeId];

  if (!node || !node?.data?.type) {
    return null;
  }

  const schema = EXPRESSION_SCHEMA[node.data.type];

  if (!schema) {
    return null;
  }

  const result = sanitizeExpression({
    id: node.data.id || generateId("expression"),
    type: node.data.type,
    ...clone(Object.fromEntries(Object.entries(schema.parameters).map(([key, parameter]) => [key, isVariadicParameter(parameter) ? parameter.defaultValue : (node.data?.[key] ?? parameter.defaultValue)]))),
  });

  if (!result) {
    return null;
  }

  const outgoing = graph.edges.filter((e) => (e.type === "data" || e.type === "condition") && e.from.nodeId === nodeId);

  const cache = {};

  for (const edge of outgoing) {
    const expression = buildExpressionWorkflow(edge.to.nodeId, graph);

    const port = node.ports.inputs.find((inputPort) => inputPort.id === edge.from.portId);
    const portKey = port?.key;

    const parameterSchema = node.schema?.parameters?.[portKey];

    const type = parameterSchema?.type;

    const isArray = Array.isArray(type) && type.some((currentType) => typeof currentType === "string" && currentType.startsWith("array")) ? true : typeof type === "string" && type.startsWith("array") ? true : false;

    if (isArray) {
      if (!cache[portKey]) {
        cache[portKey] = true;

        result[portKey] = [];
      }

      result[portKey].push(expression);
    } else {
      setByPortPath(result, edge.from.portId, expression);
    }
  }

  return result;
}

function canConnectByType(fromType, toType) {
  if (Array.isArray(fromType)) {
    for (const currentFromType of fromType) {
      if (canConnectByType(currentFromType, toType)) {
        return true;
      }
    }

    return false;
  } else if (typeof fromType === "string") {
    if (Array.isArray(toType)) {
      for (const currentToType of toType) {
        if (canConnectByType(fromType, currentToType)) {
          return true;
        }
      }
    } else if (typeof toType === "string") {
      switch (fromType) {
        case "any":
          return true;
        case "array":
          return toType === "any" || toType.startsWith("array");
        case "array<boolean>":
          return toType === "any" || toType === "array" || toType === "array<boolean>";
        case "array<number>":
          return toType === "any" || toType === "array" || toType === "array<number>";
        case "array<object>":
          return toType === "any" || toType === "array" || toType === "array<object>";
        case "array<string>":
          return toType === "any" || toType === "array" || toType === "array<string>";
        case "boolean":
          return toType === "any" || toType === "boolean";
        case "enum<string>":
          return toType === "any" || toType === "string";
        case "number":
          return toType === "any" || toType === "number";
        case "object":
          return toType === "any" || toType === "object";
        case "string":
          return toType === "any" || toType === "string";
        default:
          return toType === "any";
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function createInputPort({ node, key, label, dataType, variadic = false, side, subKey = null, isConnectable = true, schema = null }) {
  const portId = subKey !== null && subKey !== undefined ? `${key}["${subKey}"]` : key;

  const port = {
    id: portId,
    key,
    label,
    side: side,
    kind: "input",
    dataType,
    variadic,
    subKey,
    isConnectable,
    schema,
  };

  node.ports.inputs.push(port);

  return port;
}

function createNode({ id, kind, type, data = null, schema = null, dataScope = null }) {
  return {
    id,
    kind,
    type,
    data,
    schema,
    dataScope,
    position: {
      x: 0,
      y: 0,
    },
    ports: {
      inputs: [],
      outputs: [],
    },
  };
}

function createOutputPort(node, side, schema) {
  const port = {
    id: "output",
    side,
    kind: "output",
    schema,
  };

  node.ports.outputs.push(port);

  return port;
}

function ensureDynamicPorts(actionOrExpression, schema) {
  if (!actionOrExpression.dynamicPorts) {
    actionOrExpression.dynamicPorts = {};
  }

  Object.entries(schema.parameters || {}).forEach(([key, parameter]) => {
    if (!isVariadicParameter(parameter)) {
      return;
    }

    if (actionOrExpression.dynamicPorts[key]) {
      return;
    }

    const value = actionOrExpression.config?.[key] ?? actionOrExpression[key];

    const ports = [];

    if (Array.isArray(value)) {
      value.forEach(() => {
        ports.push(createDynamicPort());
      });
    } else if (value && typeof value === "object") {
      Object.keys(value).forEach((childKey) => {
        ports.push(createDynamicPort(childKey));
      });
    }

    actionOrExpression.dynamicPorts[key] = ports;
  });

  if (!actionOrExpression.dynamicPorts.conditions) {
    const conditions = Array.isArray(actionOrExpression.conditions) ? actionOrExpression.conditions : [];

    actionOrExpression.dynamicPorts.conditions = conditions.map(() => createDynamicPort());
  }

  return actionOrExpression;
}

function getInputPortY(index) {
  return SIZE_PER_BLOCK + SIZE_PER_SPACE + index * (SIZE_PER_COUNT + SIZE_PER_SPACE) + SIZE_PER_COUNT / 2;
}

function isExpressionNode(value) {
  return !!(value && typeof value === "object" && !Array.isArray(value) && typeof value.type === "string" && EXPRESSION_SCHEMA[value.type]);
}

function isExpressionWrapper(value) {
  return !!(value && typeof value === "object" && !Array.isArray(value) && value.type === "expression" && isExpressionNode(value.expression));
}

function setByPortPath(obj, path, value) {
  const tokens = [];

  path.replace(/([^[.\]]+)|\[(\d+|".*?")\]/g, (_, key, bracket) => {
    if (key) {
      tokens.push(key);
    } else if (bracket) {
      if (typeof bracket === "string" && bracket.startsWith('"')) {
        tokens.push(JSON.parse(bracket));
      } else {
        tokens.push(Number(bracket));
      }
    }
  });

  let current = obj;

  for (let i = 0; i < tokens.length - 1; i++) {
    const token = tokens[i];
    const next = tokens[i + 1];

    if (current[token] === null || current[token] === undefined) {
      current[token] = typeof next === "number" ? [] : {};
    }

    current = current[token];
  }

  current[tokens[tokens.length - 1]] = value;
}
