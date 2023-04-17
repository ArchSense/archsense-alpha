import { AnalysisResult } from '@archsense/scout';
import useMessage from '@rottitime/react-hook-message-event';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { getAnalysis, getSourceCode } from '../../services/api';
import config from '../../services/config';
import { Levels, getNextLevel } from '../../services/levels';
import Editor from '../Editor/Editor';
import { defaultComment } from '../Editor/codeTemplates';
import { FullScreenLoader } from '../Loader/Loader';
import Scenarios from '../Scenarios/Scenarios';
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

  useMessage('analysis', (_, payload) => {
    setAnalysisResults(payload as AnalysisResult);
  });

  const [sourceCode, setSourceCode] = useState('');
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [activeView, setActiveView] = useState(Levels.Components);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  useEffect(() => {
    if (!config.standalone) {
      return;
    }
    getAnalysis().then(setAnalysisResults);
  }, []);

  useEffect(() => {
    if (!analysisResults) {
      return;
    }
    const projects = Object.keys(analysisResults);
    if (projects.length === 1) {
      setSelectedServiceId(projects[0]);
      setActiveView(Levels.Components);
    }
  }, [analysisResults]);

  const fetchSourceCode = async (nodeId: string) => {
    try {
      const res = await getSourceCode(nodeId);
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
    // if (activeView === Levels.Services) {
    //   setSelectedServiceId(nodeId);
    // }
    setActiveView(nextView);
  };

  const onNodeSelect = useDebouncedCallback((nodeId: string) => {
    if (config.standalone) {
      fetchSourceCode(nodeId)
    } else {
      (window as any).vscode.postMessage({ type: 'openFile', payload: nodeId });
    }
  }, 100);

  const onNodeDeselect = () => {
    return setSourceCode(defaultComment);
  };

  const onNodeSelectHandler = useCallback(
    (nodeId: string | undefined) => {
      if (nodeId) {
        onNodeSelect(nodeId);
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
        if (selectedServiceId && analysisResults) {
          return analysisResults[selectedServiceId].components;
        }
        return {};
      // case Levels.Services:
      //   return analysisResults;
      default:
        return {};
    }
  };

  if (!analysisResults) {
    return (
      <FullScreenLoader />
    );
  }

  return (
    <div className="App" ref={paneContainer} onMouseMove={onResizing} onMouseUp={onResizeEnd}>
      <aside className="Menu" ref={paneLeft}>
        <Scenarios
          serviceId={activeView === Levels.Components ? selectedServiceId as string : undefined}
          components={analysisResults[selectedServiceId as string]?.components}
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
