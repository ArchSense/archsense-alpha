import { AnalysisResult } from '@archsense/scout';
import useMessage from '@rottitime/react-hook-message-event';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { getNextLevel, Levels } from '../services/levels';
import Scene from './Scene/Scene';
import { FullScreenLoader } from './Loader/Loader';

const App = () => {
  useMessage('analysis', (_, payload) => {
    setAnalysis(payload as AnalysisResult);
  });

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [activeView, setActiveView] = useState(Levels.Components);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  useEffect(() => {
    if (!analysis) {
      return;
    }
    const projects = Object.keys(analysis);
    if (projects.length === 1) {
      setSelectedServiceId(projects[0]);
      setActiveView(Levels.Components);
    }
  }, [analysis]);

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).vscode.postMessage({ type: 'openFile', payload: nodeId });
  }, 50);

  const getSceneData = () => {
    switch (activeView) {
      case Levels.Components:
      case Levels.Modules:
        if (selectedServiceId && analysis) {
          return analysis[selectedServiceId].components;
        }
        return {};
      // case Levels.Services:
      //   return analysis;
      default:
        return {};
    }
  };

  if (!analysis) {
    return <FullScreenLoader />;
  }

  return (
    analysis && (
      <Scene
        data={getSceneData()}
        onNodeEnter={onNodeEnterHandler}
        onNodeSelect={onNodeSelect}
        onViewChange={setActiveView}
        view={activeView}
      />
    )
  );
};

export default App;
