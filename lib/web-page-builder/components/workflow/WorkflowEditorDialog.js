// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { faCheck, faClose } from "@fortawesome/pro-solid-svg-icons";

import Canvas from "./Canvas";
import { DarkButton } from "../button/Button";
import EdgeLayer from "./EdgeLayer";
import Icon from "../editor/Icon";
import Node from "./Node";
import NodeEditor from "./NodeEditor";
import NodeToolbar from "./NodeToolbar";
import { canConnect, computeExportedNodeSet, computeWorkflowCenterOffset, createDefaultAction, createDefaultExpression, createEdge, findClosestPort, findParentNodeFor, layoutWorkflow, resolvePortId, screenToWorld, snap } from "./workflow-utilities";

import importedStyles from "./WorkflowEditorDialog.module.css";

export default function WorkflowEditorDialog(props) {
  const componentType = props.componentType;
  const dataScope = props.dataScope;
  const graph = props.graph;
  const isExpressionOnly = props.isExpressionOnly;
  const isPlatformAdmin = props.isPlatformAdmin;
  const isOpen = props.isOpen;
  const onChange = props.onChange;
  const onClose = props.onClose;
  const onDone = props.onDone;
  const plan = props.plan;
  const styles = props.styles || importedStyles;
  const zIndex = props.zIndex;

  const nextZIndex = typeof zIndex === "number" && zIndex >= 1000 ? zIndex + 1 : 1001;

  const [initialEdges, setInitialEdges] = useState(null);
  const [initialNodes, setInitialNodes] = useState(null);
  const [nodes, setNodes] = useState(graph.nodes);

  const [bounds, setBounds] = useState(null);
  const [connecting, setConnecting] = useState(null);
  const [edges, setEdges] = useState(graph.edges);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [selected, setSelected] = useState(null);
  const [selectedParent, setSelectedParent] = useState(null);

  const currentGraph = useMemo(() => ({ edges, nodes }), [edges, nodes]);

  const exportedNodes = useMemo(() => computeExportedNodeSet(currentGraph, isExpressionOnly), [currentGraph, isExpressionOnly]);

  const addNode = useCallback(
    (kind, type, position) => {
      const data = kind === "action" ? createDefaultAction(type) : kind === "expression" ? createDefaultExpression(type) : null;

      if (!data) {
        return;
      }

      const id = kind === "action" ? data.config.id : kind === "expression" ? data.id : null;

      if (!id) {
        return;
      }

      let snappedPosition = position;

      if (snappedPosition) {
        snappedPosition = {
          x: snap(snappedPosition.x),
          y: snap(snappedPosition.y),
        };
      }

      const newGraph = kind === "action" ? layoutWorkflow([data], null, { edges, nodes }, snappedPosition) : kind === "expression" ? layoutWorkflow(null, [data], { edges, nodes }, snappedPosition) : null;

      if (newGraph) {
        setEdges(newGraph.edges);
        setNodes(newGraph.nodes);
      }
    },
    [edges, nodes, setEdges, setNodes],
  );

  const completeConnection = useCallback(
    (target) => {
      if (!connecting) {
        return;
      }

      if (canConnect(connecting.from, target, currentGraph)) {
        const actualFrom = connecting.from.port === "input" ? connecting.from : target;
        const actualTo = target.port === "output" ? target : connecting.from;

        const fromPortId = resolvePortId(actualFrom.port, actualFrom.portData);

        let type = "data";

        if (actualFrom.nodeKind === "action" && /^conditions\["[^"]+"\]$/.test(fromPortId)) {
          type = "condition";
        } else if (actualFrom.nodeKind === "action" && actualTo.nodeKind === "action") {
          type = "control";
        }

        setEdges((prev) => [
          ...prev,
          createEdge({
            fromNodeId: actualFrom.nodeId,
            fromPortId,
            fromSchema: actualFrom.schema ?? null,
            toNodeId: actualTo.nodeId,
            toPortId: resolvePortId(actualTo.port, actualTo.portData),
            type,
          }),
        ]);
      }

      setConnecting(null);
    },
    [connecting, currentGraph, setConnecting, setEdges],
  );

  const deleteNode = useCallback(
    (id) => {
      setNodes((prev) => {
        const copy = { ...prev };

        delete copy[id];

        return copy;
      });

      setEdges((prev) => prev.filter((e) => e.from.nodeId !== id && e.to.nodeId !== id));

      if (selected === id) {
        setSelected(null);
      }
    },
    [selected, setEdges, setNodes, setSelected],
  );

  const disconnectNode = useCallback(
    (id) => {
      setEdges((prev) => prev.filter((e) => e.from.nodeId !== id && e.to.nodeId !== id));
    },
    [setEdges],
  );

  const moveNode = useCallback(
    (id, pos) => {
      let next = pos;

      next = {
        x: snap(next.x),
        y: snap(next.y),
      };

      setNodes((prev) => ({
        ...prev,
        [id]: { ...prev[id], position: next },
      }));
    },
    [setNodes],
  );

  const onClickApply = useCallback(
    (e) => {
      const nextGraph = {
        nodes,
        edges,
      };

      if (onChange) {
        onChange(nextGraph);
      }

      if (onDone) {
        onDone(nextGraph, e);
      }

      if (onClose) {
        onClose(e);
      }

      setInitialEdges(null);
      setInitialNodes(null);
    },
    [edges, nodes, onChange, onClose, onDone, setInitialEdges, setInitialNodes],
  );

  const onClickClose = useCallback(
    (e) => {
      if (initialEdges && initialNodes && onChange) {
        onChange({
          nodes: initialNodes,
          edges: initialEdges,
        });
      }

      if (onClose) {
        onClose(e);
      }

      setInitialEdges(null);
      setInitialNodes(null);
    },
    [initialEdges, initialNodes, onChange, onClose, setInitialEdges, setInitialNodes],
  );

  const onClickDialog = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const onDrop = useCallback(
    (e) => {
      try {
        e.preventDefault();
        e.stopPropagation();

        const dataString = e.dataTransfer.getData("text/plain");

        if (typeof dataString === "string") {
          const data = JSON.parse(dataString);

          if (data) {
            const action = data.action;
            const type = data.type;

            if (typeof action === "string" && typeof type === "string") {
              if (action === "add-action") {
                addNode("action", type, screenToWorld(e.clientX, e.clientY, offset, scale, bounds));
              } else if (action === "add-expression") {
                addNode("expression", type, screenToWorld(e.clientX, e.clientY, offset, scale, bounds));
              }
            }
          }
        }
      } catch (error) {}
    },
    [addNode, bounds, offset, scale],
  );

  const onStartConnection = useCallback(
    (nodeKind, nodeId, port, e, portData = null, schema = null) => {
      e.stopPropagation();

      setConnecting({
        from: {
          nodeKind,
          nodeId,
          port,
          portData,
          schema,
        },
        to: null,
        cursor: {
          x: e.clientX,
          y: e.clientY,
        },
      });
    },
    [setConnecting],
  );

  const updateNode = useCallback(
    (node) => {
      setNodes((prev) => ({
        ...prev,
        [node.id]: node,
      }));
    },
    [setNodes],
  );

  useEffect(() => {
    function move(e) {
      setConnecting((prev) => (prev ? { ...prev, cursor: { x: e.clientX, y: e.clientY } } : null));
    }

    function up(e) {
      if (connecting && bounds) {
        const world = screenToWorld(e.clientX, e.clientY, offset, scale, bounds);

        const port = findClosestPort(connecting.from, world, nodes, currentGraph);

        if (port) {
          completeConnection(port);
        }
      }

      setConnecting(null);
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [bounds, completeConnection, currentGraph, nodes, offset, scale, setConnecting]);

  useEffect(() => {
    if (graph) {
      setEdges(graph.edges);
      setNodes(graph.nodes);
    }
  }, [graph, setEdges, setNodes]);

  useEffect(() => {
    if (bounds) {
      let isInitializing = false;

      if (edges && !initialEdges && isOpen) {
        setInitialEdges(edges);

        isInitializing = true;
      }

      if (nodes && !initialNodes && isOpen) {
        setInitialNodes(nodes);

        isInitializing = true;
      }

      if (isInitializing) {
        const initialScale = 1;

        setScale(initialScale);

        setOffset(computeWorkflowCenterOffset(nodes, bounds, initialScale));
      }
    }
  }, [bounds, edges, initialEdges, initialNodes, isOpen, nodes]);

  useEffect(() => {
    if (graph && selected) {
      const newSelectedParent = findParentNodeFor(selected.id, graph);

      if (newSelectedParent) {
        setSelectedParent(newSelectedParent);
      } else {
        setSelectedParent(null);
      }
    } else {
      setSelectedParent(null);
    }
  }, [graph, selected]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={onClickClose} style={typeof zIndex === "number" && zIndex > 1000 ? { "--workflow-editor-dialog-z-index": zIndex } : undefined}>
      <div className={styles.dialog} onClick={onClickDialog}>
        <div className={styles.header}>
          <h3 className={styles.title}>Workflow Editor</h3>
          <Icon icon={faClose} onClick={onClickClose} size={24} theme="danger" />
        </div>
        <div className={styles.body}>
          <Canvas offset={offset} onDrop={onDrop} scale={scale} setBounds={setBounds} setOffset={setOffset} setScale={setScale}>
            <EdgeLayer bounds={bounds} connecting={connecting} edges={edges} nodes={nodes} offset={offset} scale={scale} />
            {Object.values(nodes).map((node) => (
              <Node isExported={exportedNodes.has(node.id)} isSelected={selected === node.id} key={node.id} moveNode={moveNode} node={node} onStartConnection={onStartConnection} position={node.position} scale={scale} setSelected={setSelected} />
            ))}
          </Canvas>
          <NodeToolbar componentType={componentType} isExpressionOnly={isExpressionOnly} isPlatformAdmin={isPlatformAdmin} plan={plan} />
          <NodeEditor dataScope={dataScope} deleteNode={deleteNode} disconnectNode={disconnectNode} node={nodes[selected]} parentNode={selectedParent} updateNode={updateNode} />
        </div>
        <div className={styles.footer}>
          <DarkButton onClick={onClickClose} type="button">
            <Icon icon={faClose} size={16} /> Cancel
          </DarkButton>
          <DarkButton onClick={onClickApply} theme="primary" type="button">
            <Icon icon={faCheck} size={16} /> Apply
          </DarkButton>
        </div>
      </div>
    </div>
  );
}
