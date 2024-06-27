import BaseWebSocketClient from './BaseWebSocketClient';
import {
  CANDLES,
  HEARTBEATS,
  LEVEL2,
  MARKET_TRADES,
  STATUS,
  TICKER,
  TICKER_BATCH,
  USER,
} from '../config/constants';
import { ProductIdsParams } from './types';

class CoinbaseWSClient extends BaseWebSocketClient {

  /**
   * Subscribe to heartbeats channel for a list of product_ids.
   * @param params - Object containing the list of product ids to subscribe to
   * @param onMessage - Callback function to handle incoming messages
   */
  public heartbeats(params: ProductIdsParams, onMessage: (message: any) => void): void {
    this.subscribe(params.productIds, [HEARTBEATS], onMessage);
  }

  /**
   * Unsubscribe to heartbeats channel for a list of product_ids.
   * @param params - Object containing the list of product ids to unsubscribe from
   */
  public heartbeatsUnsubscribe(params: ProductIdsParams): void {
    this.unsubscribe(params.productIds, [HEARTBEATS]);
  }

  /**
   * Subscribe to candles channel for a list of product_ids.
   * @param params - Object containing the list of product ids to subscribe to
   * @param onMessage - Callback function to handle incoming messages
   */
  public candles(params: ProductIdsParams, onMessage: (message: any) => void): void {
    this.subscribe(params.productIds, [CANDLES], onMessage);
  }

  /**
   * Unsubscribe to candles channel for a list of product_ids.
   * @param params - Object containing the list of product ids to unsubscribe from
   */
  public candlesUnsubscribe(params: ProductIdsParams): void {
    this.unsubscribe(params.productIds, [CANDLES]);
  }

  /**
   * Subscribe to market trades channel for a list of product_ids.
   * @param params - Object containing the list of product ids to subscribe to
   * @param onMessage - Callback function to handle incoming messages
   */
  public marketTrades(params: ProductIdsParams, onMessage: (message: any) => void): void {
    this.subscribe(params.productIds, [MARKET_TRADES], onMessage);
  }

  /**
   * Unsubscribe to market trades channel for a list of product_ids.
   * @param params - Object containing the list of product ids to unsubscribe from
   */
  public marketTradesUnsubscribe(params: ProductIdsParams): void {
    this.unsubscribe(params.productIds, [MARKET_TRADES]);
  }

  /**
   * Subscribe to status channel for a list of product_ids.
   * @param params - Object containing the list of product ids to subscribe to
   * @param onMessage - Callback function to handle incoming messages
   */
  public status(params: ProductIdsParams, onMessage: (message: any) => void): void {
    this.subscribe(params.productIds, [STATUS], onMessage);
  }

  /**
   * Unsubscribe to status channel for a list of product_ids.
   * @param params - Object containing the list of product ids to unsubscribe from
   */
  public statusUnsubscribe(params: ProductIdsParams): void {
    this.unsubscribe(params.productIds, [STATUS]);
  }

  /**
   * Subscribe to ticker channel for a list of product_ids.
   * @param params - Object containing the list of product ids to subscribe to
   * @param onMessage - Callback function to handle incoming messages
   */
  public ticker(params: ProductIdsParams, onMessage: (message: any) => void): void {
    this.subscribe(params.productIds, [TICKER], onMessage);
  }

  /**
   * Unsubscribe to ticker channel for a list of product_ids.
   * @param params - Object containing the list of product ids to unsubscribe from
   */
  public tickerUnsubscribe(params: ProductIdsParams): void {
    this.unsubscribe(params.productIds, [TICKER]);
  }

  /**
   * Subscribe to ticker batch channel for a list of product_ids.
   * @param params - Object containing the list of product ids to subscribe to
   * @param onMessage - Callback function to handle incoming messages
   */
  public tickerBatch(params: ProductIdsParams, onMessage: (message: any) => void): void {
    this.subscribe(params.productIds, [TICKER_BATCH], onMessage);
  }

  /**
   * Unsubscribe to ticker batch channel for a list of product_ids.
   * @param params - Object containing the list of product ids to unsubscribe from
   */
  public tickerBatchUnsubscribe(params: ProductIdsParams): void {
    this.unsubscribe(params.productIds, [TICKER_BATCH]);
  }

  /**
   * Subscribe to level2 channel for a list of product_ids.
   * @param params - Object containing the list of product ids to subscribe to
   * @param onMessage - Callback function to handle incoming messages
   */
  public level2(params: ProductIdsParams, onMessage: (message: any) => void): void {
    this.subscribe(params.productIds, [LEVEL2], onMessage);
  }

  /**
   * Unsubscribe to level2 channel for a list of product_ids.
   * @param params - Object containing the list of product ids to unsubscribe from
   */
  public level2Unsubscribe(params: ProductIdsParams): void {
    this.unsubscribe(params.productIds, [LEVEL2]);
  }

  /**
   * Subscribe to user channel for a list of product_ids.
   * @param params - Object containing the list of product ids to subscribe to
   * @param onMessage - Callback function to handle incoming messages
   */
  public user(params: ProductIdsParams, onMessage: (message: any) => void): void {
    this.subscribe(params.productIds, [USER], onMessage);
  }

  /**
   * Unsubscribe to user channel for a list of product_ids.
   * @param params - Object containing the list of product ids to unsubscribe from
   */
  public userUnsubscribe(params: ProductIdsParams): void {
    this.unsubscribe(params.productIds, [USER]);
  }
}

export default CoinbaseWSClient;
