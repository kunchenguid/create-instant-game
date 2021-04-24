import Phaser from 'phaser';

import { currentPlatform } from '../platform/autoDetect';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  public create() {
    currentPlatform.startGameAsync().then(() => {
      this.scene.start('Main');
    });
  }
}
