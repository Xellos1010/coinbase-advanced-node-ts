import BaseRestClient from "./BaseRestClient";
import {
  GetBestBidAskResponse,
  ListProductsResponse,
  GetProductResponse,
  GetProductCandlesResponse,
  GetMarketTradesResponse,
  GetProductBookResponse,
  GetBestBidAskParams,
  ListProductsParams,
  GetProductCandlesParams,
  GetMarketTradesParams,
  GetProductBookParams
} from "./types/products";

class ProductsClient extends BaseRestClient {
  /**
   * **Get Best Bid Ask**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/products/best_bid_ask
   * 
   * **Description:**
   * 
   * Retrieve the best bid and ask prices for a list of products.
   * 
   * @param params - Optional parameters for filtering the results
   * @returns Promise resolving to the best bid and ask prices
   */
  async getBestBidAsk(params?: GetBestBidAskParams): Promise<GetBestBidAskResponse> {
    const queryParams = params?.product_ids ? { product_ids: params.product_ids.join(",") } : {};
    return await this.getRequest<GetBestBidAskResponse>("/best_bid_ask", queryParams);
  }

  /**
   * **List Products**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/products
   * 
   * **Description:**
   * 
   * Get a list of available products.
   * 
   * @param params - Optional parameters for filtering the results
   * @returns Promise resolving to the list of products
   */
  async listProducts(params?: ListProductsParams): Promise<ListProductsResponse> {
    return await this.getRequest<ListProductsResponse>('/products', params);
  }

  /**
   * **Get Product**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/products/{productID}
   * 
   * **Description:**
   * 
   * Retrieve information about a specific product.
   * 
   * @param productID - The ID of the product to retrieve
   * @returns Promise resolving to the product information
   */
  async getProduct(productID: string): Promise<GetProductResponse> {
    return await this.getRequest<GetProductResponse>(`/products/${productID}`);
  }

  /**
   * **Get Product Candles**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/products/{productID}/candles
   * 
   * **Description:**
   * 
   * Retrieve historical candlestick data for a specific product.
   * 
   * @param productID - The ID of the product
   * @param params - Optional query parameters for filtering the results
   * @returns Promise resolving to the candlestick data
   */
  async getProductCandles(productID: string, params: GetProductCandlesParams): Promise<GetProductCandlesResponse> {
    return await this.getRequest<GetProductCandlesResponse>(`/products/${productID}/candles`, params);
  }

  /**
   * **Get Market Trades**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/products/{productID}/ticker
   * 
   * **Description:**
   * 
   * Retrieve recent market trades for a specific product.
   * 
   * @param productID - The ID of the product
   * @param params - Optional query parameters for filtering the results
   * @returns Promise resolving to the market trades
   */
  async getMarketTrades(productID: string, params: GetMarketTradesParams): Promise<GetMarketTradesResponse> {
    return await this.getRequest<GetMarketTradesResponse>(`/products/${productID}/ticker`, params);
  }

  /**
   * **Get Product Book**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/products/product_book
   * 
   * **Description:**
   * 
   * Retrieve the order book for a specific product.
   * 
   * @param params - Optional query parameters for filtering the results
   * @returns Promise resolving to the product book
   */
  async getProductBook(params: GetProductBookParams): Promise<GetProductBookResponse> {
    return await this.getRequest<GetProductBookResponse>('/product_book', params);
  }
}

export default ProductsClient;
