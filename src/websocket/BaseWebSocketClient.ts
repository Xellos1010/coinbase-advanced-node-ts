import WebSocket from "ws";
import BaseClient from "../BaseClient";
import KeyFileConfig from "../config/KeyFileConfig";
import logger from "../utils/logger";
import {
  WS_BASE_URL,
  WS_RETRY_BASE,
  WS_RETRY_FACTOR,
  WS_RETRY_MAX,
  SUBSCRIBE_MESSAGE_TYPE,
  UNSUBSCRIBE_MESSAGE_TYPE,
  WS_AUTH_CHANNELS,
} from "../config/constants";

class WSClientException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WSClientException";
  }
}

class WSClientConnectionClosedException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WSClientConnectionClosedException";
  }
}

interface SubscriptionMessage {
  type: string;
  product_ids: string[];
  channels: string[];
  jwt?: string;
}

class BaseWebSocketClient extends BaseClient {
  private ws?: WebSocket;
  private retryCount = 0;
  private subscriptions: { [key: string]: Set<string> } = {};
  private backgroundException?: Error;
  private retrying = false;
  public retry = true;

  constructor(configOrFilePath?: KeyFileConfig | string) {
    super(configOrFilePath);
  }

  public connect(urlPath: string): void {
    this.checkKeyFileConfig();
    const token = this.generateJWT();
    const url = `wss://${WS_BASE_URL}${urlPath}?token=${token}`;

    this.ws = new WebSocket(url);

    this.ws.on("open", this.onOpen);
    this.ws.on("message", this.onMessage);
    this.ws.on("error", this.onError);
    this.ws.on("close", this.onClose);
  }

  private onOpen = (): void => {
    logger.info("WebSocket connection opened.");
    if (this.retrying) {
      this.resubscribe();
    }
  };

  private onMessage = (data: WebSocket.Data): void => {
    logger.info(`Received: ${data}`);
  };

  private onError = (error: Error): void => {
    logger.error(`WebSocket error: ${error.message}`);
    this.backgroundException = new WSClientException(`WebSocket error: ${error.message}`);
  };

  private onClose = (): void => {
    logger.info("WebSocket connection closed.");
    if (this.retry) {
      this.retryConnection();
    }
  };

  public sendMessage(message: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      logger.error("WebSocket is not open.");
    }
  }

  public close(): void {
    if (this.ws) {
      this.ws.close();
    }
  }

  public async subscribe(
    productIds: string[],
    channels: string[]
  ): Promise<void> {
    this.ensureWebSocketOpen();
    for (const channel of channels) {
      if (!this.isAuthenticated() && WS_AUTH_CHANNELS.has(channel)) {
        throw new WSClientException("Unauthenticated request to private channel.");
      }

      const message = this.buildSubscriptionMessage(
        productIds,
        channel,
        SUBSCRIBE_MESSAGE_TYPE
      );
      await this.wsSend(JSON.stringify(message));

      if (!this.subscriptions[channel]) {
        this.subscriptions[channel] = new Set();
      }
      productIds.forEach((id) => this.subscriptions[channel].add(id));
    }
  }

  public async unsubscribe(
    productIds: string[],
    channels: string[]
  ): Promise<void> {
    this.ensureWebSocketOpen();
    for (const channel of channels) {
      if (!this.isAuthenticated() && WS_AUTH_CHANNELS.has(channel)) {
        throw new WSClientException("Unauthenticated request to private channel.");
      }

      const message = this.buildSubscriptionMessage(
        productIds,
        channel,
        UNSUBSCRIBE_MESSAGE_TYPE
      );
      await this.wsSend(JSON.stringify(message));

      if (this.subscriptions[channel]) {
        productIds.forEach((id) => this.subscriptions[channel].delete(id));
      }
    }
  }

  public async unsubscribeAll(): Promise<void> {
    for (const [channel, productIds] of Object.entries(this.subscriptions)) {
      await this.unsubscribe(Array.from(productIds), [channel]);
    }
  }

  private buildSubscriptionMessage(
    productIds: string[],
    channel: string,
    type: string
  ): SubscriptionMessage {
    return {
      type,
      product_ids: productIds,
      channels: [channel],
      ...(this.isAuthenticated() ? { jwt: this.generateJWT() } : {}),
    };
  }

  private ensureWebSocketOpen(): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new WSClientException("WebSocket is not open.");
    }
  }

  private async wsSend(message: string): Promise<void> {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      throw new WSClientException("WebSocket is not open.");
    }
  }

  private async resubscribe(): Promise<void> {
    for (const [channel, productIds] of Object.entries(this.subscriptions)) {
      await this.subscribe(Array.from(productIds), [channel]);
    }
  }

  private async retryConnection(): Promise<void> {
    this.retryCount = 0;
    this.retrying = true;
    const retry = async () => {
      if (this.retryCount < WS_RETRY_MAX) {
        this.retryCount += 1;
        try {
          logger.info(`Retrying connection attempt ${this.retryCount}`);
          this.connect("");
          this.retrying = false;
        } catch (error) {
          logger.error(`Retry attempt ${this.retryCount} failed.`);
          setTimeout(
            retry,
            WS_RETRY_BASE * Math.pow(WS_RETRY_FACTOR, this.retryCount)
          );
        }
      } else {
        this.retrying = false;
        this.subscriptions = {};
        throw new WSClientConnectionClosedException("Max retry attempts reached.");
      }
    };
    retry();
  }

  private sleepWithExceptionCheck(ms: number): void {
    const end = Date.now() + ms;
    while (Date.now() < end) {
      if (this.backgroundException) {
        throw this.backgroundException;
      }
    }
  }

  private isAuthenticated(): boolean {
    return (
      !!this.keyFile &&
      !!this.keyFile.getKeyName() &&
      !!this.keyFile.getKeySecret()
    );
  }
}

export default BaseWebSocketClient;
