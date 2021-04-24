interface IDeviceSettingsData {
  musicVolume: number;
  soundVolume: number;
}

const defaultDeviceSettings = {
  musicVolume: 0.5,
  soundVolume: 1,
};

export class DeviceSettings {
  private static singleton: DeviceSettings;
  public static get instance() {
    if (!DeviceSettings.singleton) {
      DeviceSettings.singleton = new DeviceSettings();
    }
    return DeviceSettings.singleton;
  }

  private data: IDeviceSettingsData;
  private isConstructedFromDefault: boolean;

  private constructor() {
    const storedValue = window.localStorage.getItem('DEVICE_SETTINGS_DATA');
    if (!storedValue) {
      this.isConstructedFromDefault = true;
      this.data = defaultDeviceSettings;
      this.flush();
    } else {
      this.isConstructedFromDefault = false;
      this.data = {
        ...defaultDeviceSettings,
        ...JSON.parse(storedValue),
      };
      this.flush();
    }
  }

  public setDefault() {
    if (this.isConstructedFromDefault) {
      // populate default values
    }
  }

  get musicVolume() {
    return this.data.musicVolume;
  }
  set musicVolume(value: number) {
    this.data.musicVolume = value;
    this.flush();
  }

  get soundVolume() {
    return this.data.soundVolume;
  }
  set soundVolume(value: number) {
    this.data.soundVolume = value;
    this.flush();
  }

  public flush() {
    window.localStorage.setItem(
      'DEVICE_SETTINGS_DATA',
      JSON.stringify(this.data)
    );
  }
}
