// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useMemo } from "react";

import { computeEdgeBounds, getBezierPathDirectionAware, getEdgeInputOffset, getEdgeOutputOffset, getPortPosition, screenToWorld } from "./workflow-utilities";

import importedStyles from "./EdgeLayer.module.css";

export default function EdgeLayer(props) {
  const bounds = props.bounds;
  const connecting = props.connecting;
  const edges = props.edges;
  const nodes = props.nodes;
  const offset = props.offset;
  const scale = props.scale;
  const styles = props.styles || importedStyles;

  const edgeBounds = useMemo(() => computeEdgeBounds(nodes), [nodes]);

  function renderConnecting() {
    if (connecting) {
      const fromNode = nodes[connecting.from.nodeId];

      const fromPos = getPortPosition(fromNode, connecting.from.port, connecting.from.portData);

      if (!fromPos) {
        return null;
      }

      const fromPosOffset = { x: fromPos.x - edgeBounds.left, y: fromPos.y - edgeBounds.top };

      const cursorWorld = screenToWorld(connecting.cursor.x, connecting.cursor.y, offset, scale, bounds);
      const cursorWorldOffset = { x: cursorWorld.x - edgeBounds.left, y: cursorWorld.y - edgeBounds.top };

      const path = getBezierPathDirectionAware(fromPosOffset, cursorWorldOffset);

      return <path d={path} fill="none" stroke="#38bdf8" strokeDasharray="5, 5" strokeWidth="2" />;
    }

    return null;
  }

  return (
    <svg
      className={styles.edge_layer}
      style={{
        height: edgeBounds.height,
        left: edgeBounds.left,
        top: edgeBounds.top,
        width: edgeBounds.width,
      }}
    >
      {edges.map((edge) => (
        <Edge edge={edge} edgeBounds={edgeBounds} key={edge.id} nodes={nodes} />
      ))}
      {renderConnecting()}
    </svg>
  );
}

function Edge(props) {
  const edge = props.edge;
  const edgeBounds = props.edgeBounds;
  const nodes = props.nodes;

  const from = nodes[edge.from.nodeId];
  const to = nodes[edge.to.nodeId];

  const path = useMemo(() => {
    if (!from || !to) {
      return null;
    }

    const fromAnchor = from.position;
    const toAnchor = to.position;

    const fromOffset = getEdgeInputOffset(from, to, edge);
    const toOffset = getEdgeOutputOffset(from, to);

    if (!fromOffset || !toOffset) {
      return null;
    }

    const fromAnchorOffset = {
      x: fromAnchor.x - edgeBounds.left + fromOffset.x,
      y: fromAnchor.y - edgeBounds.top + fromOffset.y,
    };

    const toAnchorOffset = {
      x: toAnchor.x - edgeBounds.left + toOffset.x,
      y: toAnchor.y - edgeBounds.top + toOffset.y,
    };

    return getBezierPathDirectionAware(fromAnchorOffset, toAnchorOffset);
  }, [edge, edgeBounds, from, to]);

  if (!from || !to || !path) {
    return null;
  }

  return <path d={path} fill="none" stroke="#64748b" strokeDasharray="5, 5" strokeWidth="2" />;
}
