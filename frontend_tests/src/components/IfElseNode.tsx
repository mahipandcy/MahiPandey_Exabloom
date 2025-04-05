import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

interface Props {
  id: string;
  data: {
    label: string;
    branches: string[];
    onLabelChange: (id: string, value: string) => void;
    onBranchLabelChange: (id: string, index: number, value: string) => void;
    onAddBranch: (id: string) => void;
    onDelete: (id: string) => void;
  };
}

export default function IfElseNode({ id, data }: Props) {
  const [label, setLabel] = useState(data.label);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    setLabel(newLabel);
    data.onLabelChange(id, newLabel);
  };

  return (
    <div style={{ padding: 10, border: '2px dashed #666', borderRadius: 8, background: '#fffbe6' }}>
      <Handle type="target" position={Position.Top} />

      <div>
        <strong>If/Else Node</strong>
        <input
          value={label}
          onChange={handleLabelChange}
          style={{ width: '100%', marginTop: 5 }}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        {data.branches.map((branchLabel: string, idx: number) => (
          <div key={idx} style={{ marginBottom: 5 }}>
            <input
              value={branchLabel}
              onChange={(e) => data.onBranchLabelChange(id, idx, e.target.value)}
              style={{ width: '100%' }}
              placeholder={`Branch ${idx + 1}`}
            />
          </div>
        ))}
        <button onClick={() => data.onAddBranch(id)} style={{ marginTop: 5 }}>
          + Add Branch
        </button>
      </div>

      <button onClick={() => data.onDelete(id)} style={{ marginTop: 10, color: 'red' }}>
        Delete If/Else
      </button>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
