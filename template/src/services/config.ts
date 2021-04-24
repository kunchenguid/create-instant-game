export enum GameConfigKey {
  localhost,
  in_context,
  reset_player_data,
}

export class GameConfig {
  private static singleton: GameConfig;
  public static get instance() {
    if (!GameConfig.singleton) {
      GameConfig.singleton = new GameConfig();
    }
    return GameConfig.singleton;
  }

  private values: Map<GameConfigKey, number>;

  private constructor() {
    this.values = new Map<GameConfigKey, number>([
      [GameConfigKey.localhost, 0],
      [GameConfigKey.reset_player_data, 0],
      [GameConfigKey.in_context, 0],
    ]);
  }

  get keys() {
    return Array.from(this.values.keys());
  }

  public getBooleanConfig(key: GameConfigKey): boolean {
    return Boolean(this.values.get(key));
  }

  public getNumberConfig(key: GameConfigKey): number {
    const result = this.values.get(key);
    if (result === undefined) {
      return 0;
    }
    return result;
  }

  public setConfig(key: GameConfigKey, value: number) {
    this.values.set(key, value);
  }
}
