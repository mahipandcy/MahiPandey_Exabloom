import React from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Background
} from 'reactflow';
import 'reactflow/dist/style.css';
import { nodeTypes } from './nodeTypes';

const nodes = [
  {
    id: 'start',
    type: 'input',
    data: { label: 'Start Node' },
    position: { x: 250, y: 100 },
  },
  {
    id: 'add-btn',
    type: 'addButton',
    data: {},
    position: { x: 250, y: 200 },
  },
  {
    id: 'end',
    type: 'output',
    data: { label: 'End Node' },
    position: { x: 250, y: 300 },
  },
];

const edges = [
  { id: 'e1', source: 'start', target: 'add-btn', type: 'smoothstep' },
  { id: 'e2', source: 'add-btn', target: 'end', type: 'smoothstep' },
];

function FlowCanvas() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <Background gap={16} size={1} />
      </ReactFlow>

    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}