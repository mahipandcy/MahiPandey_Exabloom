import React from 'react';
import ReactFlow, { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';

const nodes = [
  {
    id: 'start',
    type: 'input',
    data: { label: 'Start Node' },
    position: { x: 100, y: 100 },
  },
  {
    id: 'end',
    type: 'output',
    data: { label: 'End Node' },
    position: { x: 100, y: 300 },
  },
];

const edges = [
  { id: 'e1-2', source: 'start', target: 'end', type: 'smoothstep' },
];

function FlowCanvas() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow nodes={nodes} edges={edges} fitView />
    </div>
  );
}

function App() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}

export default App;
