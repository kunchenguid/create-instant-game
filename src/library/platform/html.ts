import { SessionConfig, SessionConfigKey } from '../services/sessionConfig';
import {
  FriendInfo,
  LocalizableContent,
  PlatformBase,
  TargetPlatform,
} from './index';

export class HtmlPlatform extends PlatformBase {
  private loadingScreen: HTMLDivElement | null = null;
  private loadingProgressText: HTMLDivElement | null = null;
  private contextId: string | null;

  constructor() {
    super(TargetPlatform.HTML);
    this.contextId = null;
  }

  public async initializeAsync(): Promise<void> {
    this.setupCrashReporter();
    await this.getConfigAsync();

    const resetPlayerData = SessionConfig.instance.getBooleanConfig(
      SessionConfigKey.reset_player_data
    );
    if (resetPlayerData) {
      window.localStorage.clear();
    }

    this.contextId = SessionConfig.instance.getBooleanConfig(
      SessionConfigKey.in_context
    )
      ? 'HTML_PLATFORM_FAKE_CONTEXT_ID'
      : null;

    this.loadingScreen = document.createElement('div');
    this.loadingScreen.id = 'cig-loading-screen';
    document.body.appendChild(this.loadingScreen);

    this.loadingProgressText = document.createElement('div');
    this.loadingProgressText.id = 'cig-loading-text';
    this.loadingProgressText.innerText = 'Loading...';
    this.loadingProgressText.style.color = '#000000';
    this.loadingProgressText.style.fontSize = '24px';
    this.loadingScreen.appendChild(this.loadingProgressText);
  }

  public getOS() {
    return 'WEB';
  }
  public getLocale() {
    return 'en_US';
  }

  public setLoadingProgress(value: number): void {
    if (this.loadingProgressText) {
      this.loadingProgressText.innerText = `Loading... ${value.toFixed()}%`;
    }
  }

  public async startGameAsync(): Promise<void> {
    if (this.loadingScreen) {
      this.loadingScreen.remove();
    }
    return Promise.resolve();
  }

  public getPlayerID(): string {
    const storedId = window.localStorage.getItem('LOCAL_PLAYER_ID');
    if (storedId) {
      return storedId;
    }
    const newId = `LOCAL_${Math.random().toFixed(8)}`;
    window.localStorage.setItem('LOCAL_PLAYER_ID', newId);
    return newId;
  }

  public getPlayerName(): string {
    return this.getPlayerID();
  }

  public getPlayerPhotoURL(): string {
    return 'DefaultPlayer.png';
  }

  public async getPlayerDataAsync(
    keys: string[]
  ): Promise<Map<string, string>> {
    const result = new Map<string, string>();
    keys.forEach((key) => {
      result.set(key, window.localStorage.getItem(key) || '');
    });
    return result;
  }

  public async setPlayerDataAsync(kvps: Map<string, string>): Promise<void> {
    kvps.forEach((value, key) => {
      window.localStorage.setItem(key, value);
    });
  }

  public async flushPlayerDataAsync(): Promise<void> {
    // no-op
  }

  public postUpdate(
    _templateId: string,
    text: string | LocalizableContent,
    image: string,
    _cta: string | null,
    _data: object | null,
    _push: boolean,
    _immediate: boolean
  ) {
    // tslint:disable-next-line:no-console
    console.log('Posting Custom Update: ');
    // tslint:disable-next-line:no-console
    console.dir(text);
    this.printImage(image);
  }

  public sendMoment(image: string, data: object | null) {
    // tslint:disable-next-line:no-console
    console.log('Sending moment:');
    // tslint:disable-next-line:no-console
    console.log(JSON.stringify(data));
    this.printImage(image);
  }

  public async getFriendsAsync(): Promise<Map<string, FriendInfo>> {
    return new Map<string, FriendInfo>([
      [
        'LOCAL_0.32205651',
        {
          id: 'LOCAL_0.32205651',
          name: 'Fake Player 1',
          photoUrl: 'textures/default_player_photo.png',
        },
      ],
    ]);
  }

  public shareAsync(
    text: string,
    image: string,
    _data: object | null
  ): Promise<void> {
    // tslint:disable-next-line:no-console
    console.log(`shareAsync: ${text}`);
    this.printImage(image);
    return Promise.resolve();
  }

  public getContextType(): string {
    return this.contextId ? 'THREAD' : 'SOLO';
  }

  public getContextID(): string | null {
    return this.contextId;
  }

  public async getContextPlayersAsync(): Promise<Map<string, FriendInfo>> {
    const result = new Map<string, FriendInfo>([
      [
        'HTML_PLATFORM_FAKE_PLAYER_1',
        {
          id: 'HTML_PLATFORM_FAKE_PLAYER_1',
          name: 'Fake Player 1',
          photoUrl: 'textures/default_player_photo.png',
        },
      ],
      [
        'HTML_PLATFORM_FAKE_PLAYER_2',
        {
          id: 'HTML_PLATFORM_FAKE_PLAYER_2',
          name: 'Fake Player 2',
          photoUrl: 'textures/default_player_photo.png',
        },
      ],
      [
        'HTML_PLATFORM_FAKE_PLAYER_3',
        {
          id: 'HTML_PLATFORM_FAKE_PLAYER_3',
          name: 'Fake Player 3',
          photoUrl: 'textures/default_player_photo.png',
        },
      ],
    ]);
    result.set(this.getPlayerID(), {
      id: this.getPlayerID(),
      name: this.getPlayerName(),
      photoUrl: this.getPlayerPhotoURL(),
    });
    return result;
  }

