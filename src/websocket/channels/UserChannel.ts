import { BaseWsChannel } from './BaseWsChannel';
import { UserMessage, UserRequest } from './types/user';
import WebSocket from 'ws';

export class UserChannel extends BaseWsChannel<UserMessage, UserRequest> {
  constructor(ws: WebSocket, products: string[], jwt: string) {
    super(ws, 'user', products, true, jwt);
  }

  protected handleMessage(message: UserMessage) {
    console.log('User message:', message);
  }
}
