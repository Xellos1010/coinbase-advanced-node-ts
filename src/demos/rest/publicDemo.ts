import CoinbaseClient from "../../CoinbaseClient";
import { loadRestConfig } from "../../config";
import KeyFileConfig from "../../config/KeyFileConfig";
import { GetMarketTradesParams, GetProductBookParams, GetProductCandlesParams } from "../../rest/types/public";

const config = loadRestConfig();

async function demo() {
  const client = new CoinbaseClient(KeyFileConfig.getInstance(config.name, config.privateKey));

  try {
    const serverTime = await client.public?.getServerTime();
    console.log("Server Time:", serverTime);

    const params: GetProductBookParams = { productID: 'BTC-USD', limit: 10 };
    const productBook = await client.public?.getProductBook(params);
    console.log("Product Book:", productBook);

    const products = await client.public?.listProducts();
    console.log("Products:", products);

    if (!products?.products || products.products.length === 0) {
      throw new Error("No products found");
    }

    const productID = products.products[0].product_id;
    const product = await client.public?.getProduct(productID);
    console.log("Product:", product);

    const getProductCandlesParams: GetProductCandlesParams = {
      productID: 'BTC-USD',
      start: Math.floor(Date.now() / 1000 - 24 * 60 * 60).toString(),
      end: Math.floor(Date.now() / 1000).toString(),
      granularity: 'ONE_HOUR'
    };
    const candles = await client.public?.getProductCandles(getProductCandlesParams);
    console.log("Product Candles:", candles);

    const getMarketTradesParams: GetMarketTradesParams = { productID: 'BTC-USD', limit: 10 };
    const marketTrades = await client.public?.getMarketTrades(getMarketTradesParams);
    console.log("Market Trades:", marketTrades);
  } catch (error) {
    console.error("Error calling Coinbase API:", error instanceof Error ? error.message : error);
  }
}

demo().catch(console.error);
