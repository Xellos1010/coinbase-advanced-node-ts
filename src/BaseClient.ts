// src\BaseClient.ts
import { sign } from "jsonwebtoken";
import * as crypto from "crypto";
import axios, { AxiosRequestConfig, Method, AxiosResponse } from "axios";
import KeyFileConfig from "./config/KeyFileConfig";
import { loadKeyfile } from "./config/KeyLoader";
// import logger from "./utils/logger"; // import logger

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

  protected async sendRequest(
    httpMethod: Method,
    urlPath: string,
    params: object = {},
    headers: object = {},
    data: object = {},
    retries = 3
  ): Promise<any> {
    const url = `https://${this.baseURL}${urlPath}`;
    const initialBackoff = 1000;
    let attempts = 0;

    while (attempts < retries) {
      try {
        const config: AxiosRequestConfig = {
          method: httpMethod,
          url,
          params,
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

  protected async executeAuthenticatedRequest(
    method: Method,
    path: string,
    queryString?: string,
    data?: object,
    retries = 3
  ): Promise<any> {
    const token = this.generateJWT(method, path);
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    return this.sendRequest(method, path + (queryString ? `?${queryString}` : ''), {}, headers, data, retries);
  }

  protected async executePublicRequest(
    method: Method,
    path: string,
    queryString?: string,
    data?: object,
    retries = 3
  ): Promise<any> {
    const headers = {
      "Content-Type": "application/json",
    };
    return this.sendRequest(method, path + (queryString ? `?${queryString}` : ''), {}, headers, data, retries);
  }

  private async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private handleException(response: AxiosResponse) {
    if (response.status >= 400) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }
  }

  protected async getRequest(path: string, queryString?: string) {
    return await this.executeAuthenticatedRequest("GET", path, queryString);
  }

  protected async postRequest(path: string, data: object, queryString?: string) {
    return await this.executeAuthenticatedRequest("POST", path, queryString, data);
  }

  protected async putRequest(path: string, data: object, queryString?: string) {
    return await this.executeAuthenticatedRequest("PUT", path, queryString, data);
  }

  protected async deleteRequest(path: string, queryString?: string) {
    return await this.executeAuthenticatedRequest("DELETE", path, queryString);
  }

  protected async getPublicRequest(path: string, queryString?: string) {
    return await this.executePublicRequest("GET", path, queryString);
  }

  protected async postPublicRequest(path: string, data: object, queryString?: string) {
    return await this.executePublicRequest("POST", path, queryString, data);
  }
}

export default BaseClient;
