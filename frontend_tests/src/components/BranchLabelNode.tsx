import React from 'react';
import { Handle, Position } from 'reactflow';

interface Props {
  data: {
    label: string;
  };
}

export default function BranchLabelNode({ data }: Props) {
  return (
    <div
      style={{
        padding: '6px 12px',
        borderRadius: '6px',
        background: '#f4f4f4',
        border: '1px solid #bbb',
        fontStyle: 'italic',
        fontSize: 14,
        color: '#444',
      }}
    >
      <Handle type="target" position={Position.Top} />
      {data.label}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
