import { SessionConfig, SessionConfigKey } from '../services/sessionConfig';
import {
  PlatformBase,
  TargetPlatform,
  FriendInfo,
  LocalizableContent,
} from './index';

type ConnectedPlayer = {
  getID: () => string;
  getName: () => string;
  getPhoto: () => string;
};

interface AdInstance {
  loadAsync(): Promise<void>;
  showAsync(): Promise<void>;
}

export class FBInstantPlatform extends PlatformBase {
  private startedPrefetchingAds: boolean;
  private interstitialAdInstances: AdInstance[];
  private rewardedVideoAdInstances: AdInstance[];
  private FBInstant: any;

  constructor() {
    super(TargetPlatform.FBINSTANT);

    this.startedPrefetchingAds = false;
    this.interstitialAdInstances = [];
    this.rewardedVideoAdInstances = [];
    this.FBInstant = ((window as unknown) as Record<string, unknown>)[
      'FBInstant'
    ] as any;

    SessionConfig.instance.setConfig(SessionConfigKey.localhost, 0);
    SessionConfig.instance.setConfig(SessionConfigKey.reset_player_data, 0);
  }

  async initializeAsync(): Promise<void> {
    await this.FBInstant.initializeAsync();
    this.setupErrorReporting();
  }

  getOS() {
    return this.FBInstant.getPlatform();
  }
  getLocale() {
    return this.FBInstant.getLocale();
  }

  setLoadingProgress(value: number): void {
    this.FBInstant.setLoadingProgress(value);
  }

  async startGameAsync(): Promise<void> {
    await this.FBInstant.startGameAsync();
    this.FBInstant.setSessionData({
      locale: this.FBInstant.getLocale(),
    });
  }

  getPlayerID(): string {
    return this.FBInstant.player.getID();
  }

  getPlayerName(): string {
    return this.FBInstant.player.getName();
  }

  getPlayerPhotoURL(): string {
    return this.FBInstant.player.getPhoto();
  }

  async getPlayerDataAsync(keys: string[]): Promise<Map<string, string>> {
    const result = new Map<string, string>();
    const data: Record<string, any> = await this.FBInstant.player.getDataAsync(
      keys
    );
    Object.keys(data).forEach((key) => {
      result.set(key, data[key]);
    });
    return result;
  }

  async setPlayerDataAsync(kvps: Map<string, string>): Promise<void> {
    const obj: Record<string, any> = {};
    kvps.forEach((value, key) => {
      obj[key] = value;
    });
    try {
      await this.FBInstant.player.setDataAsync(obj);
    } catch (e) {
      this.logEvent(
        'exception',
        new Map<string, string>([
          ['description', JSON.stringify(e)],
          ['fatal', 'false'],
        ]),
        null
      );
    }
  }

  async flushPlayerDataAsync(): Promise<void> {
    await this.FBInstant.player.flushDataAsync();
  }

  postUpdate(
    templateId: string,
    text: string | LocalizableContent,
    image: string,
    cta: string | null,
    data: object | null,
    push: boolean,
    immediate: boolean
  ) {
    const payload: Record<string, any> = {
      text,
      image,
      template: templateId,
      action: 'CUSTOM',
      strategy: immediate ? 'IMMEDIATE_CLEAR' : 'LAST',
      notification: push ? 'PUSH' : 'NO_PUSH',
    };
    if (cta) {
      payload['cta'] = cta;
    }
    if (data) {
      payload['data'] = data;
    }

    this.FBInstant.updateAsync(payload).catch(() => {});
  }

  sendMoment(image: string, data: object | null) {
    this.FBInstant.sendImageAsync(image, data).catch(() => {});
  }

  shareAsync(text: string, image: string, data: object | null): Promise<void> {
    return this.FBInstant.shareAsync({
      image,
      text,
      data,
      intent: 'SHARE',
    });
  }

  async getFriendsAsync(): Promise<Map<string, FriendInfo>> {
    const friends: ConnectedPlayer[] = await this.FBInstant.player.getConnectedPlayersAsync();
    const result = new Map<string, FriendInfo>();
    friends.forEach((f) => {
      result.set(f.getID(), {
        id: f.getID(),
        name: f.getName(),
        photoUrl: f.getPhoto(),
      });
    });
    return result;
  }

  getContextType(): string {
    return this.FBInstant.context.getType();
  }

  getContextID(): string | null {
    return this.FBInstant.context.getID() || null;
  }

  async getContextPlayersAsync(): Promise<Map<string, FriendInfo>> {
    const result = new Map<string, FriendInfo>();
    try {
      const contextPlayers: ConnectedPlayer[] = await this.FBInstant.context.getPlayersAsync();
      contextPlayers.forEach((p) => {
        result.set(p.getID(), {
          id: p.getID(),
          name: p.getName(),
          photoUrl: p.getPhoto(),
        });
      });
    } catch (e) {
      // not in a context, swallow the error and return just the player itself
    }
    result.set(this.getPlayerID(), {
      id: this.getPlayerID(),
      name: this.getPlayerName(),
      photoUrl: this.getPlayerPhotoURL(),
    });
    return result;
  }

