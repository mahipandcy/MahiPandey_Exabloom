import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Node,
  Edge,
  Background,
  MiniMap,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  OnNodesChange,
  OnEdgesChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { nodeTypes } from './nodeTypes';

type WorkflowNode = {
  id: string;
  type: 'start' | 'action' | 'ifElse' | 'end' | 'branchLabel';
  parentId?: string;
  branchIndex?: number;
  depth?: number;
  data: any;
};

let idCounter = 1;
const getId = () => `node-${idCounter++}`;

export default function AppLevel3() {
  const [workflowNodes, setWorkflowNodes] = useState<WorkflowNode[]>([
    { id: 'start', type: 'start', data: { label: 'Start Node' } },
  ]);

  const onLabelChange = (id: string, newLabel: string) => {
    setWorkflowNodes((prev) =>
      prev.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, label: newLabel } } : node
      )
    );
  };

  const onBranchLabelChange = (id: string, index: number, newLabel: string) => {
    setWorkflowNodes((prev) =>
      prev.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                branches: node.data.branches.map((b: string, i: number) =>
                  i === index ? newLabel : b
                ),
              },
            }
          : node
      )
    );
  };

  const onAddBranch = (id: string) => {
    setWorkflowNodes((prev) =>
      prev.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                branches: [...node.data.branches, `Branch #${node.data.branches.length}`],
              },
            }
          : node
      )
    );
  };

  const onDelete = (id: string) => {
    setWorkflowNodes((prev) =>
      prev.filter((node) => node.id !== id && node.parentId !== id)
    );
  };

  const handleAddNodeAfter = (
    afterId: string,
    nodeType: 'action' | 'ifElse' | 'end',
    parentId?: string,
    branchIndex?: number
  ) => {
    const index = workflowNodes.findIndex((n) => n.id === afterId);
    const depth =
      workflowNodes
        .filter((n) => n.parentId === parentId && n.branchIndex === branchIndex)
        .filter((n) => n.id !== afterId).length + 1;

    const newId = getId();
    const newNode: WorkflowNode = {
      id: newId,
      type: nodeType,
      data:
        nodeType === 'action'
          ? { label: 'Action Node', onLabelChange, onDelete }
          : nodeType === 'ifElse'
          ? {
              label: 'If/Else Node',
              branches: ['Branch #1', 'Else'],
              onLabelChange,
              onBranchLabelChange,
              onAddBranch,
              onDelete,
            }
          : { label: 'End Node' },
      parentId,
      branchIndex,
      depth,
    };

    const newList = [...workflowNodes];
    newList.splice(index + 1, 0, newNode);
    setWorkflowNodes(newList);
  };

  const buildDisplayNodes = (): Node[] => {
    const nodes: Node[] = [];
    const spacingX = 200;
    const spacingY = 140;

    workflowNodes.forEach((node, index) => {
      const isBranch = node.parentId && typeof node.branchIndex === 'number';
      const baseX = 250;
      const xOffset = isBranch ? (node.branchIndex ?? 0) * spacingX : 0;
      const x = baseX + xOffset - (isBranch ? 150 : 0);

      const baseY = isBranch ? 400 : 0;
      const y = baseY + (node.depth ?? index) * spacingY;

      nodes.push({
        id: node.id,
        type:
          node.type === 'action'
            ? 'actionNode'
            : node.type === 'ifElse'
            ? 'ifElseNode'
            : node.type === 'branchLabel'
            ? 'branchLabelNode'
            : node.type,
        position: { x, y },
        data: {
          ...node.data,
          onLabelChange,
          onDelete,
          onBranchLabelChange,
          onAddBranch,
        },
        draggable: true,
      });

      const shouldShowAddButton = node.type !== 'end';

      if (shouldShowAddButton) {
        nodes.push({
          id: `add-${node.id}`,
          type: 'addButton',
          data: {
            onSelect: (type: 'action' | 'ifElse' | 'end') =>
              handleAddNodeAfter(node.id, type, node.parentId, node.branchIndex),
          },
          position: { x, y: y + 70 },
          draggable: false,
        });
      }

      if (node.type === 'ifElse') {
        const branches: string[] = node.data.branches || [];
        const startX = 250 - ((branches.length - 1) * spacingX) / 2;

        branches.forEach((label: string, i: number) => {
          const branchId = `${node.id}-branch-${i}`;
          const bx = startX + i * spacingX;
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
              onSelect: (type: 'action' | 'ifElse' | 'end') =>
                handleAddNodeAfter(branchId, type, node.id, i),
            },
            position: { x: bx, y: by + 60 },
            draggable: false,
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

      if (!node.parentId && next && !next.parentId) {
        edges.push({
          id: `e-${node.id}-add-${node.id}`,
          source: node.id,
          target: `add-${node.id}`,
          type: 'smoothstep',
        });
        edges.push({
          id: `e-add-${node.id}-${next.id}`,
          source: `add-${node.id}`,
          target: next.id,
          type: 'smoothstep',
        });
      }

      if (node.type === 'ifElse') {
        (node.data.branches || []).forEach((_: string, i: number) => {
          const branchNodeId = `${node.id}-branch-${i}`;
          edges.push({
            id: `e-${node.id}-${branchNodeId}`,
            source: node.id,
            target: branchNodeId,
            type: 'smoothstep',
          });
          edges.push({
            id: `e-${branchNodeId}-add`,
            source: branchNodeId,
            target: `add-${branchNodeId}`,
            type: 'smoothstep',
          });
        });
      }

      if (node.parentId && typeof node.branchIndex === 'number') {
        const addId = `add-${node.id}`;
        if (node.type !== 'end') {
          edges.push({
            id: `e-${node.id}-${addId}`,
            source: node.id,
            target: addId,
            type: 'smoothstep',
          });
        }

        const next = workflowNodes[i + 1];
        if (
          next &&
          next.parentId === node.parentId &&
          next.branchIndex === node.branchIndex
        ) {
          edges.push({
            id: `e-add-${node.id}-${next.id}`,
            source: addId,
            target: next.id,
            type: 'smoothstep',
          });
        }

        if (node.type !== 'end' && next?.type === 'end') {
          edges.push({
            id: `e-${node.id}-${next.id}`,
            source: node.id,
            target: next.id,
            type: 'smoothstep',
          });
        }
      }

      if (node.type === 'end' && node.parentId) {
        edges.push({
          id: `e-${node.parentId}-${node.id}`,
          source: node.parentId,
          target: node.id,
          type: 'smoothstep',
        });
      }
    });

    return edges;
  };

  const [rfNodes, setRfNodes] = useState<Node[]>(buildDisplayNodes());
  const [rfEdges, setRfEdges] = useState<Edge[]>(buildEdges());

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setRfNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setRfEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  useEffect(() => {
    setRfNodes(buildDisplayNodes());
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
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        >
          <MiniMap />
          <Controls />
          <Background gap={16} size={1} />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}
