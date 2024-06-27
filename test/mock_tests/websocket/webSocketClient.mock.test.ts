import WebSocket from 'ws';
import CoinbaseWSClient from '../../../src/websocket/CoinbaseWSClient';
import MockWebSocketServer from './mockWebSocketServer';
import { WS_BASE_URL } from '../../../src/config/constants';
const keyFile = process.env.KEY_FILENAME; //Example filepath in top level of Project Hierarchy: key/{insert_keyfile_name}.json

jest.mock('ws');

describe('CoinbaseWSClient', () => {
  let mockServer: MockWebSocketServer;
  let wsClient: CoinbaseWSClient;

  beforeAll(async () => {
    mockServer = new MockWebSocketServer('ws://localhost:8765');
    process.env.WS_BASE_URL = 'ws://localhost:8765';
  });

  afterAll(() => {
    mockServer.close();
  });

  beforeEach(() => {
    wsClient = new CoinbaseWSClient(keyFile);
  });

  it('should open and close WebSocket connection', async () => {
    wsClient.connect('/test');

    expect(wsClient['ws']).toBeInstanceOf(WebSocket);
    expect(wsClient['ws']?.readyState).toBe(WebSocket.OPEN);

    wsClient.close();

    expect(wsClient['ws']?.readyState).toBe(WebSocket.CLOSED);
  });

  it('should subscribe and unsubscribe to a channel', async () => {
    wsClient.connect('/test');
    const wsSendSpy = jest.spyOn(wsClient['ws']!, 'send'); // Using non-null assertion

    await wsClient.subscribe(['BTC-USD', 'ETH-USD'], ['ticker']);

    expect(wsSendSpy).toHaveBeenCalledWith(expect.stringContaining('subscribe'));
    expect(wsClient['subscriptions']['ticker'].size).toBe(2);

    await wsClient.unsubscribe(['BTC-USD', 'ETH-USD'], ['ticker']);

    expect(wsSendSpy).toHaveBeenCalledWith(expect.stringContaining('unsubscribe'));
    expect(wsClient['subscriptions']['ticker'].size).toBe(0);
  });

  it('should handle reconnections', async () => {
    wsClient.connect('/test');
    const wsSendSpy = jest.spyOn(wsClient['ws']!, 'send'); // Using non-null assertion

    await wsClient.subscribe(['BTC-USD', 'ETH-USD'], ['ticker']);
    expect(wsSendSpy).toHaveBeenCalledWith(expect.stringContaining('subscribe'));

    await mockServer.triggerConnectionClosedError();
    expect(wsClient['ws']?.readyState).toBe(WebSocket.CLOSED);

    wsClient['retryConnection']();

    expect(wsClient['ws']?.readyState).toBe(WebSocket.OPEN);
    expect(wsSendSpy).toHaveBeenCalledWith(expect.stringContaining('subscribe'));
  });
});
