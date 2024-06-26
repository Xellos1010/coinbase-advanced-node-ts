import BaseRestClient from './BaseRestClient';
import {
  MarketTradesResponse,
  ServerTimeResponse,
  ProductBookResponse,
  ProductsResponse,
  ProductResponse,
  ProductCandlesResponse,
  GetProductBookParams,
  GetProductCandlesParams,
  GetMarketTradesParams
} from './types/public';

class PublicClient extends BaseRestClient {
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
   * @param params - The parameters for the request
   * @returns Promise resolving to the product book
   */
  async getProductBook(params: GetProductBookParams): Promise<ProductBookResponse> {
    const { productID, limit } = params;
    const queryParams = { product_id: productID, limit: limit ? limit.toString() : undefined };
    return await this.getPublicRequest<ProductBookResponse>(`/market/product_book`, queryParams);
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
   * @param params - The parameters for the request
   * @returns Promise resolving to the candlestick data
   */
  async getProductCandles(params: GetProductCandlesParams): Promise<ProductCandlesResponse> {
    const { productID, start, end, granularity } = params;
    const queryParams = { start, end, granularity };
    return await this.getPublicRequest<ProductCandlesResponse>(`/market/products/${productID}/candles`, queryParams);
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
   * @param params - The parameters for the request
   * @returns Promise resolving to the market trades
   */
  async getMarketTrades(params: GetMarketTradesParams): Promise<MarketTradesResponse> {
    const { productID, limit } = params;
    const queryParams = { limit: limit.toString() };
    return await this.getPublicRequest<MarketTradesResponse>(`/market/products/${productID}/ticker`, queryParams);
  }
}

export default PublicClient;
