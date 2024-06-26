import { sign } from "jsonwebtoken";
import * as crypto from "crypto";
import axios, { AxiosRequestConfig, Method, AxiosResponse } from "axios";
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

  protected generateJWT(requestMethod: string, requestPath: string): string {
    this.checkKeyFileConfig(); // Ensure config is available
    const algorithm = "ES256";
    const uri = this.formatJWTUri(requestMethod, requestPath);
    const payload = {
      iss: "cdp",
      nbf: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 120,
      sub: this.keyFile!.getKeyName(),
      uri,
    };

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

  private objectToQueryString(params: object): string {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value instanceof Date) {
        queryParams.append(key, value.toISOString());
      } else if (typeof value === 'number') {
        queryParams.append(key, value.toString());
      } else if (value !== null && value !== undefined && value !== '') {
        queryParams.append(key, String(value));
      }
    });
    return queryParams.toString();
  }
  
  

  protected async sendRequest<T>(
    httpMethod: Method,
    urlPath: string,
    params: object = {},
    headers: object = {},
    data: object = {},
    retries = 3
  ): Promise<T> {
    const queryString = this.objectToQueryString(params);
    const url = `https://${this.baseURL}${urlPath}${queryString ? `?${queryString}` : ''}`;
    const initialBackoff = 1000;
    let attempts = 0;

    while (attempts < retries) {
      try {
        const config: AxiosRequestConfig = {
          method: httpMethod,
          url,
          params: {}, // Ensure axios does not add query params
          headers,
          data,
          timeout: 10000,
        };

        const response = await axios(config);
        this.handleException(response);

        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 429) {
          attempts++;
          const backoffTime = initialBackoff * Math.pow(2, attempts);
          await this.sleep(backoffTime);
        } else {
          throw error;
        }
      }
    }
    throw new Error("Max retries exceeded");
  }

  protected async executeAuthenticatedRequest<T>(
    method: Method,
    path: string,
    params: object = {},
    data?: object,
    retries = 3
  ): Promise<T> {
    const token = this.generateJWT(method, path);
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    return this.sendRequest<T>(method, path, params, headers, data, retries);
  }

  protected async executePublicRequest<T>(
    method: Method,
    path: string,
    params: object = {},
    data?: object,
    retries = 3
  ): Promise<T> {
    const headers = {
      "Content-Type": "application/json",
    };
    return this.sendRequest<T>(method, path, params, headers, data, retries);
  }

  private async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private handleException(response: AxiosResponse) {
    if (response.status >= 400) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }
  }

  protected async getRequest<T>(path: string, params: object = {}): Promise<T> {
    return await this.executeAuthenticatedRequest<T>("GET", path, params);
  }

  protected async postRequest<T>(path: string, data: object, params: object = {}): Promise<T> {
    return await this.executeAuthenticatedRequest<T>("POST", path, params, data);
  }

  protected async putRequest<T>(path: string, data: object, params: object = {}): Promise<T> {
    return await this.executeAuthenticatedRequest<T>("PUT", path, params, data);
  }

  protected async deleteRequest<T>(path: string, params: object = {}): Promise<T> {
    return await this.executeAuthenticatedRequest<T>("DELETE", path, params);
  }

  protected async getPublicRequest<T>(path: string, params: object = {}): Promise<T> {
    return await this.executePublicRequest<T>("GET", path, params);
  }

  protected async postPublicRequest<T>(path: string, data: object, params: object = {}): Promise<T> {
    return await this.executePublicRequest<T>("POST", path, params, data);
  }
}

export default BaseClient;
