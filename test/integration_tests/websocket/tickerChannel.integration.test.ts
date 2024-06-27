// test/integration_tests/websocket/tickerChannel.integration.test.ts
import CoinbaseClient from "../../../src/CoinbaseClient";
import KeyFileConfig from "../../../src/config/KeyFileConfig";
import { loadKeyfile } from "../../../src/config/KeyLoader";
import BaseWebSocketClient from "../../../src/websocket/BaseWebSocketClient";
import { testChannelSubscription } from "./utils/testChannelSubscription";

const keyFile = process.env.KEY_FILENAME; //Example filepath in top level of Project Hierarchy: key/{insert_keyfile_name}.json
const config = loadKeyfile(keyFile);

describe('Coinbase API Integration Test - WebSocket Ticker Channel', () => {
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

  it('should connect to WebSocket server and subscribe to ticker channel', async () => {
    await testChannelSubscription(wsClient, 'ticker', 'coinbaseIntegrationTest_websocket_ticker', onMessageSpy);
  });
});