  public async switchGameAsync(gameId: string): Promise<void> {
    window.alert(`switching to ${gameId}`);
  }

  public chooseContextAsync(_newContextOnly: boolean): Promise<string | null> {
    if (window.confirm('switch into context?')) {
      this.contextId = 'HTML_PLATFORM_FAKE_CONTEXT_ID';
      // tslint:disable-next-line:no-console
      console.log('[Platform] [Switching context...]');
      return Promise.resolve(this.contextId);
    }
    return Promise.reject(new Error('rejected'));
  }

  public switchContextAsync(contextId: string): Promise<string | null> {
    if (window.confirm(`switch into ${contextId}?`)) {
      this.contextId = contextId;
      // tslint:disable-next-line:no-console
      console.log('[Platform] [Switching context...]');
      return Promise.resolve(this.contextId);
    }
    return Promise.reject(new Error('rejected'));
  }

  public createContextAsync(_playerId: string[]): Promise<string | null> {
    if (window.confirm('switch into context?')) {
      this.contextId = 'HTML_PLATFORM_FAKE_CONTEXT_ID';
      // tslint:disable-next-line:no-console
      console.log('[Platform] [Switching context...]');
      return Promise.resolve(this.contextId);
    }
    return Promise.reject(new Error('rejected'));
  }

  public logEvent(
    eventName: string,
    eventData: Map<string, string> | null,
    valueToSum: number | null
  ) {
    // tslint:disable-next-line:no-console
    console.log(
      `[Analytics] [${eventName}] [${JSON.stringify(
        eventData
      )}] [Value: ${JSON.stringify(valueToSum)}]`
    );
  }

  public getEntryPointData(): object | null {
    return null;
  }

  public async getEntryPointAsync(): Promise<string> {
    return 'html';
  }

  public setUserProperty(kvps: object) {
    // tslint:disable-next-line:no-console
    console.log(`[Analytics] [UserProperty] ${JSON.stringify(kvps)}`);
  }

  public async startPrefetchingAdsAsync(): Promise<void> {
    return;
  }

  public async showInterstitialAsync(): Promise<void> {
    window.alert('this is an interstitial ad');
  }

  public async showRewardedVideoAsync(): Promise<void> {
    window.alert('this is a rewarded video ad');
  }

  public quit() {
    window.location.reload(true);
  }

  private setupCrashReporter() {
    window.onerror = (msg, url, lineNo, columnNo, error) => {
      const reportDiv = document.createElement('div');
      reportDiv.id = 'cig-error-report';

      const title = document.createElement('div');
      title.className = 'title';
      title.innerText = 'We Crashed!';
      reportDiv.appendChild(title);

      const text = document.createElement('pre');
      text.innerText = `
Message:
${msg}
Url:
${url}
Line:
${lineNo}
Col:
${columnNo}
Error:
${error ? error.stack : 'not available'}
      `;
      reportDiv.appendChild(text);
      document.body.appendChild(reportDiv);
    };
  }

  private getConfigAsync(): Promise<void> {
    return new Promise((resolve) => {
      const optionsDiv = document.createElement('div');
      optionsDiv.id = 'cig-options';
      document.body.appendChild(optionsDiv);

      for (const key of SessionConfig.instance.keys) {
        const configKey = SessionConfigKey[key];
        const rowDiv = document.createElement('div');
        rowDiv.className = 'row';
        optionsDiv.appendChild(rowDiv);

        const labelDiv = document.createElement('div');
        labelDiv.className = 'label';
        labelDiv.innerText = configKey;
        rowDiv.appendChild(labelDiv);

        const checkbox = document.createElement('input');
        checkbox.id = `checkbox_${key}`;
        checkbox.type = 'checkbox';
        checkbox.checked = SessionConfig.instance.getBooleanConfig(key);
        rowDiv.appendChild(checkbox);
      }

      const buttonRowDiv = document.createElement('div');
      buttonRowDiv.className = 'row';
      optionsDiv.appendChild(buttonRowDiv);

      const buttonStartGame = document.createElement('button');
      buttonStartGame.id = 'cig-button-start-game';
      buttonStartGame.innerText = 'Start';
      buttonRowDiv.appendChild(buttonStartGame);

      buttonStartGame.onclick = () => {
        for (const key of SessionConfig.instance.keys) {
          const checkbox = document.getElementById(
            `checkbox_${key}`
          ) as HTMLInputElement;
          SessionConfig.instance.setConfig(key, checkbox.checked ? 1 : 0);
        }
        optionsDiv.remove();
        resolve();
      };
    });
  }

  private getImagePrintDimensions(width: number, height: number) {
    return {
      string: '+',
      style: `font-size: 1px; padding: ${Math.floor(height / 2)}px
        ${Math.floor(width / 2)}px; line-height: ${height}px;`,
    };
  }

  private printImage(url: string) {
    const img = new Image();

    img.onload = () => {
      const dim = this.getImagePrintDimensions(img.width, img.height);
      // tslint:disable-next-line:no-console
      console.log(
        `%c${dim.string}`,
        `${dim.style} background: url(${url});
        background-size: ${img.width}px ${img.height}px;
        color: transparent;`
      );
    };

    img.src = url;
  }
}
