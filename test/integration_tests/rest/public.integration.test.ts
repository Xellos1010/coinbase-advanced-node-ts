import CoinbaseClient from "../../../src/CoinbaseClient";
import { loadRestConfig } from "../../../src/config";
import { startPerformanceTimings, recordStepTiming, writePerformanceDataToFile, Timings } from "../../performanceUtils";
import KeyFileConfig from "../../../src/config/KeyFileConfig";
import { GetMarketTradesParams, GetProductBookParams, GetProductCandlesParams } from "../../../src/rest/types/public";

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
      fail(error);
    } finally {
      timings.endTime = performance.now();
      writePerformanceDataToFile('publicIntegrationTest_getServerTime', timings);
    }
  });

  it("should fetch product book", async () => {
    const timings: Timings = startPerformanceTimings();

    try {
      const params: GetProductBookParams = { productID: 'BTC-USD', limit: 10 };
      const startProductBook = performance.now();
      const productBook = await client.public?.getProductBook(params);
      recordStepTiming(timings, 'getProductBook', startProductBook);

      console.log("Product Book:", productBook);
    } catch (error) {
      console.error("Error fetching product book:", error);
      fail(error);
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
      fail(error);
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
      fail(error);
    } finally {
      timings.endTime = performance.now();
      writePerformanceDataToFile('publicIntegrationTest_getProduct', timings);
    }
  });

  it("should fetch product candles", async () => {
    const timings: Timings = startPerformanceTimings();

    try {
      const params: GetProductCandlesParams = {
        productID: 'BTC-USD',
        start: Math.floor(Date.now() / 1000 - 24 * 60 * 60).toString(), // 24 hours ago in UNIX time
        end: Math.floor(Date.now() / 1000).toString(), // Now in UNIX time
        granularity: 'ONE_HOUR' // 1 hour granularity
      };

      const startGetProductCandles = performance.now();
      const candles = await client.public?.getProductCandles(params);
      recordStepTiming(timings, 'getProductCandles', startGetProductCandles);

      console.log("Product Candles:", candles);
    } catch (error) {
      console.error("Error fetching product candles:", error);
      fail(error);
    } finally {
      timings.endTime = performance.now();
      writePerformanceDataToFile('publicIntegrationTest_getProductCandles', timings);
    }
  });

  it("should fetch market trades", async () => {
    const timings: Timings = startPerformanceTimings();

    try {
      const params: GetMarketTradesParams = { productID: 'BTC-USD', limit: 10 };
      const startGetMarketTrades = performance.now();
      const marketTrades = await client.public?.getMarketTrades(params);
      recordStepTiming(timings, 'getMarketTrades', startGetMarketTrades);

      console.log("Market Trades:", marketTrades);
    } catch (error) {
      console.error("Error fetching market trades:", error);
      fail(error);
    } finally {
      timings.endTime = performance.now();
      writePerformanceDataToFile('publicIntegrationTest_getMarketTrades', timings);
    }
  });
});
