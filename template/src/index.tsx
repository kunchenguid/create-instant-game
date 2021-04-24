import React from 'react';
import ReactDOM from 'react-dom';

import Game from './components/Game';
import './index.css';
import { currentPlatform } from './platform/autoDetect';
import { startEstimatedProgressReporter } from './utils/startEstimatedProgressReporter';

// start initializing the game once DOM is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
  await currentPlatform.initializeAsync();
  startEstimatedProgressReporter(currentPlatform);
  ReactDOM.render(
    <React.StrictMode>
      <Game />
    </React.StrictMode>,
    document.getElementById('root')
  );
});
