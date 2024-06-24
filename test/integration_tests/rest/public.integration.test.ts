import CoinbaseClient from "../../../src/CoinbaseClient";
import { loadRestConfig } from "../../../src/config";
import { startPerformanceTimings, recordStepTiming, writePerformanceDataToFile, Timings } from "../../performanceUtils";
import KeyFileConfig from "../../../src/config/KeyFileConfig";

const config = loadRestConfig();

describe("Coinbase API Public Integration Test", () => {
  let client: CoinbaseClient;

  beforeAll(() => {
    client = new CoinbaseClient(KeyFileConfig.getInstance(
        config.name,
        config.privateKey
      ));
  });

  it("should fetch server time", async () => {
    const timings: Timings = startPerformanceTimings();

    try {
      const startServerTime = performance.now();
      const serverTime = await client.public?.getServerTime();
      recordStepTiming(timings, 'getServerTime', startServerTime);

      console.log("Server Time:", serverTime);
    } catch (error) {
      console.error("Error fetching server time:", error);
    } finally {
      timings.endTime = performance.now();
      writePerformanceDataToFile('publicIntegrationTest_getServerTime', timings);
    }
  });

  it("should fetch product book", async () => {
    const timings: Timings = startPerformanceTimings();

    try {
      const startProductBook = performance.now();
      const productBook = await client.public?.getProductBook('BTC-USD', 10);
      recordStepTiming(timings, 'getProductBook', startProductBook);

      console.log("Product Book:", productBook);
    } catch (error) {
      console.error("Error fetching product book:", error);
    } finally {
      timings.endTime = performance.now();
      writePerformanceDataToFile('publicIntegrationTest_getProductBook', timings);
    }
  });

  it("should list products", async () => {
    const timings: Timings = startPerformanceTimings();

    try {
      const startListProducts = performance.now();
      const products = await client.public?.listProducts();
      recordStepTiming(timings, 'listProducts', startListProducts);

      console.log("Products:", products);
    } catch (error) {
      console.error("Error listing products:", error);
    } finally {
      timings.endTime = performance.now();
      writePerformanceDataToFile('publicIntegrationTest_listProducts', timings);
    }
  });

  it("should fetch a product by ID", async () => {
    const timings: Timings = startPerformanceTimings();

    try {
      const startListProducts = performance.now();
      const products = await client.public?.listProducts();
      recordStepTiming(timings, 'listProducts', startListProducts);

      if (!products?.products || products.products.length === 0) {
        throw new Error("No products found");
      }

      const productID = products.products[0].product_id;

      const startGetProduct = performance.now();
      const product = await client.public?.getProduct(productID);
      recordStepTiming(timings, 'getProduct', startGetProduct);

      console.log("Product:", product);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      timings.endTime = performance.now();
      writePerformanceDataToFile('publicIntegrationTest_getProduct', timings);
    }
  });

  it("should fetch product candles", async () => {
    const timings: Timings = startPerformanceTimings();

    try {
      const start = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // 24 hours ago
      const end = new Date().toISOString();
      const granularity = '3600'; // 1 hour granularity

      const startGetProductCandles = performance.now();
      const candles = await client.public?.getProductCandles('BTC-USD', start, end, granularity);
      recordStepTiming(timings, 'getProductCandles', startGetProductCandles);

      console.log("Product Candles:", candles);
    } catch (error) {
      console.error("Error fetching product candles:", error);
    } finally {
      timings.endTime = performance.now();
      writePerformanceDataToFile('publicIntegrationTest_getProductCandles', timings);
    }
  });

  it("should fetch market trades", async () => {
    const timings: Timings = startPerformanceTimings();

    try {
      const startGetMarketTrades = performance.now();
      const marketTrades = await client.public?.getMarketTrades('BTC-USD', 10);
      recordStepTiming(timings, 'getMarketTrades', startGetMarketTrades);

      console.log("Market Trades:", marketTrades);
    } catch (error) {
      console.error("Error fetching market trades:", error);
    } finally {
      timings.endTime = performance.now();
      writePerformanceDataToFile('publicIntegrationTest_getMarketTrades', timings);
    }
  });
});
