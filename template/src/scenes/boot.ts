import { activePlatform } from 'instant-game-utils';
import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  public create() {
    activePlatform.startGameAsync().then(() => {
      this.scene.start('Main');
    });
  }
}
