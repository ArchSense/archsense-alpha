import { AnalysisResult } from '@archsense/scout';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Node } from 'reactflow';
import { getAnalysis, getSourceCode } from '../../services/api';
import { getNextLevel, Levels } from '../../services/levels';
import { defaultComment, generateNewClass } from '../Editor/codeTemplates';
import Editor from '../Editor/Editor';
import Scenarios from '../Scenarios/Scenarios';
import { SceneNodeType } from '../Scene/Node/Node';
import Scene from '../Scene/Scene';
import './App.css';
import useSplitPanel from './useSplitPanel';

function App() {
  const paneContainer = useRef(null);
  const paneLeft = useRef(null);
  const paneRight = useRef(null);

  const { onResizeEnd, onResizeStart, onResizing } = useSplitPanel(
    paneContainer,
    paneLeft,
    paneRight,
  );

  const [activeView, setActiveView] = useState(Levels.Services);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [sourceCode, setSourceCode] = useState('');
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult>({});

  useEffect(() => {
    getAnalysis().then((analysis) => {
      setAnalysisResults(analysis);
      const projects = Object.keys(analysis);
      if (projects.length === 1) {
        setActiveView(Levels.Modules);
        setSelectedServiceId(projects[0]);
      }
    });
  }, []);

  const getSourceCodeForNode = async (node) => {
    try {
      const res = await getSourceCode(node.id);
      if (res) {
        setSourceCode(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onNodeEnterHandler = (nodeId: string) => {
    const nextView = getNextLevel(activeView);
    if (!nextView) {
      return;
    }
    if (activeView === Levels.Services) {
      setSelectedServiceId(nodeId);
    }
    setActiveView(nextView);
  };

  const onNodeSelect = useCallback((node: Node) => {
    switch (node.type) {
      case SceneNodeType.ACTUAL:
        return getSourceCodeForNode(node);
      case SceneNodeType.PLANNED:
        return setSourceCode(generateNewClass(node.data.name));
    }
  }, []);

  const onNodeDeselect = () => {
    return setSourceCode(defaultComment);
  };

  const onNodeSelectHandler = useCallback(
    (node: Node | undefined) => {
      if (node) {
        onNodeSelect(node);
      } else {
        onNodeDeselect();
      }
    },
    [onNodeSelect],
  );

  const getSceneData = () => {
    switch (activeView) {
      case Levels.Components:
      case Levels.Modules:
        return analysisResults[selectedServiceId].components;
      case Levels.Services:
        return analysisResults;
      default:
        return {};
    }
  };

  return (
    <div className="App" ref={paneContainer} onMouseMove={onResizing} onMouseUp={onResizeEnd}>
      <aside className="Menu" ref={paneLeft}>
        <Scenarios
          serviceId={activeView === Levels.Components && selectedServiceId}
          components={analysisResults[selectedServiceId]?.components}
        />
      </aside>
      <div className="Splitter" data-index={0} onMouseDown={onResizeStart}></div>
      <main className="Main">
        <Scene
          data={getSceneData()}
          onNodeEnter={onNodeEnterHandler}
          onNodeSelect={onNodeSelectHandler}
          onViewChange={setActiveView}
          view={activeView}
        />
      </main>
      <div className="Splitter" data-index={1} onMouseDown={onResizeStart}></div>
      <aside className="Code" ref={paneRight}>
        <Editor sourceCode={sourceCode} />
      </aside>
    </div>
  );
}

export default App;
