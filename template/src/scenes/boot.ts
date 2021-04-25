import { activePlatform } from 'create-instant-game';
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
