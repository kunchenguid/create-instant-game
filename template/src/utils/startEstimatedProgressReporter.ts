import { PlatformBase } from '../platform';

export const startEstimatedProgressReporter = (platform: PlatformBase) => {
  let progress = 1;
  const TOTAL_DURATION = 5000;
  const TICK_INTERVAL = 30;
  const TICK_PROBABILITY = (100 * TICK_INTERVAL) / TOTAL_DURATION;
  const timer = window.setInterval(() => {
    platform.setLoadingProgress(progress);
    if (Math.random() < TICK_PROBABILITY) {
      progress += 1;
    }
    if (progress >= 100) {
      window.clearInterval(timer);
    }
  }, TICK_INTERVAL);
};
