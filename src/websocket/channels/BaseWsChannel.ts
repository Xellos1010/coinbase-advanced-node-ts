import WebSocket from 'ws';
import { BaseMessage, SubscribeMessage, UnsubscribeMessage, AuthenticatedMessage } from './types';
import { SUBSCRIBE_MESSAGE_TYPE, UNSUBSCRIBE_MESSAGE_TYPE } from '../../config/constants';

export abstract class BaseWsChannel<T, U extends BaseMessage> {
  protected ws: WebSocket;
  protected channelName: string;
  protected products: string[];
  protected jwt?: string;
  protected requiresAuth: boolean;

  constructor(ws: WebSocket, channelName: string, products: string[], requiresAuth: boolean, jwt?: string) {
    this.ws = ws;
    this.channelName = channelName;
    this.products = products;
    this.requiresAuth = requiresAuth;
    this.jwt = jwt;

    if (this.requiresAuth && !this.jwt) {
      throw new Error('JWT is required for authenticated channels');
    }
  }

  protected abstract handleMessage(message: T): void;

  private createMessage(type: typeof SUBSCRIBE_MESSAGE_TYPE | typeof UNSUBSCRIBE_MESSAGE_TYPE): SubscribeMessage<U> | UnsubscribeMessage<U> {
    const message: BaseMessage = {
      type,
      product_ids: this.products,
      channel: this.channelName
    };

    if (this.requiresAuth || this.jwt) {
      (message as AuthenticatedMessage).jwt = this.jwt!;
    }

    if (type === SUBSCRIBE_MESSAGE_TYPE) {
      return message as SubscribeMessage<U>;
    } else {
      return message as UnsubscribeMessage<U>;
    }
  }

  subscribe() {
    const message = this.createMessage(SUBSCRIBE_MESSAGE_TYPE);
    this.ws.send(JSON.stringify(message));
  }

  unsubscribe() {
    const message = this.createMessage(UNSUBSCRIBE_MESSAGE_TYPE);
    this.ws.send(JSON.stringify(message));
  }

  startListening(onMessage: (message: any) => void) {
    this.ws.on('message', (data: WebSocket.Data) => {
      const parsedData: T = JSON.parse(data.toString());
      this.handleMessage(parsedData);
      onMessage(parsedData); // Emit the message up
    });
  }
}
