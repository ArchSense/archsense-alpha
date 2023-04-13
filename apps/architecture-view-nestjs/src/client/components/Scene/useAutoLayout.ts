import * as dagre from 'dagre';
import { useEffect } from 'react';
import { Edge, Node, Position, ReactFlowState, useReactFlow, useStore } from 'reactflow';

// the layout direction (T = top, R = right, B = bottom, L = left, TB = top to bottom, ...)
export type Direction = 'TB' | 'LR' | 'RL' | 'BT';

export type Options = {
  direction: Direction;
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const dagreGraph = new dagre.graphlib!.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const positionMap: Record<string, Position> = {
  T: Position.Top,
  L: Position.Left,
  R: Position.Right,
  B: Position.Bottom,
};

const nodeCountSelector = (state: ReactFlowState) => state.nodeInternals.size;
const nodesInitializedSelector = (state: ReactFlowState) =>
  Array.from(state.nodeInternals.values()).every((node) => node.width && node.height);

function useAutoLayout(options: Options) {
  const { direction } = options;
  const nodeCount = useStore(nodeCountSelector);
  const nodesInitialized = useStore(nodesInitializedSelector);
  const { getNodes, getEdges, setNodes, setEdges, fitView } = useReactFlow();

  useEffect(() => {
    // only run the layout if there are nodes and they have been initialized with their dimensions
    if (!nodeCount || !nodesInitialized) {
      return;
    }

    const nodes: Node[] = getNodes();
    const edges: Edge[] = getEdges();

    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node: Node) => {
      dagreGraph.setNode(node.id, {
        width: node.width,
        height: node.height,
      });
    });

    edges.forEach((edge: Edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    setNodes((nodes) =>
      nodes.map((node) => {
        const { x, y } = dagreGraph.node(node.id);

        return {
          ...node,
          sourcePosition: positionMap[direction[1]],
          targetPosition: positionMap[direction[0]],
          position: { x, y },
        };
      }),
    );

    setEdges((edges) => edges.map((edge) => ({ ...edge, style: { opacity: 1 } })));
  }, [nodeCount, nodesInitialized, getNodes, getEdges, setNodes, setEdges, fitView, direction]);
}

export default useAutoLayout;
