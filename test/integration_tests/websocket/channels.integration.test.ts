import CoinbaseClient from "../../../src/CoinbaseClient";
import KeyFileConfig from "../../../src/config/KeyFileConfig";
import { loadKeyfile } from "../../../src/config/KeyLoader";
import BaseWebSocketClient from "../../../src/websocket/BaseWebSocketClient";
import { startPerformanceTimings, recordStepTiming, writePerformanceDataToFile, Timings } from "../../performanceUtils";

const keyFile = process.env.KEY_FILENAME;
const config = loadKeyfile(keyFile);

describe('Coinbase API Integration Test - WebSocket', () => {
  let wsClient: BaseWebSocketClient;
  let onMessageSpy: jest.Mock;

  beforeAll(() => {
    const client = new CoinbaseClient(
      KeyFileConfig.getInstance(
        config.name,
        config.privateKey
      )
    );
    wsClient = client.websocket as BaseWebSocketClient;
  });

  beforeEach(() => {
    onMessageSpy = jest.fn();
  });

  it('should connect to WebSocket server and subscribe to ticker channel', async () => {
    await testChannelSubscription('ticker', 'coinbaseIntegrationTest_websocket_ticker');
  });

  it('should connect to WebSocket server and subscribe to heartbeats channel', async () => {
    await testChannelSubscription('heartbeats', 'coinbaseIntegrationTest_websocket_heartbeats');
  });

  it('should connect to WebSocket server and subscribe to candles channel', async () => {
    await testChannelSubscription('candles', 'coinbaseIntegrationTest_websocket_candles');
  });

  it('should connect to WebSocket server and subscribe to market_trades channel', async () => {
    await testChannelSubscription('market_trades', 'coinbaseIntegrationTest_websocket_market_trades');
  });

  it('should connect to WebSocket server and subscribe to status channel', async () => {
    await testChannelSubscription('status', 'coinbaseIntegrationTest_websocket_status');
  });

  it('should connect to WebSocket server and subscribe to ticker_batch channel', async () => {
    await testChannelSubscription('ticker_batch', 'coinbaseIntegrationTest_websocket_ticker_batch');
  });

  it('should connect to WebSocket server and subscribe to level2 channel', async () => {
    await testChannelSubscription('level2', 'coinbaseIntegrationTest_websocket_level2');
  });

  it('should connect to WebSocket server and subscribe to user channel', async () => {
    await testChannelSubscription('user', 'coinbaseIntegrationTest_websocket_user', true);
  });

  async function testChannelSubscription(channel: string, logFileName: string, requiresAuth = false): Promise<void> {
    const timings: Timings = startPerformanceTimings();

    try {
      const startConnect = performance.now();
      await wsClient.connect('');
      recordStepTiming(timings, 'connect', startConnect);

      const startSubscribe = performance.now();
      await wsClient.subscribe(['BTC-USD'], [channel]);
      recordStepTiming(timings, `subscribe_${channel}`, startSubscribe);

      console.log(`Subscribed to ${channel} channel`);

      wsClient['ws']?.on('message', onMessageSpy);

      await new Promise(res => setTimeout(res, 500)); // Wait to receive some messages

      expect(onMessageSpy).toHaveBeenCalled();

      const startUnsubscribe = performance.now();
      await wsClient.unsubscribe(['BTC-USD'], [channel]);
      recordStepTiming(timings, `unsubscribe_${channel}`, startUnsubscribe);

      console.log(`Unsubscribed from ${channel} channel`);

      const startClose = performance.now();
      await wsClient.close();
      recordStepTiming(timings, 'close', startClose);

      console.log('WebSocket connection closed');
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error during ${channel} channel WebSocket test:`, error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      throw error;
    } finally {
      wsClient['ws']?.off('message', onMessageSpy);  // Remove the message listener
      timings.endTime = performance.now();
      writePerformanceDataToFile(logFileName, timings);
    }
  }
});
