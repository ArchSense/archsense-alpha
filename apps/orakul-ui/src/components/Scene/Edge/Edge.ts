import { Edge } from 'reactflow';
import './Edge.css';

const buildEdgeId = (sourceId: string, targetId: string): string =>
  `${sourceId}-${targetId}`;

export const edgeExists = (
  sourceId: string,
  targetId: string,
  collection: Edge[],
): boolean => {
  const desiredEdgeId = buildEdgeId(sourceId, targetId);
  return !!collection.find(({ id }) => desiredEdgeId === id);
};

export const buildEdge = (
  sourceId: string | null,
  targetId: string | null,
): Edge | null => {
  if (!sourceId || !targetId) {
    return null;
  }
  return {
    id: buildEdgeId(sourceId, targetId),
    source: sourceId,
    target: targetId,
  };
};
