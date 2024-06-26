// test/integration_tests/websocket/level2Channel.integration.test.ts
import CoinbaseClient from "../../../src/CoinbaseClient";
import KeyFileConfig from "../../../src/config/KeyFileConfig";
import { loadKeyfile } from "../../../src/config/KeyLoader";
import BaseWebSocketClient from "../../../src/websocket/BaseWebSocketClient";
import { testChannelSubscription } from "./utils/testChannelSubscription";

const keyFile = process.env.KEY_FILENAME;
const config = loadKeyfile(keyFile);

describe('Coinbase API Integration Test - WebSocket Level 2 Channel', () => {
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

  afterAll(async () => {
    if (wsClient) {
      await wsClient.close();
    }
  });

  it('should connect to WebSocket server and subscribe to level2 channel', async () => {
    await testChannelSubscription(wsClient, 'level2', 'coinbaseIntegrationTest_websocket_level2', onMessageSpy);
  });
});
