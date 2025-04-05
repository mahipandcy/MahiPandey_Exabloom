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
  type: 'start' | 'action' | 'end';
  data: { label: string };
};

let idCounter = 1;
const getId = () => `node-${idCounter++}`;

export default function AppLevel2() {
  const [workflowNodes, setWorkflowNodes] = useState<WorkflowNode[]>([
    { id: 'start', type: 'start', data: { label: 'Start Node' } },
    { id: 'end', type: 'end', data: { label: 'End Node' } },
  ]);

  const onLabelChange = (id: string, newLabel: string) => {
    setWorkflowNodes((prev) =>
      prev.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, label: newLabel } } : node
      )
    );
  };

  const onDelete = (id: string) => {
    setWorkflowNodes((prev) => prev.filter((node) => node.id !== id));
  };

  const handleAddNodeAfter = (afterId: string) => {
    const newNode: WorkflowNode = {
      id: getId(),
      type: 'action',
      data: { label: 'Action Node' },
    };

    const index = workflowNodes.findIndex((n) => n.id === afterId);
    const newList = [...workflowNodes];
    newList.splice(index + 1, 0, newNode);
    setWorkflowNodes(newList);
  };

  const buildDisplayNodes = (): Node[] => {
    const nodes: Node[] = [];
    const verticalSpacing = 100;

    workflowNodes.forEach((node, index) => {
      const y = index * 2 * verticalSpacing;

      nodes.push({
        id: node.id,
        type: node.type === 'action' ? 'actionNode' : node.type,
        data: {
          label: node.data.label,
          onLabelChange,
          onDelete,
        },
        position: { x: 250, y },
        draggable: true,
      });

      if (node.type !== 'end') {
        nodes.push({
          id: `add-${node.id}`,
          type: 'addButton',
          data: { onClick: () => handleAddNodeAfter(node.id) },
          position: { x: 250, y: y + verticalSpacing },
          draggable: false,
        });
      }
    });

    return nodes;
  };

  const buildEdges = (): Edge[] => {
    const edges: Edge[] = [];

    for (let i = 0; i < workflowNodes.length - 1; i++) {
      const current = workflowNodes[i];
      const next = workflowNodes[i + 1];
      const addId = `add-${current.id}`;

      edges.push({
        id: `e-${current.id}-${addId}`,
        source: current.id,
        target: addId,
        type: 'smoothstep',
      });

      edges.push({
        id: `e-${addId}-${next.id}`,
        source: addId,
        target: next.id,
        type: 'smoothstep',
      });
    }

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
          snapToGrid
          snapGrid={[20, 20]}
        >
          <MiniMap />
          <Controls />
          <Background gap={16} size={1} />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}
