import CoinbaseClient from "../../CoinbaseClient";
import { loadRestConfig } from "../../config";
import KeyFileConfig from "../../config/KeyFileConfig";
import { GetBestBidAskParams, GetProductBookParams, GetProductCandlesParams, GetMarketTradesParams, ListProductsParams } from "../../rest/types/products";

const keyFile = process.env.KEY_FILENAME;
const config = loadRestConfig(keyFile);

async function demo() {
  const client = new CoinbaseClient(
    KeyFileConfig.getInstance(config.name, config.privateKey)
  );

  try {
    const listProductsParams: ListProductsParams = {};
    const productsData = await client.products?.listProducts(listProductsParams);
    console.log("Fetched products data:", productsData);

    if (!productsData?.products || productsData.products.length === 0) {
      throw new Error("No products found");
    }

    const productID = productsData.products[0].product_id;
    const productData = await client.products?.getProduct(productID);
    console.log("Fetched product data:", productData);

    const getBestBidAskParams: GetBestBidAskParams = { product_ids: [productID] };
    const bestBidAskData = await client.products?.getBestBidAsk(getBestBidAskParams);
    console.log("Fetched best bid/ask data:", bestBidAskData);

    const getProductCandlesParams: GetProductCandlesParams = {
      start: Math.floor(Date.now() / 1000 - 24 * 60 * 60).toString(),
      end: Math.floor(Date.now() / 1000).toString(),
      granularity: 'ONE_HOUR'
    };
    const productCandlesData = await client.products?.getProductCandles(productID, getProductCandlesParams);
    console.log("Fetched product candles data:", productCandlesData);

    const getMarketTradesParams: GetMarketTradesParams = {
      limit: 10
    };
    const marketTradesData = await client.products?.getMarketTrades(productID, getMarketTradesParams);
    console.log("Fetched market trades data:", marketTradesData);

    const getProductBookParams: GetProductBookParams = {
      product_id: productID,
      limit: 10
    };
    const productBookData = await client.products?.getProductBook(getProductBookParams);
    console.log("Fetched product book data:", productBookData);
  } catch (error) {
    console.error("Error calling Coinbase API:", error instanceof Error ? error.message : error);
  }
}

demo().catch(console.error);
