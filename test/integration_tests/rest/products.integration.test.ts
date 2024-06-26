// test/products.integration.test.ts
import CoinbaseClient from "../../../src/CoinbaseClient";
import { loadRestConfig } from "../../../src/config";
import KeyFileConfig from "../../../src/config/KeyFileConfig";
import { startPerformanceTimings, recordStepTiming, writePerformanceDataToFile, Timings } from "../../performanceUtils";

// Import parameter types
import { GetBestBidAskParams, GetProductBookParams, GetProductCandlesParams, GetMarketTradesParams, ListProductsParams } from "../../../src/rest/types/products";

const keyFile = process.env.KEY_FILENAME;
const config = loadRestConfig(keyFile);

describe("Coinbase API Integration Test - Products", () => {
  let client: CoinbaseClient;

  beforeAll(() => {
    client = new CoinbaseClient(
      KeyFileConfig.getInstance(
        config.name,
        config.privateKey
      )
    );
  });

  it("should fetch products and then fetch a product by ID", async () => {
    const timings: Timings = startPerformanceTimings();

    try {
      const listProductsParams: ListProductsParams = {};
      const startListProducts = performance.now();
      const productsData = await client.products?.listProducts(listProductsParams);
      recordStepTiming(timings, 'listProducts', startListProducts);

      console.log("Fetched products data:", productsData);

      if (!productsData?.products || productsData.products.length === 0) {
        throw new Error("No products found");
      }

      const productID = productsData.products[0].product_id;
      console.log("Fetching product by ID:", productID);

      const startGetProduct = performance.now();
      const productData = await client.products?.getProduct(productID);
      recordStepTiming(timings, 'getProduct', startGetProduct);

      console.log("Fetched product data:", productData);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error calling Coinbase API:", error.message);
        fail(error);
      } else {
        console.error("Unexpected error:", error);
        fail(`Unexpected error: ${error}`);
      }
    } finally {
      timings.endTime = performance.now();
      writePerformanceDataToFile('coinbaseIntegrationTest_products', timings);
    }
  });

  it("should fetch best bid/ask for products", async () => {
    const timings: Timings = startPerformanceTimings();

    try {
      const listProductsParams: ListProductsParams = {};
      const startListProducts = performance.now();
      const productsData = await client.products?.listProducts(listProductsParams);
      recordStepTiming(timings, 'listProducts', startListProducts);

      console.log("Fetched products data:", productsData);

      if (!productsData?.products || productsData.products.length === 0) {
        throw new Error("No products found");
      }

      const productID = productsData.products[0].product_id;
      console.log("Fetching best bid/ask for product ID:", productID);

      const getBestBidAskParams: GetBestBidAskParams = { product_ids: [productID] };
      const startGetBestBidAsk = performance.now();
      const bestBidAskData = await client.products?.getBestBidAsk(getBestBidAskParams);
      recordStepTiming(timings, 'getBestBidAsk', startGetBestBidAsk);

      console.log("Fetched best bid/ask data:", bestBidAskData);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error calling Coinbase API:", error.message);
        fail(error);
      } else {
        console.error("Unexpected error:", error);
        fail(`Unexpected error: ${error}`);
      }
    } finally {
      timings.endTime = performance.now();
      writePerformanceDataToFile('coinbaseIntegrationTest_bestBidAsk', timings);
    }
  });

  it("should fetch product candles", async () => {
    const timings: Timings = startPerformanceTimings();

    try {
      const listProductsParams: ListProductsParams = {};
      const startListProducts = performance.now();
      const productsData = await client.products?.listProducts(listProductsParams);
      recordStepTiming(timings, 'listProducts', startListProducts);

      console.log("Fetched products data:", productsData);

      if (!productsData?.products || productsData.products.length === 0) {
        throw new Error("No products found");
      }

      const productID = productsData.products[0].product_id;
      console.log("Fetching candles for product ID:", productID);

      const getProductCandlesParams: GetProductCandlesParams = {
        start: Math.floor(Date.now() / 1000 - 24 * 60 * 60).toString(), // 24 hours ago in UNIX time
        end: Math.floor(Date.now() / 1000).toString(), // Now in UNIX time
        granularity: 'ONE_HOUR' // as const
      };

      const startGetProductCandles = performance.now();
      const productCandlesData = await client.products?.getProductCandles(productID, getProductCandlesParams);
      recordStepTiming(timings, 'getProductCandles', startGetProductCandles);

      console.log("Fetched product candles data:", productCandlesData);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error calling Coinbase API:", error.message);
        fail(error);
      } else {
        console.error("Unexpected error:", error);
        fail(`Unexpected error: ${error}`);
      }
    } finally {
      timings.endTime = performance.now();
      writePerformanceDataToFile('coinbaseIntegrationTest_productCandles', timings);
    }
  });

  it("should fetch market trades for a product", async () => {
    const timings: Timings = startPerformanceTimings();

    try {
      const listProductsParams: ListProductsParams = {};
      const startListProducts = performance.now();
      const productsData = await client.products?.listProducts(listProductsParams);
      recordStepTiming(timings, 'listProducts', startListProducts);

      console.log("Fetched products data:", productsData);

      if (!productsData?.products || productsData.products.length === 0) {
        throw new Error("No products found");
      }

      const productID = productsData.products[0].product_id;
      console.log("Fetching market trades for product ID:", productID);

      const getMarketTradesParams: GetMarketTradesParams = {
        limit: 10
      };

      const startGetMarketTrades = performance.now();
      const marketTradesData = await client.products?.getMarketTrades(productID, getMarketTradesParams);
      recordStepTiming(timings, 'getMarketTrades', startGetMarketTrades);

      console.log("Fetched market trades data:", marketTradesData);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error calling Coinbase API:", error.message);
        fail(error);
      } else {
        console.error("Unexpected error:", error);
        fail(`Unexpected error: ${error}`);
      }
    } finally {
      timings.endTime = performance.now();
      writePerformanceDataToFile('coinbaseIntegrationTest_marketTrades', timings);
    }
  });

  it("should fetch product book", async () => {
    const timings: Timings = startPerformanceTimings();

    try {
      const listProductsParams: ListProductsParams = {};
      const startListProducts = performance.now();
      const productsData = await client.products?.listProducts(listProductsParams);
      recordStepTiming(timings, 'listProducts', startListProducts);

      console.log("Fetched products data:", productsData);

      if (!productsData?.products || productsData.products.length === 0) {
        throw new Error("No products found");
      }

      const productID = productsData.products[0].product_id;
      console.log("Fetching product book for product ID:", productID);

      const getProductBookParams: GetProductBookParams = {
        product_id: productID,
        limit: 10
      };

      const startGetProductBook = performance.now();
      const productBookData = await client.products?.getProductBook(getProductBookParams);
      recordStepTiming(timings, 'getProductBook', startGetProductBook);

      console.log("Fetched product book data:", productBookData);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error calling Coinbase API:", error.message);
        fail(error);
      } else {
        console.error("Unexpected error:", error);
        fail(`Unexpected error: ${error}`);
      }
    } finally {
      timings.endTime = performance.now();
      writePerformanceDataToFile('coinbaseIntegrationTest_productBook', timings);
    }
  });
});
