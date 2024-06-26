import { BaseWsChannel } from './BaseWsChannel';
import { TickerBatchMessage, TickerBatchRequest } from './types/ticker_batch';
import WebSocket from 'ws';

export class TickerBatchChannel extends BaseWsChannel<TickerBatchMessage, TickerBatchRequest> {
  constructor(ws: WebSocket, products: string[], jwt?: string) {
    super(ws, 'ticker_batch', products, false, jwt);
  }

  protected handleMessage(message: TickerBatchMessage) {
    console.log('Ticker Batch message:', message);
  }
}
