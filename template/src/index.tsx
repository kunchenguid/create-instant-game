import {
  activePlatform,
  startEstimatedProgressReporter,
} from 'instant-game-utils';
import React from 'react';
import ReactDOM from 'react-dom';

import Game from './components/Game';
import './index.css';

// start initializing the game once DOM is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
  await activePlatform.initializeAsync();
  startEstimatedProgressReporter(activePlatform);
  ReactDOM.render(
    <React.StrictMode>
      <Game />
    </React.StrictMode>,
    document.getElementById('root')
  );
});
