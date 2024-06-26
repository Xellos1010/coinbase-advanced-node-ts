import { BaseWsChannel } from './BaseWsChannel';
import { HeartbeatsMessage, HeartbeatsRequest } from './types/heartbeats';
import WebSocket from 'ws';

export class HeartbeatsChannel extends BaseWsChannel<HeartbeatsMessage, HeartbeatsRequest> {
  constructor(ws: WebSocket, products: string[], jwt?: string) {
    super(ws, 'heartbeats', products, false, jwt);
  }

  protected handleMessage(message: HeartbeatsMessage) {
    console.log('Heartbeats message:', message);
  }
}
