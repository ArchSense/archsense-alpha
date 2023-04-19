import { Handle, Position } from 'reactflow';
import './ActualNode.css';
import { ParsedResult } from '@archsense/scout';

interface ClassNodeProps {
  data: ParsedResult['exports'][number];
}

const ClassNode = ({ data }: ClassNodeProps) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        onConnect={(params) => console.log('handle onConnect', params)}
      />
      <div>
        <b>{data.name}</b>
        {data.members && data.members.length > 0 && (
          <ul>
            {data.members.map(({ name, id }) => (
              <li key={id}>{name}</li>
            ))}
          </ul>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        onConnect={(params) => console.log('handle onConnect', params)}
      />
    </>
  );
};

export default ClassNode;
