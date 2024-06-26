// test/utils/testChannelSubscription.ts
import BaseWebSocketClient from "../../../../src/websocket/BaseWebSocketClient";
import { startPerformanceTimings, recordStepTiming, writePerformanceDataToFile, Timings } from "../../../performanceUtils";

export async function testChannelSubscription(
  wsClient: BaseWebSocketClient,
  channel: string,
  logFileName: string,
  onMessageSpy: jest.Mock,
  requiresAuth = false
): Promise<void> {
  const timings: Timings = startPerformanceTimings();

  try {
    const startConnect = performance.now();
    await wsClient.connect('');
    recordStepTiming(timings, 'connect', startConnect);

    const startSubscribe = performance.now();
    await wsClient.subscribe(['BTC-USD'], [channel], onMessageSpy);
    recordStepTiming(timings, `subscribe_${channel}`, startSubscribe);

    console.log(`Subscribed to ${channel} channel`);

    await new Promise(res => setTimeout(res, 500));

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
    timings.endTime = performance.now();
    writePerformanceDataToFile(logFileName, timings);
  }
}
