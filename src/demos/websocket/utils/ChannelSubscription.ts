// src/demos/utils/ChannelSubscription.ts
import BaseWebSocketClient from "../../../websocket/BaseWebSocketClient";
import { startPerformanceTimings, recordStepTiming, writePerformanceDataToFile, Timings } from "../../utils/performanceUtils";

export async function ChannelSubscription(
  wsClient: BaseWebSocketClient,
  channel: string,
  logFileName: string,
  onMessage: (message: any) => void,
  requiresAuth = false
): Promise<void> {
  const timings: Timings = startPerformanceTimings();

  try {
    const startConnect = performance.now();
    await wsClient.connect('');
    recordStepTiming(timings, 'connect', startConnect);

    const startSubscribe = performance.now();
    await wsClient.subscribe(['BTC-USD'], [channel], onMessage);
    recordStepTiming(timings, `subscribe_${channel}`, startSubscribe);

    console.log(`Subscribed to ${channel} channel`);

    await new Promise(res => setTimeout(res, 500));

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
    timings.endTime = performance.now();
    writePerformanceDataToFile(logFileName, timings);
  }
}
