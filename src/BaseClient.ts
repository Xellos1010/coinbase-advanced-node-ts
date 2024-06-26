import { sign } from "jsonwebtoken";
import * as crypto from "crypto";
import KeyFileConfig from "./config/KeyFileConfig";
import { loadKeyfile } from "./config/KeyLoader";

class BaseClient {
  protected keyFile?: KeyFileConfig;
  protected baseURL?: String;

  // Constructor signatures
  constructor(config: KeyFileConfig);
  constructor(configFilePath: string);
  constructor(configOrFilePath?: KeyFileConfig | string);

  // Single constructor implementation
  constructor(configOrFilePath?: KeyFileConfig | string) {
    if (typeof configOrFilePath === "string") {
      // Handle string configFilePath
      const configData = loadKeyfile(configOrFilePath);
      this.keyFile = KeyFileConfig.getInstance(configData.name, configData.privateKey);
    } else if (configOrFilePath instanceof KeyFileConfig) {
      // Handle Config object
      this.keyFile = configOrFilePath;
    } else {
      // Handle undefined
      this.keyFile = undefined;
    }
  }

  protected checkKeyFileConfig(): void {
    if (!this.keyFile) {
      throw new Error("Configuration is required for authenticated requests.");
    }
  }

  protected generateJWT(requestMethod?: string, requestPath?: string): string {
    this.checkKeyFileConfig();
    const algorithm = "ES256";
    // Define the payload with a possible uri property
    const payload: {
      iss: string;
      nbf: number;
      exp: number;
      sub: string;
      uri?: string;
    } = {
      iss: "cdp",
      nbf: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 120,
      sub: this.keyFile!.getKeyName(),
    };

    if (requestMethod && requestPath) {
      payload.uri = this.formatJWTUri(requestMethod, requestPath);
    }

    const header = {
      alg: algorithm,
      kid: this.keyFile!.getKeyName(),
      nonce: crypto.randomBytes(16).toString("hex"),
    };

    return sign(payload, this.keyFile!.getKeySecret(), { algorithm, header });
  }

  protected formatJWTUri(method: string, path: string): string {
    return `${method} ${this.baseURL}${path}`;
  }
}

export default BaseClient;
