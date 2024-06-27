// src/demos/websocket/candlesChannelDemo.ts
import CoinbaseClient from "../../CoinbaseClient";
import KeyFileConfig from '../../config/KeyFileConfig';
import { loadKeyfile } from '../../config/KeyLoader';
import BaseWebSocketClient from '../../websocket/BaseWebSocketClient';
import { ChannelSubscription } from './utils/ChannelSubscription';

const keyFile = process.env.KEY_FILENAME;
const config = loadKeyfile(keyFile);

async function demo() {
  const client = new CoinbaseClient(
    KeyFileConfig.getInstance(config.name, config.privateKey)
  );
  const wsClient = client.websocket as BaseWebSocketClient;

  const onMessage = (message: any) => {
    console.log('Received message:', message);
  };

  await ChannelSubscription(wsClient, 'candles', 'demo_candles', onMessage);
}

demo().catch(console.error);
