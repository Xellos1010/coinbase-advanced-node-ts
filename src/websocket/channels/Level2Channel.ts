import { BaseWsChannel } from './BaseWsChannel';
import { Level2Message, Level2Request } from './types/level2';
import WebSocket from 'ws';

export class Level2Channel extends BaseWsChannel<Level2Message, Level2Request> {
  constructor(ws: WebSocket, products: string[], jwt?: string) {
    super(ws, 'level2', products, false, jwt);
  }

  protected handleMessage(message: Level2Message) {
    console.log('Level 2 message:', message);
  }
}
