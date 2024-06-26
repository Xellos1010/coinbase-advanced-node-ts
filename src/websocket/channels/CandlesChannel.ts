import { BaseWsChannel } from './BaseWsChannel';
import { CandlesMessage, CandlesRequest } from './types/candles';
import WebSocket from 'ws';

export class CandlesChannel extends BaseWsChannel<CandlesMessage, CandlesRequest> {
  constructor(ws: WebSocket, products: string[], jwt?: string) {
    super(ws, 'candles', products, false, jwt);
  }

  protected handleMessage(message: CandlesMessage) {
    console.log('Candles message:', message);
  }
}
