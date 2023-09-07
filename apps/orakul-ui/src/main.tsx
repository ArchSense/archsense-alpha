import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import config from './services/config.ts';
import Extension from './components/App/Extension.tsx';
import App from './components/App/App.tsx';

console.log('Running standalone', config.standalone);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    {config.standalone ? <App /> : <Extension />}
  </React.StrictMode>,
);
