import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import BaseClient from "../BaseClient";
import { BASE_URL, API_PREFIX } from "../config/constants";
import KeyFileConfig from "../config/KeyFileConfig";

class BaseRestClient extends BaseClient {
  constructor(configOrFilePath?: KeyFileConfig | string) {
    super(configOrFilePath);
    this.baseURL = `${BASE_URL}${API_PREFIX}`;
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

export default BaseRestClient;
