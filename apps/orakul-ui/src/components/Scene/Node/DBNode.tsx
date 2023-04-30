import { Handle, Position } from 'reactflow';
import './DBNode.css';

const DBNode = () => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        onConnect={(params) => console.log('handle onConnect', params)}
      />
      <div>
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="#fff900"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="miter"
        >
          <line x1="21" y1="5" x2="21" y2="19" strokeLinecap="round"></line>
          <line x1="3" y1="19" x2="3" y2="5" strokeLinecap="round"></line>
          <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
          <path d="M21,19c0,1.66-4,3-9,3s-9-1.34-9-3"></path>
          <path d="M21,12c0,1.66-4,3-9,3s-9-1.34-9-3"></path>
        </svg>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        onConnect={(params) => console.log('handle onConnect', params)}
      />
    </>
  );
};

export default DBNode;
