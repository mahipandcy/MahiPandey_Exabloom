import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

interface Props {
  id: string;
  data: {
    label: string;
    onLabelChange: (id: string, value: string) => void;
    onDelete: (id: string) => void;
  };
}

export default function ActionNode({ id, data }: Props) {
  const [label, setLabel] = useState(data.label);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    setLabel(newLabel);
    data.onLabelChange(id, newLabel);
  };

  return (
    <div style={{ padding: 10, border: '1px solid #888', borderRadius: 5, background: '#e6f7ff' }}>
      <Handle type="target" position={Position.Top} />
      <input value={label} onChange={handleChange} style={{ marginBottom: 8 }} />
      <button onClick={() => data.onDelete(id)}>Delete</button>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
