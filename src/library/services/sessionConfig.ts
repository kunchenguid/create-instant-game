export enum SessionConfigKey {
  localhost,
  in_context,
  reset_player_data,
}

export class SessionConfig {
  private static singleton: SessionConfig;
  public static get instance() {
    if (!SessionConfig.singleton) {
      SessionConfig.singleton = new SessionConfig();
    }
    return SessionConfig.singleton;
  }

  private values: Map<SessionConfigKey, number>;

  private constructor() {
    this.values = new Map<SessionConfigKey, number>([
      [SessionConfigKey.localhost, 0],
      [SessionConfigKey.reset_player_data, 0],
      [SessionConfigKey.in_context, 0],
    ]);
  }

  get keys() {
    return Array.from(this.values.keys());
  }

  public getBooleanConfig(key: SessionConfigKey): boolean {
    return Boolean(this.values.get(key));
  }

  public getNumberConfig(key: SessionConfigKey): number {
    const result = this.values.get(key);
    if (result === undefined) {
      return 0;
    }
    return result;
  }

  public setConfig(key: SessionConfigKey, value: number) {
    this.values.set(key, value);
  }
}