  async chooseContextAsync(newContextOnly: boolean): Promise<string | null> {
    if (newContextOnly) {
      await this.FBInstant.context.chooseAsync({
        filters: ['NEW_CONTEXT_ONLY'],
      });
    } else {
      await this.FBInstant.context.chooseAsync();
    }
    return this.getContextID();
  }

  async switchContextAsync(contextId: string): Promise<string | null> {
    await this.FBInstant.context.switchAsync(contextId);
    return this.getContextID();
  }

  async createContextAsync(playerIds: string[]): Promise<string | null> {
    if (playerIds.length !== 1) {
      throw new Error(
        'currently only support creating context with one other player'
      );
    }
    await this.FBInstant.context.createAsync(playerIds[0]);
    return this.getContextID();
  }

  logEvent(
    eventName: string,
    eventData: Map<string, string> | null,
    valueToSum: number | null
  ) {
    const dataToSend: Record<string, any> = {};
    if (eventData) {
      eventData.forEach((value, key) => {
        dataToSend[key] = value;
      });
    }
    if (valueToSum !== null) {
      dataToSend['value'] = valueToSum;
    }

    this.FBInstant.logEvent(eventName, valueToSum, dataToSend);
  }

  getEntryPointData(): object | null {
    return this.FBInstant.getEntryPointData();
  }

  getEntryPointAsync(): Promise<string> {
    return this.FBInstant.getEntryPointAsync()
      .catch(() => {})
      .then(() => {
        return '';
      });
  }

  switchGameAsync(gameId: string): Promise<void> {
    return this.FBInstant.switchGameAsync(gameId);
  }

  setUserProperty(_kvps: object) {
    // no-op
  }

  async startPrefetchingAdsAsync(): Promise<void> {
    if (this.startedPrefetchingAds) {
      return;
    }

    this.startedPrefetchingAds = true;
    this.kickoffNewInterstitialInstance();
    this.kickoffNewRewardedVideoInstance();
  }

  async showInterstitialAsync(): Promise<void> {
    if (this.interstitialAdInstances.length > 0) {
      const instance = this.interstitialAdInstances.shift();
      this.kickoffNewInterstitialInstance();

      if (instance) {
        this.logEvent('interstitial_shown', null, null);
        await instance.showAsync();
      }
    } else {
      this.logEvent('interstitial_not_loaded', null, null);
    }
  }

  async showRewardedVideoAsync(): Promise<void> {
    if (this.rewardedVideoAdInstances.length > 0) {
      const instance = this.rewardedVideoAdInstances.shift();
      this.kickoffNewRewardedVideoInstance();

      if (instance) {
        this.logEvent('rewarded_video_shown', null, null);
        await instance.showAsync();
      }
    } else {
      this.logEvent('rewarded_video_not_loaded', null, null);
    }
  }

  quit() {
    this.FBInstant.quit();
  }

  private kickoffNewInterstitialInstance() {
    const supportedAPIs: string[] = this.FBInstant.getSupportedAPIs();
    if (
      supportedAPIs.findIndex((api) => api === 'getInterstitialAdAsync') >= 0
    ) {
      this.FBInstant.getInterstitialAdAsync(
        '2454982111242253_2456335197773611'
      ).then((instance: AdInstance) => {
        this.loadAdInstance(instance, this.interstitialAdInstances, 1);
      });
    }
  }

  private kickoffNewRewardedVideoInstance() {
    const supportedAPIs: string[] = this.FBInstant.getSupportedAPIs();
    if (
      supportedAPIs.findIndex((api) => api === 'getRewardedVideoAsync') >= 0
    ) {
      this.FBInstant.getRewardedVideoAsync(
        '2454982111242253_2456335674440230'
      ).then((instance: AdInstance) => {
        this.loadAdInstance(instance, this.rewardedVideoAdInstances, 1);
      });
    }
  }

  private loadAdInstance(
    adInstance: AdInstance,
    pool: AdInstance[],
    backoffSeconds: number
  ) {
    adInstance
      .loadAsync()
      .then(() => {
        pool.push(adInstance);
      })
      .catch(() => {
        window.setTimeout(() => {
          this.loadAdInstance(adInstance, pool, backoffSeconds);
        }, backoffSeconds * 1000);
      });
  }

  private setupErrorReporting() {
    const reportedMessages = new Set<string>();

    window.onerror = (msg: any, _url, _lineNo, _columnNo, _error) => {
      const message = msg instanceof Event ? JSON.stringify(msg) : msg;
      if (!reportedMessages.has(message)) {
        this.logEvent(
          'exception',
          new Map<string, string>([
            ['description', message],
            ['fatal', 'true'],
          ]),
          null
        );
        reportedMessages.add(message);
      }
    };
  }
}
