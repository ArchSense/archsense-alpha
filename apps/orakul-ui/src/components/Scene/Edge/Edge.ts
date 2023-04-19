import { Edge } from 'reactflow';
import './Edge.css';

export const buildEdge = (sourceId: string | null, targetId: string | null): Edge | null => {
  if (!sourceId || !targetId) {
    return null;
  }
  return {
    id: `${sourceId}-${targetId}`,
    source: sourceId,
    target: targetId,
  };
};
