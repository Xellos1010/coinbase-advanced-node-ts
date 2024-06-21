// src\config\Config.ts
class KeyFileConfig {
  private static instances: Map<string, KeyFileConfig> = new Map();
  private keyName: string;
  private keySecret: string;

  private constructor(keyName: string, keySecret: string) {
    this.keyName = keyName;
    this.keySecret = keySecret;
  }

  public static getInstance(keyName: string, keySecret: string): KeyFileConfig {
    const key = `${keyName}:${keySecret}`;
    if (!KeyFileConfig.instances.has(key)) {
      KeyFileConfig.instances.set(key, new KeyFileConfig(keyName, keySecret));
    }
    return KeyFileConfig.instances.get(key) as KeyFileConfig;
  }

  public getKeyName(): string {
    return this.keyName;
  }

  public getKeySecret(): string {
    return this.keySecret;
  }
}

export default KeyFileConfig;
