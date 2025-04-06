// AppLevel3.tsx
import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  ReactFlowProvider,
  applyEdgeChanges,
  applyNodeChanges,
  NodeChange,
  EdgeChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { nodeTypes } from './nodeTypes';

let id = 2; // Start is node-1, end is node-2
const getId = () => `node-${id++}`;

type WorkflowNode = {
  id: string;
  type: string;
  data: any;
  parentId?: string;
  branchIndex?: number;
  depth?: number;
};

export default function AppLevel3() {
  const [workflowNodes, setWorkflowNodes] = useState<WorkflowNode[]>([
    { id: 'start', type: 'start', data: { label: 'Start Node' } },
    { id: 'end', type: 'end', data: { label: 'End Node' } },
  ]);

  const handleAddNodeAfter = (
    afterId: string,
    nodeType: 'action' | 'ifElse',
    parentId?: string,
    branchIndex?: number
  ) => {
    let effectiveParentId = parentId;
    let effectiveBranchIndex = branchIndex;
    let insertIndex = -1;

    if (afterId.includes('-branch-')) {
      const [parsedParentId, idx] = afterId.split('-branch-');
      effectiveParentId = parsedParentId;
      effectiveBranchIndex = parseInt(idx);

      const branchNodes = workflowNodes.filter(
        (n) => n.parentId === parsedParentId && n.branchIndex === parseInt(idx)
      );
      const lastNode = branchNodes[branchNodes.length - 1];
      insertIndex = workflowNodes.findIndex((n) => n.id === lastNode?.id);
    } else {
      insertIndex = workflowNodes.findIndex((n) => n.id === afterId);
    }

    const depth =
      workflowNodes.filter(
        (n) => n.parentId === effectiveParentId && n.branchIndex === effectiveBranchIndex
      ).length + 1;

    const newId = getId();
    const newNode: WorkflowNode = {
      id: newId,
      type: nodeType,
      data: {
        label: nodeType === 'ifElse' ? 'If/Else Node' : 'Action Node',
      },
      parentId: effectiveParentId,
      branchIndex: effectiveBranchIndex,
      depth,
    };

    if (nodeType === 'ifElse') {
      newNode.data.branches = ['Branch #1', 'Else'];
    }

    const updated = [...workflowNodes];
    updated.splice(insertIndex + 1, 0, newNode);

    setWorkflowNodes(updated);
  };

  const buildNodes = (): Node[] => {
    const nodes: Node[] = [];
    const spacingX = 200;
    const spacingY = 140;

    workflowNodes.forEach((n, i) => {
      const isBranch = n.parentId && typeof n.branchIndex === 'number';
      const x = isBranch ? 250 + (n.branchIndex ?? 0) * spacingX - 150 : 250;
      const y = isBranch ? 400 + (n.depth ?? 0) * spacingY : i * spacingY * 2;

      nodes.push({
        id: n.id,
        type:
          n.type === 'action'
            ? 'actionNode'
            : n.type === 'ifElse'
            ? 'ifElseNode'
            : n.type === 'branchLabel'
            ? 'branchLabelNode'
            : n.type,
        position: { x, y },
        data:
          n.type === 'ifElse'
            ? {
                label: n.data.label,
                branches: n.data.branches ?? ['Branch #1', 'Else'],
                onLabelChange: (id: string, newLabel: string) =>
                  setWorkflowNodes((prev) =>
                    prev.map((node) =>
                      node.id === id ? { ...node, data: { ...node.data, label: newLabel } } : node
                    )
                  ),
                onBranchLabelChange: (id: string, index: number, value: string) =>
                  setWorkflowNodes((prev) =>
                    prev.map((node) =>
                      node.id === id
                        ? {
                            ...node,
                            data: {
                              ...node.data,
                              branches: node.data.branches.map((b: string, i: number) =>
                                i === index ? value : b
                              ),
                            },
                          }
                        : node
                    )
                  ),
                onAddBranch: (id: string) =>
                  setWorkflowNodes((prev) =>
                    prev.map((node) =>
                      node.id === id
                        ? {
                            ...node,
                            data: {
                              ...node.data,
                              branches: [
                                ...node.data.branches,
                                `Branch #${node.data.branches.length + 1}`,
                              ],
                            },
                          }
                        : node
                    )
                  ),
                onDelete: (id: string) =>
                  setWorkflowNodes((prev) =>
                    prev.filter((node) => node.id !== id && node.parentId !== id)
                  ),
              }
            : {
                label: n.data.label,
                onDelete: (id: string) =>
                  setWorkflowNodes((prev) => prev.filter((node) => node.id !== id)),
                onSelect: (type: 'action' | 'ifElse') =>
                  handleAddNodeAfter(n.id, type, n.parentId, n.branchIndex),
              },
        draggable: true,
      });

      if (n.type !== 'end' && n.type !== 'branchLabel') {
        nodes.push({
          id: `add-${n.id}`,
          type: 'addButton',
          data: {
            onSelect: (type: 'action' | 'ifElse') =>
              handleAddNodeAfter(n.id, type, n.parentId, n.branchIndex),
          },
          position: { x, y: y + 70 },
          draggable: true,
        });
      }

      if (n.type === 'ifElse') {
        const branches = n.data.branches ?? ['Branch #1', 'Else'];
        const startX = 250 - ((branches.length - 1) * spacingX) / 2;
        branches.forEach((label: string, idx: number) => {
          const branchId = `${n.id}-branch-${idx}`;
          const bx = startX + idx * spacingX;
          const by = y + 100;

          nodes.push({
            id: branchId,
            type: 'branchLabelNode',
            data: { label },
            position: { x: bx, y: by },
            draggable: false,
          });

          nodes.push({
            id: `add-${branchId}`,
            type: 'addButton',
            data: {
              onSelect: (type: 'action' | 'ifElse') =>
                handleAddNodeAfter(branchId, type, n.id, idx),
            },
            position: { x: bx, y: by + 60 },
            draggable: true,
          });
        });
      }
    });

    return nodes;
  };

  const buildEdges = (): Edge[] => {
    const edges: Edge[] = [];

    workflowNodes.forEach((node, i) => {
      const next = workflowNodes[i + 1];

      if (
        !node.parentId &&
        next &&
        !next.parentId &&
        node.id !== next.id &&
        next.id !== `add-${node.id}`
      ) {
        edges.push({ id: `e-${node.id}-add-${node.id}`, source: node.id, target: `add-${node.id}`, type: 'smoothstep' });
        edges.push({ id: `e-add-${node.id}-${next.id}`, source: `add-${node.id}`, target: next.id, type: 'smoothstep' });
      }

      if (node.type === 'ifElse') {
        (node.data.branches ?? ['Branch #1', 'Else']).forEach((branchLabel: string, idx: number) => {
          const branchNodeId = `${node.id}-branch-${idx}`;
          edges.push({ id: `e-${node.id}-${branchNodeId}`, source: node.id, target: branchNodeId, type: 'smoothstep' });
          edges.push({ id: `e-${branchNodeId}-add`, source: branchNodeId, target: `add-${branchNodeId}`, type: 'smoothstep' });
        });
      }

      if (node.parentId && typeof node.branchIndex === 'number' && node.type !== 'end') {
        const nextNode = workflowNodes[i + 1];
        edges.push({ id: `e-${node.id}-add-${node.id}`, source: node.id, target: `add-${node.id}`, type: 'smoothstep' });
        if (nextNode && nextNode.parentId === node.parentId && nextNode.branchIndex === node.branchIndex) {
          edges.push({ id: `e-add-${node.id}-${nextNode.id}`, source: `add-${node.id}`, target: nextNode.id, type: 'smoothstep' });
        }
      }
    });

    return edges;
  };

  const [rfNodes, setRfNodes] = useState<Node[]>(buildNodes());
  const [rfEdges, setRfEdges] = useState<Edge[]>(buildEdges());

  const onNodesChange = useCallback((changes: NodeChange[]) => setRfNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes: EdgeChange[]) => setRfEdges((eds) => applyEdgeChanges(changes, eds)), []);

  useEffect(() => {
    setRfNodes(buildNodes());
    setRfEdges(buildEdges());
  }, [workflowNodes]);

  return (
    <ReactFlowProvider>
      <div style={{ width: '100vw', height: '100vh' }}>
        <ReactFlow
          nodes={rfNodes}
          edges={rfEdges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background gap={16} size={1} />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}
