// test\products.integration.test.ts
import CoinbaseClient from "../src/CoinbaseClient";
import { loadRestConfig } from "../src/config";
import KeyFileConfig from "../src/config/KeyFileConfig";
import { startPerformanceTimings, recordStepTiming, writePerformanceDataToFile, Timings } from "./performanceUtils";

const keyFile = process.env.KEY_FILENAME;
const config = loadRestConfig(keyFile);

describe("Coinbase API Integration Test - Products", () => {
  it("should fetch products and then fetch a product by ID", async () => {
    const timings: Timings = startPerformanceTimings();

    try {
      const client = new CoinbaseClient(
        KeyFileConfig.getInstance(
          config.name,
          config.privateKey
        )
      );

      const startListProducts = performance.now();
      const productsData = await client.products?.listProducts();
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
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      timings.endTime = performance.now();
      writePerformanceDataToFile('coinbaseIntegrationTest_products', timings);
    }
  });

  it("should fetch best bid/ask for products", async () => {
    const timings: Timings = startPerformanceTimings();

    try {
      const client = new CoinbaseClient(
        KeyFileConfig.getInstance(
          config.name,
          config.privateKey
        )
      );

      const startListProducts = performance.now();
      const productsData = await client.products?.listProducts();
      recordStepTiming(timings, 'listProducts', startListProducts);

      console.log("Fetched products data:", productsData);

      if (!productsData?.products || productsData.products.length === 0) {
        throw new Error("No products found");
      }

      const productID = productsData.products[0].product_id;
      console.log("Fetching product by ID:", productID);

      const startGetBestBidAsk = performance.now();
      const bestBidAskData = await client.products?.getBestBidAsk([productID]);
      recordStepTiming(timings, 'getBestBidAsk', startGetBestBidAsk);

      console.log("Fetched best bid/ask data:", bestBidAskData);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error calling Coinbase API:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      timings.endTime = performance.now();
      writePerformanceDataToFile('coinbaseIntegrationTest_bestBidAsk', timings);
    }
  });
});
