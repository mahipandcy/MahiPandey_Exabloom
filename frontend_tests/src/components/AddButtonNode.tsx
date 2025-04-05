import React from 'react';
import { Handle, Position } from 'reactflow';

export default function AddButtonNode({ data }: any) {
  return (
    <div
      style={{
        background: '#f0f0f0',
        width: 40,
        height: 40,
        borderRadius: 8,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid #ccc',
      }}
    >
      <Handle type="target" position={Position.Top} />
      <button
        onClick={data.onClick}
        style={{
          fontSize: 20,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        +
      </button>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
