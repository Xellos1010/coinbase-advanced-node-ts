import { BaseWsChannel } from './BaseWsChannel';
import { MarketTradesMessage, MarketTradesRequest } from './types/market_trades';
import WebSocket from 'ws';

export class MarketTradesChannel extends BaseWsChannel<MarketTradesMessage, MarketTradesRequest> {
  constructor(ws: WebSocket, products: string[], jwt?: string) {
    super(ws, 'market_trades', products, false, jwt);
  }

  protected handleMessage(message: MarketTradesMessage) {
    console.log('Market Trades message:', message);
  }
}
