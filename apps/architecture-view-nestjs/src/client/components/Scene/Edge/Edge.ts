import { Edge } from 'reactflow';
import './Edge.css';

export const buildEdge = (sourceId, targetId): Edge => {
  return {
    id: `${sourceId}-${targetId}`,
    source: sourceId,
    target: targetId,
  };
};
