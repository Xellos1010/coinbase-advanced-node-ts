import WebSocket from "ws";
import BaseClient from "../BaseClient";
import KeyFileConfig from "../config/KeyFileConfig";
import logger from "../utils/logger";
import {
  WS_BASE_URL,
  WS_RETRY_BASE,
  WS_RETRY_FACTOR,
  WS_RETRY_MAX,
  // USER_AGENT,
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

class BaseWebSocketClient extends BaseClient {
  private ws?: WebSocket;
  private retryCount = 0;
  private subscriptions: { [key: string]: Set<string> } = {};
  private backgroundException?: Error;
  private retrying = false;
  public retry = true; // Default to true, same as the Python version

  constructor(config?: KeyFileConfig) {
    super(config);
    this.baseURL = WS_BASE_URL;
  }

  /**
   * Connect to the WebSocket server.
   * @param urlPath - The path to the WebSocket endpoint.
   */
  public connect(urlPath: string): void {
    this.checkKeyFileConfig(); // Ensure config is available

    // Generate the JWT token
    const token = this.generateJWT("GET", urlPath);

    // Construct the WebSocket URL
    const url = `wss://${this.baseURL}${urlPath}?token=${token}`;

    // Create a new WebSocket connection
    this.ws = new WebSocket(url);

    // Setup event listeners
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
    this.backgroundException = new WSClientException(
      `WebSocket error: ${error.message}`
    );
  };

  private onClose = (): void => {
    logger.info("WebSocket connection closed.");
    if (this.retry) {
      this.retryConnection();
    }
  };

  /**
   * Send a message to the WebSocket server.
   * @param message - The message to send.
   */
  public sendMessage(message: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      logger.error("WebSocket is not open.");
    }
  }

  /**
   * Close the WebSocket connection.
   */
  public close(): void {
    if (this.ws) {
      this.ws.close();
    }
  }

  /**
   * Subscribe to a list of channels for a list of product ids.
   * @param productIds - Product ids to subscribe to
   * @param channels - Channels to subscribe to
   */
  public async subscribe(
    productIds: string[],
    channels: string[]
  ): Promise<void> {
    this.ensureWebSocketOpen();
    for (const channel of channels) {
      if (!this.isAuthenticated() && WS_AUTH_CHANNELS.has(channel)) {
        throw new WSClientException(
          "Unauthenticated request to private channel."
        );
      }

      const message = this.buildSubscriptionMessage(
        productIds,
        channel,
        SUBSCRIBE_MESSAGE_TYPE
      );
      await this.wsSend(JSON.stringify(message));

      // Add to subscriptions map
      if (!this.subscriptions[channel]) {
        this.subscriptions[channel] = new Set();
      }
      productIds.forEach((id) => this.subscriptions[channel].add(id));
    }
  }

  /**
   * Unsubscribe from a list of channels for a list of product ids.
   * @param productIds - Product ids to unsubscribe from
   * @param channels - Channels to unsubscribe from
   */
  public async unsubscribe(
    productIds: string[],
    channels: string[]
  ): Promise<void> {
    this.ensureWebSocketOpen();
    for (const channel of channels) {
      if (!this.isAuthenticated() && WS_AUTH_CHANNELS.has(channel)) {
        throw new WSClientException(
          "Unauthenticated request to private channel."
        );
      }

      const message = this.buildSubscriptionMessage(
        productIds,
        channel,
        UNSUBSCRIBE_MESSAGE_TYPE
      );
      await this.wsSend(JSON.stringify(message));

      // Remove from subscriptions map
      if (this.subscriptions[channel]) {
        productIds.forEach((id) => this.subscriptions[channel].delete(id));
      }
    }
  }

  /**
   * Unsubscribe from all channels.
   */
  public async unsubscribeAll(): Promise<void> {
    for (const [channel, productIds] of Object.entries(this.subscriptions)) {
      await this.unsubscribe(Array.from(productIds), [channel]);
    }
  }

  private buildSubscriptionMessage(
    productIds: string[],
    channel: string,
    type: string
  ): object {
    return {
      type,
      product_ids: productIds,
      channels: [channel],
      ...(this.isAuthenticated()
        ? { jwt: this.generateJWT("GET", channel) }
        : {}),
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
        throw new WSClientConnectionClosedException(
          "Max retry attempts reached."
        );
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
