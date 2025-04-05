import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

export default function AddButtonNode({ data }: any) {
  const [showMenu, setShowMenu] = useState(false);

  const handleSelect = (type: 'action' | 'ifElse' | 'end') => {
    setShowMenu(false);
    data.onSelect(type);
  };

  return (
    <div style={{ textAlign: 'center', position: 'relative' }}>
      <Handle type="target" position={Position.Top} />
      <button
        onClick={() => setShowMenu(!showMenu)}
        style={{
          fontSize: 20,
          padding: '4px 10px',
          border: '1px solid #ccc',
          borderRadius: 6,
          cursor: 'pointer',
        }}
      >
        +
      </button>
      <Handle type="source" position={Position.Bottom} />

      {showMenu && (
        <div
          style={{
            position: 'absolute',
            top: 45,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#fff',
            border: '1px solid #ccc',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderRadius: 4,
            zIndex: 10,
            width: 140,
          }}
        >
          <div
            onClick={() => handleSelect('action')}
            style={{
              padding: '8px',
              borderBottom: '1px solid #eee',
              cursor: 'pointer',
            }}
          >
            🟢 Action Node
          </div>
          <div
            onClick={() => handleSelect('ifElse')}
            style={{
              padding: '8px',
              borderBottom: '1px solid #eee',
              cursor: 'pointer',
            }}
          >
            🔀 If/Else Node
          </div>
          <div
            onClick={() => handleSelect('end')}
            style={{
              padding: '8px',
              cursor: 'pointer',
            }}
          >
            🔴 End Node
          </div>
        </div>
      )}
    </div>
  );
}
