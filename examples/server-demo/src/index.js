import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

ReactDOM.hydrate(
  <React.StrictMode>
    <App initialRecommendations={window.__APP_INITIAL_STATE__} />
  </React.StrictMode>,
  document.getElementById('root')
);
