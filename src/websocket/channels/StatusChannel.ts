import { BaseWsChannel } from './BaseWsChannel';
import { StatusMessage, StatusRequest } from './types/status';
import WebSocket from 'ws';

export class StatusChannel extends BaseWsChannel<StatusMessage, StatusRequest> {
  constructor(ws: WebSocket, products: string[], jwt?: string) {
    super(ws, 'status', products, false, jwt);
  }

  protected handleMessage(message: StatusMessage) {
    console.log('Status message:', message);
  }
}
