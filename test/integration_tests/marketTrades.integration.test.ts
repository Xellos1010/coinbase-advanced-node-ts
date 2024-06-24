// test\marketTrades.integration.test.ts
import CoinbaseClient from "../../src/CoinbaseClient";
import { loadRestConfig } from "../../src/config";
import KeyFileConfig from "../../src/config/KeyFileConfig";
import { startPerformanceTimings, recordStepTiming, writePerformanceDataToFile, Timings } from "../performanceUtils";

const keyFile = process.env.KEY_FILENAME;
const config = loadRestConfig(keyFile); //Loads Key File if any

describe("Coinbase API Integration Test - Market Trades", () => {
  it("should fetch market trades for a product", async () => {
    const timings: Timings = startPerformanceTimings();

    try {
      const client = new CoinbaseClient(
        KeyFileConfig.getInstance(
          config.name,
          config.privateKey
        )
      );

      const startGetMarketTrades = performance.now();
      const marketData = await client.products?.getMarketTrades('BTC-USD');
      recordStepTiming(timings, 'getMarketTrades', startGetMarketTrades);

      console.log("Market Data:", marketData);

      if (!marketData || !marketData.trades || marketData.trades.length === 0) {
        throw new Error("Market data is empty or invalid");
      }

      const bestAsk = marketData.best_ask;

      if (!bestAsk) {
        throw new Error("Best ask price is not available in market data");
      }

      console.log("Best Ask Price:", bestAsk);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error calling Coinbase API:", error.message);
        throw error;
      } else {
        console.error("Unexpected error:", error);
        throw new Error("Unexpected error occurred");
      }
    } finally {
      timings.endTime = performance.now();
      writePerformanceDataToFile('coinbaseIntegrationTest_marketTrades', timings);
    }
  });
});
