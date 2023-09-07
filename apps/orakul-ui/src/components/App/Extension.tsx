import { AnalysisResult } from '@archsense/scout';
import useMessage from '@rottitime/react-hook-message-event';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Levels, getNextLevel } from '../../services/levels';
import { FullScreenLoader } from '../Loader/Loader';
import Scene from '../Scene/Scene';
import './App.css';

function App() {
  useMessage('analysis', (_, payload) => {
    setAnalysisResults(payload as AnalysisResult);
  });

  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(
    null,
  );
  const [activeView, setActiveView] = useState(Levels.Components);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null,
  );

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

  const onNodeEnterHandler = () => {
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
    window.vscode.postMessage({ type: 'openFile', payload: nodeId });
  }, 100);

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
    return <FullScreenLoader />;
  }

  return (
    <Scene
      data={getSceneData()}
      onNodeEnter={onNodeEnterHandler}
      onNodeSelect={onNodeSelect}
      onViewChange={setActiveView}
      view={activeView}
    />
  );
}

export default App;
