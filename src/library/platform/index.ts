export enum TargetPlatform {
  HTML,
  FBINSTANT,
}

export type FriendInfo = {
  id: string;
  name: string;
  photoUrl: string;
};

export type LocalizableContent = {
  default: string;
  localizations: {
    [locale: string]: string;
  };
};

export abstract class PlatformBase {
  constructor(public readonly platform: TargetPlatform) {}

  abstract initializeAsync(): Promise<void>;

  abstract getOS(): string;
  abstract getLocale(): string;

  abstract setLoadingProgress(value: number): void;

  abstract startGameAsync(): Promise<void>;

  abstract getPlayerID(): string;
  abstract getPlayerName(): string;
  abstract getPlayerPhotoURL(): string;

  abstract getPlayerDataAsync(keys: string[]): Promise<Map<string, string>>;
  abstract setPlayerDataAsync(kvps: Map<string, string>): Promise<void>;
  abstract flushPlayerDataAsync(): Promise<void>;

  abstract postUpdate(
    templateId: string,
    text: string | LocalizableContent,
    image: string,
    cta: string | null,
    data: object | null,
    push: boolean,
    immediate: boolean
  ): void;

  abstract sendMoment(image: string, data: object | null): void;

  abstract shareAsync(
    text: string,
    image: string,
    data: object | null
  ): Promise<void>;

  abstract getFriendsAsync(): Promise<Map<string, FriendInfo>>;

  abstract getContextType(): string;
  abstract getContextID(): string | null;
  abstract chooseContextAsync(newContextOnly: boolean): Promise<string | null>;
  abstract switchContextAsync(contextId: string): Promise<string | null>;
  abstract createContextAsync(playerIds: string[]): Promise<string | null>;
  abstract getContextPlayersAsync(): Promise<Map<string, FriendInfo>>;

  abstract logEvent(
    eventName: string,
    eventData: Map<string, string> | null,
    valueToSum: number | null
  ): void;

  abstract getEntryPointData(): object | null;
  abstract getEntryPointAsync(): Promise<string>;

  abstract switchGameAsync(gameId: string): Promise<void>;

  abstract setUserProperty(kvps: object): void;

  abstract startPrefetchingAdsAsync(): Promise<void>;
  abstract showInterstitialAsync(): Promise<void>;
  abstract showRewardedVideoAsync(): Promise<void>;

  abstract quit(): void;
}
