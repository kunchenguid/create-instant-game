import { FBInstantPlatform } from './fbinstant';
import { HtmlPlatform } from './html';
import { PlatformBase } from './index';

export const autoDetectPlatform = () => {
  switch (process.env.REACT_APP_TARGET) {
    default:
    case 'HTML':
      return new HtmlPlatform();
    case 'FBINSTANT':
      return new FBInstantPlatform();
  }
};

export const activePlatform: PlatformBase = autoDetectPlatform();
