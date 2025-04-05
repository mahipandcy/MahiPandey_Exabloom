import React from 'react';
import ReactFlow from 'reactflow';
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
    position: { x: 400, y: 100 },
  },
];

const edges = [
  { id: 'e1-2', source: 'start', target: 'end', type: 'smoothstep' },
];

function App() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlow nodes={nodes} edges={edges} fitView />
    </div>
  );
}

export default App;
