import BaseClient from '../BaseClient';
import {
  MarketTradesResponse,
  ServerTimeResponse,
  ProductBookResponse,
  ProductsResponse,
  ProductResponse,
  ProductCandlesResponse
} from './types/public';

class PublicClient extends BaseClient {
  /**
   * **Get Server Time**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/time
   * 
   * **Description:**
   * 
   * Retrieve the current server time.
   * 
   * @returns Promise resolving to the server time
   */
  async getServerTime(): Promise<ServerTimeResponse> {
    return await this.getPublicRequest<ServerTimeResponse>("/time");
  }

  /**
   * **Get Product Book**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/market/product_book
   * 
   * **Description:**
   * 
   * Retrieve the order book for a specific product.
   * 
   * @param productID - The ID of the product
   * @param limit - Optional limit on the number of entries to retrieve
   * @returns Promise resolving to the product book
   */
  async getProductBook(productID: string, limit?: number): Promise<ProductBookResponse> {
    const queryParams = new URLSearchParams({ product_id: productID });
    if (limit) queryParams.append("limit", limit.toString());
    return await this.getPublicRequest<ProductBookResponse>(`/market/product_book?${queryParams.toString()}`);
  }

  /**
   * **List Products**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/market/products
   * 
   * **Description:**
   * 
   * Get a list of available products.
   * 
   * @returns Promise resolving to the list of products
   */
  async listProducts(): Promise<ProductsResponse> {
    return await this.getPublicRequest<ProductsResponse>("/market/products");
  }

  /**
   * **Get Product**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/market/products/{productID}
   * 
   * **Description:**
   * 
   * Retrieve information about a specific product.
   * 
   * @param productID - The ID of the product to retrieve
   * @returns Promise resolving to the product information
   */
  async getProduct(productID: string): Promise<ProductResponse> {
    return await this.getPublicRequest<ProductResponse>(`/market/products/${productID}`);
  }

  /**
   * **Get Product Candles**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/market/products/{productID}/candles
   * 
   * **Description:**
   * 
   * Retrieve historical candlestick data for a specific product.
   * 
   * @param productID - The ID of the product
   * @param start - Start time for the candlestick data
   * @param end - End time for the candlestick data
   * @param granularity - Granularity of the candlestick data
   * @returns Promise resolving to the candlestick data
   */
  async getProductCandles(productID: string, start: string, end: string, granularity: string): Promise<ProductCandlesResponse> {
    const queryParams = new URLSearchParams({ start, end, granularity });
    return await this.getPublicRequest<ProductCandlesResponse>(`/market/products/${productID}/candles?${queryParams.toString()}`);
  }

  /**
   * **Get Market Trades**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/market/products/{productID}/ticker
   * 
   * **Description:**
   * 
   * Retrieve recent market trades for a specific product.
   * 
   * @param productID - The ID of the product
   * @param limit - Limit on the number of trades to retrieve
   * @returns Promise resolving to the market trades
   */
  async getMarketTrades(productID: string, limit: number): Promise<MarketTradesResponse> {
    const queryParams = new URLSearchParams({ limit: limit.toString() });
    return await this.getPublicRequest<MarketTradesResponse>(`/market/products/${productID}/ticker?${queryParams.toString()}`);
  }
}

export default PublicClient;
