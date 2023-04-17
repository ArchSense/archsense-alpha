import * as React from 'react';
import { useState, useEffect } from 'react';
import { VSCodeProgressRing } from '@vscode/webview-ui-toolkit/react';
import './Loader.css';

export const FullScreenLoader = () => {
  const [shouldShowMessage, setShouldShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShouldShowMessage(true), 3000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="loader-container__full-screen">
      <VSCodeProgressRing />
      {shouldShowMessage && <p>Looks like it takes longer than we expected...</p>}
    </div>
  );
};
