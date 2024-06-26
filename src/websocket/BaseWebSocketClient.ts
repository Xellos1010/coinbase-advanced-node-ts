import WebSocket from "ws";
import BaseClient from "../BaseClient";
import KeyFileConfig from "../config/KeyFileConfig";
import logger from "../utils/logger";
import {
  WS_BASE_URL,
  WS_RETRY_BASE,
  WS_RETRY_FACTOR,
  WS_RETRY_MAX,
  WS_AUTH_CHANNELS,
} from "../config/constants";
import { WSClientException } from "./errors/WSClientException";
import { WSClientConnectionClosedException } from "./errors/WSClientConnectionClosedException";
import { BaseWsChannel } from "./channels/BaseWsChannel";
import { HeartbeatsChannel } from "./channels/HeartbeatsChannel";
import { CandlesChannel } from "./channels/CandlesChannel";
import { MarketTradesChannel } from "./channels/MarketTradesChannel";
import { StatusChannel } from "./channels/StatusChannel";
import { TickerChannel } from "./channels/TickerChannel";
import { TickerBatchChannel } from "./channels/TickerBatchChannel";
import { Level2Channel } from "./channels/Level2Channel";
import { UserChannel } from "./channels/UserChannel";

class BaseWebSocketClient extends BaseClient {
  private ws?: WebSocket;
  private retryCount = 0;
  private channels: Map<string, BaseWsChannel<any, any>> = new Map();
  private backgroundException?: Error;
  private retrying = false;
  private listenersAdded = false;
  public retry = true;

  constructor(configOrFilePath?: KeyFileConfig | string) {
    super(configOrFilePath);
  }

  public async connect(urlPath: string): Promise<void> {
    this.checkKeyFileConfig();
    const url = `${WS_BASE_URL}${urlPath}`;
    this.ws = new WebSocket(url);
    this.ws.setMaxListeners(20);

    return new Promise((resolve, reject) => {
      this.ws!.on("open", () => {
        logger.info("WebSocket connection opened.");
        if (this.retrying) {
          this.resubscribe();
        }
        resolve();
      });

      if (!this.listenersAdded) {
        this.ws!.on("message", this.onMessage);
        this.ws!.on("error", this.onError);
        this.ws!.on("close", this.onClose);
        this.listenersAdded = true;
      }
    });
  }

  private onMessage = (data: WebSocket.Data): void => {
    logger.info(`Received: ${data}`);
    this.channels.forEach(channel => {
      channel.startListening();  // Ensure that the startListening is invoked
    });
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

  public async close(): Promise<void> {
    if (this.ws) {
      return this.runCoroutineThreadSafe(this.closeAsync());
    }
    return Promise.resolve();
  }

  private async closeAsync(): Promise<void> {
    if (this.ws) {
      this.ws.removeAllListeners();  // Clean up all listeners
      await new Promise<void>((resolve) => this.ws!.once("close", resolve));
      this.ws = undefined;
      this.channels.clear();
      logger.info("WebSocket connection closed.");
      this.listenersAdded = false;  // Reset the flag
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

      const jwt = this.isAuthenticated() ? this.generateJWT() : undefined;
      const channelKey = this.getChannelKey(channel, productIds);

      // Check if the channel is already open and active
      if (this.channels.has(channelKey) && this.ws && this.ws.readyState === WebSocket.OPEN) {
        logger.info(`Channel ${channelKey} is already active. Skipping subscription.`);
        continue;
      }

      const channelInstance = this.getChannelInstance(channel, productIds, jwt);
      channelInstance.subscribe();
      channelInstance.startListening();  // Ensure startListening is called for each channel
      this.channels.set(channelKey, channelInstance);
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

      const channelKey = this.getChannelKey(channel, productIds);
      const channelInstance = this.channels.get(channelKey);
      if (channelInstance) {
        channelInstance.unsubscribe();
        this.channels.delete(channelKey);
      }
    }
  }

  public async unsubscribeAll(): Promise<void> {
    for (const [channelKey, channelInstance] of this.channels.entries()) {
      channelInstance.unsubscribe();
    }
    this.channels.clear();
  }

  private getChannelKey(channel: string, productIds: string[]): string {
    return `${channel}:${productIds.sort().join(',')}`;
  }

  private getChannelInstance(channel: string, productIds: string[], jwt?: string): BaseWsChannel<any, any> {
    switch (channel) {
      case 'heartbeats':
        return new HeartbeatsChannel(this.ws!, productIds, jwt);
      case 'candles':
        return new CandlesChannel(this.ws!, productIds, jwt);
      case 'market_trades':
        return new MarketTradesChannel(this.ws!, productIds, jwt);
      case 'status':
        return new StatusChannel(this.ws!, productIds, jwt);
      case 'ticker':
        return new TickerChannel(this.ws!, productIds, jwt);
      case 'ticker_batch':
        return new TickerBatchChannel(this.ws!, productIds, jwt);
      case 'level2':
        return new Level2Channel(this.ws!, productIds, jwt);
      case 'user':
        return new UserChannel(this.ws!, productIds, jwt!);
      default:
        throw new WSClientException(`Unknown channel: ${channel}`);
    }
  }

  private ensureWebSocketOpen(): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new WSClientException("WebSocket is not open.");
    }
  }

  private async resubscribe(): Promise<void> {
    for (const [channelKey, channelInstance] of this.channels.entries()) {
      channelInstance.subscribe();
      channelInstance.startListening();  // Ensure startListening is called during resubscribe
    }
  }

  private async retryConnection(): Promise<void> {
    this.retryCount = 0;
    this.retrying = true;
    const retry = async () => {
      while (this.retryCount < WS_RETRY_MAX) {
        this.retryCount += 1;
        try {
          logger.info(`Retrying connection attempt ${this.retryCount}`);
          await this.connect("");
          this.retrying = false;
          return; // Exit the retry loop if connection is successful
        } catch (error) {
          logger.error(`Retry attempt ${this.retryCount} failed.`);
          this.sleepWithExceptionCheck(
            WS_RETRY_BASE * Math.pow(WS_RETRY_FACTOR, this.retryCount)
          );
          this.raiseBackgroundException();
        }
      }
      this.retrying = false;
      this.channels.clear();
      throw new WSClientConnectionClosedException("Max retry attempts reached.");
    };
    retry();
  }

  private sleepWithExceptionCheck(ms: number): void {
    const end = Date.now() + ms;
    while (Date.now() < end) {
      if (this.backgroundException) {
        throw this.backgroundException;
      }
      // Sleep for a short duration to avoid busy-waiting
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100);
    }
  }

  private raiseBackgroundException(): void {
    if (this.backgroundException) {
      const exceptionToRaise = this.backgroundException;
      this.backgroundException = undefined;
      throw exceptionToRaise;
    }
  }

  private runCoroutineThreadSafe(coro: Promise<void>): Promise<void> {
    if (this.ws) {
      return new Promise<void>((resolve, reject) => {
        coro.then(resolve).catch(reject);
      }).catch((error) => {
        logger.error(`Coroutine execution failed: ${error}`);
      });
    }
    return Promise.resolve();
  }
}

export default BaseWebSocketClient;
