import { Handle, Position } from 'reactflow';
import './PlannedNode.css';

const PlannedNode = ({ data }) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        onConnect={(params) => console.log('handle onConnect', params)}
      />
      <div>
        <b>{data.name}</b>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        onConnect={(params) => console.log('handle onConnect', params)}
      />
    </>
  );
};

export default PlannedNode;
