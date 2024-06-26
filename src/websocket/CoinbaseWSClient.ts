import BaseWebSocketClient from "./BaseWebSocketClient";
import {
  CANDLES,
  HEARTBEATS,
  LEVEL2,
  MARKET_TRADES,
  STATUS,
  TICKER,
  TICKER_BATCH,
  USER,
} from "../config/constants";
import { ProductIdsParams } from "./types";

class CoinbaseWSClient extends BaseWebSocketClient {

  /**
   * Subscribe to heartbeats channel for a list of product_ids.
   * @param params - Object containing the list of product ids to subscribe to
   */
  public heartbeats(params: ProductIdsParams): void {
    this.subscribe(params.productIds, [HEARTBEATS]);
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
   */
  public candles(params: ProductIdsParams): void {
    this.subscribe(params.productIds, [CANDLES]);
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
   */
  public marketTrades(params: ProductIdsParams): void {
    this.subscribe(params.productIds, [MARKET_TRADES]);
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
   */
  public status(params: ProductIdsParams): void {
    this.subscribe(params.productIds, [STATUS]);
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
   */
  public ticker(params: ProductIdsParams): void {
    this.subscribe(params.productIds, [TICKER]);
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
   */
  public tickerBatch(params: ProductIdsParams): void {
    this.subscribe(params.productIds, [TICKER_BATCH]);
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
   */
  public level2(params: ProductIdsParams): void {
    this.subscribe(params.productIds, [LEVEL2]);
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
   */
  public user(params: ProductIdsParams): void {
    this.subscribe(params.productIds, [USER]);
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
