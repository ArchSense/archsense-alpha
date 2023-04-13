import * as React from 'react';
import { useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Levels } from '../../services/levels';
import ActualNode from './ActualNode/ActualNode';
import { buildEdge } from './Edge/Edge';
import {
  initAbstractEdges,
  initAbstractNodes,
  initCodeEdges,
  initCodeNodes,
  initModuleEdges,
  initModuleNodes,
} from './initialElements';
// import { buildPlannedNode } from './Node/Node';
import PlannedNode from './PlannedNode/PlannedNode';
import './Scene.css';
import useAutoLayout from './useAutoLayout';
import Views from './Views/Views';

const proOptions = {
  hideAttribution: true,
};

const nodeTypes = {
  actual: ActualNode,
  planned: PlannedNode,
};

const DEFAULT_DIRECTION = 'TB';

interface SceneProps {
  data: unknown;
  onNodeEnter: (nodeId: string) => void;
  onNodeSelect: (nodeId: string) => void;
  onViewChange: (view: Levels) => void;
  view: Levels;
}

const Scene = ({ data, onNodeEnter, onNodeSelect, onViewChange, view }: SceneProps) => {
  useAutoLayout({ direction: DEFAULT_DIRECTION });

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const getInitFunctions = (view) => {
    switch (view) {
      case Levels.Components:
        return {
          nodes: initCodeNodes,
          edges: initCodeEdges,
        };
      case Levels.Modules:
        return {
          nodes: initModuleNodes,
          edges: initModuleEdges,
        };
      default:
        return {
          nodes: initAbstractNodes,
          edges: initAbstractEdges,
        };
    }
  };

  useEffect(() => {
    const { nodes, edges } = getInitFunctions(view);
    setNodes(nodes(data));
    setEdges(edges(data));
  }, [view, setNodes, setEdges, data]);

  const onEdgeAddHandler = useCallback(
    ({ source, target }) => {
      setEdges([...edges, buildEdge(source, target)]);
    },
    [edges, setEdges],
  );

  const onDoubleClickHandler = useCallback(
    (_, node) => {
      onNodeEnter && onNodeEnter(node.id);
    },
    [onNodeEnter],
  );

  const highlightEdges = useCallback(
    (selectedNode) => {
      setEdges((edges) =>
        edges.map((edge) => ({
          ...edge,
          selected: edge.source === selectedNode.id || edge.target === selectedNode.id,
        })),
      );
    },
    [setEdges],
  );

  const removeHighlightEdges = useCallback(() => {
    setEdges((edges) => edges.map((edge) => ({ ...edge, selected: false })));
  }, [setEdges]);

  const onSelectionChangeHandler = useCallback(
    ({ nodes }) => {
      const selectedNode = nodes[0];
      selectedNode ? highlightEdges(selectedNode) : removeHighlightEdges();
      selectedNode && onNodeSelect && onNodeSelect(selectedNode.id);
    },
    [highlightEdges, removeHighlightEdges, onNodeSelect],
  );

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        minZoom={0.02}
        maxZoom={1.5}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        onConnect={onEdgeAddHandler}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onSelectionChange={onSelectionChangeHandler}
        onNodeDoubleClick={onDoubleClickHandler}
      >
        <MiniMap pannable />
        <Controls showZoom />
        <Background />
      </ReactFlow>
      <Views current={view} onChange={onViewChange} />
    </>
  );
};

const SceneWrapper = (props: SceneProps) => {
  return (
    <ReactFlowProvider>
      <Scene {...props} />
    </ReactFlowProvider>
  );
};

export default SceneWrapper;
