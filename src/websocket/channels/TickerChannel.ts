import { BaseWsChannel } from './BaseWsChannel';
import { TickerMessage, TickerRequest } from './types/ticker';
import WebSocket from 'ws';

export class TickerChannel extends BaseWsChannel<TickerMessage, TickerRequest> {
  constructor(ws: WebSocket, products: string[], jwt?: string) {
    super(ws, 'ticker', products, false, jwt);
  }

  protected handleMessage(message: TickerMessage) {
    console.log('Ticker message:', message);
  }
}
