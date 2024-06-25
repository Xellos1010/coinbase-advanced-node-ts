import { randomBytes } from "crypto";
import BaseRestClient from "./BaseRestClient";
import {
  GetOrderResponse,
  ListOrdersResponse,
  EditOrderResponse,
  CancelOrdersResponse,
  CreateOrderResponse,
  ListFillsResponse,
  PreviewOrderResponse
} from "./types/orders";

class OrdersClient extends BaseRestClient {
  /**
   * **Generate Client Order ID**
   * 
   * Generates a unique client order ID.
   * 
   * @returns Promise resolving to the generated client order ID
   */
  async generateClientOrderID(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "");
    const randomPart = randomBytes(8).toString("hex");
    return `${timestamp}-${randomPart}`;
  }

  /**
   * **Create Order**
   * 
   * [POST] https://api.coinbase.com/api/v3/brokerage/orders
   * 
   * **Description:**
   * 
   * Create a new order.
   * 
   * @param orderData - The data for the order to create
   * @returns Promise resolving to the created order
   */
  async createOrder(orderData: object): Promise<CreateOrderResponse> {
    return await this.postRequest<CreateOrderResponse>(`/orders`, orderData);
  }

  /**
   * **Create Buy Order**
   * 
   * [POST] https://api.coinbase.com/api/v3/brokerage/orders
   * 
   * **Description:**
   * 
   * Create a new buy order.
   * 
   * @param productID - The ID of the product to buy
   * @param baseSize - The base size of the order
   * @param clientOrderID - The client order ID
   * @param orderConfig - The configuration for the order
   * @returns Promise resolving to the created buy order
   */
  async createBuyOrder(
    productID: string,
    baseSize: string,
    clientOrderID: string,
    orderConfig: { limit_price: string; end_time: string; post_only?: boolean }
  ): Promise<CreateOrderResponse> {
    const orderData = {
      client_order_id: clientOrderID,
      product_id: productID,
      side: "BUY",
      order_configuration: {
        limit_limit_gtd: {
          limit_price: orderConfig.limit_price,
          post_only: orderConfig.post_only || false,
          end_time: orderConfig.end_time,
          base_size: baseSize,
        },
      },
    };
    return await this.createOrder(orderData);
  }

  /**
   * **Create Sell Order**
   * 
   * [POST] https://api.coinbase.com/api/v3/brokerage/orders
   * 
   * **Description:**
   * 
   * Create a new sell order.
   * 
   * @param productID - The ID of the product to sell
   * @param baseSize - The base size of the order
   * @param clientOrderID - The client order ID
   * @param orderConfig - The configuration for the order
   * @returns Promise resolving to the created sell order
   */
  async createSellOrder(
    productID: string,
    baseSize: string,
    clientOrderID: string,
    orderConfig: { limit_price: string; end_time: string; post_only?: boolean }
  ): Promise<CreateOrderResponse> {
    const orderData = {
      client_order_id: clientOrderID,
      product_id: productID,
      side: "SELL",
      order_configuration: {
        limit_limit_gtd: {
          limit_price: orderConfig.limit_price,
          post_only: orderConfig.post_only || false,
          end_time: orderConfig.end_time,
          base_size: baseSize,
        },
      },
    };
    return await this.createOrder(orderData);
  }

  /**
   * **Preview Order**
   * 
   * [POST] https://api.coinbase.com/api/v3/brokerage/orders/preview
   * 
   * **Description:**
   * 
   * Preview an order.
   * 
   * @param orderData - The data for the order to preview
   * @returns Promise resolving to the preview of the order
   */
  async previewOrder(orderData: object): Promise<PreviewOrderResponse> {
    return await this.postRequest<PreviewOrderResponse>(`/orders/preview`, orderData);
  }

  /**
   * **Preview Buy Order**
   * 
   * [POST] https://api.coinbase.com/api/v3/brokerage/orders/preview
   * 
   * **Description:**
   * 
   * Preview a new buy order.
   * 
   * @param product_id - The ID of the product to buy
   * @param base_size - The base size of the order
   * @param client_order_id - The client order ID
   * @param order_configuration - The configuration for the order
   * @param commission_rate - Optional commission rate for the order
   * @returns Promise resolving to the preview of the buy order
   */
  async previewBuyOrder(
    product_id: string,
    base_size: string,
    client_order_id: string,
    order_configuration: {
      limit_price: string;
      end_time: string;
      post_only?: boolean;
    },
    commission_rate: string = "0.01"
  ): Promise<PreviewOrderResponse> {
    const orderData = {
      product_id,
      side: "BUY",
      commission_rate: {
        value: commission_rate,
      },
      order_configuration: {
        limit_limit_gtd: {
          limit_price: order_configuration.limit_price,
          post_only: order_configuration.post_only || false,
          end_time: order_configuration.end_time,
          base_size,
        },
      },
      client_order_id,
    };
    return await this.previewOrder(orderData);
  }

  /**
   * **Preview Sell Order**
   * 
   * [POST] https://api.coinbase.com/api/v3/brokerage/orders/preview
   * 
   * **Description:**
   * 
   * Preview a new sell order.
   * 
   * @param product_id - The ID of the product to sell
   * @param base_size - The base size of the order
   * @param client_order_id - The client order ID
   * @param order_configuration - The configuration for the order
   * @param commission_rate - Optional commission rate for the order
   * @returns Promise resolving to the preview of the sell order
   */
  async previewSellOrder(
    product_id: string,
    base_size: string,
    client_order_id: string,
    order_configuration: {
      limit_price: string;
      end_time: string;
      post_only?: boolean;
    },
    commission_rate: string = "0.01"
  ): Promise<PreviewOrderResponse> {
    const orderData = {
      product_id,
      side: "SELL",
      commission_rate: {
        value: commission_rate,
      },
      order_configuration: {
        limit_limit_gtd: {
          limit_price: order_configuration.limit_price,
          post_only: order_configuration.post_only || false,
          end_time: order_configuration.end_time,
          base_size,
        },
      },
      client_order_id,
    };
    return await this.previewOrder(orderData);
  }

  /**
   * **Cancel Orders**
   * 
   * [POST] https://api.coinbase.com/api/v3/brokerage/orders/batch_cancel
   * 
   * **Description:**
   * 
   * Cancel a batch of orders.
   * 
   * @param orderIDs - The IDs of the orders to cancel
   * @returns Promise resolving to the cancellation response
   */
  async cancelOrders(orderIDs: string[]): Promise<CancelOrdersResponse> {
    const data = { order_ids: orderIDs };
    return await this.postRequest<CancelOrdersResponse>(`/orders/batch_cancel`, data);
  }

  /**
   * **Edit Order**
   * 
   * [POST] https://api.coinbase.com/api/v3/brokerage/orders/edit
   * 
   * **Description:**
   * 
   * Edit an existing order.
   * 
   * @param orderID - The ID of the order to edit
   * @param newData - The new data for the order
   * @returns Promise resolving to the edited order
   */
  async editOrder(orderID: string, newData: object): Promise<EditOrderResponse> {
    const data = { order_id: orderID, ...newData };
    return await this.postRequest<EditOrderResponse>(`/orders/edit`, data);
  }

  /**
   * **Preview Edit Order**
   * 
   * [POST] https://api.coinbase.com/api/v3/brokerage/orders/edit_preview
   * 
   * **Description:**
   * 
   * Preview the edit of an existing order.
   * 
   * @param orderID - The ID of the order to edit
   * @param newData - The new data for the order
   * @returns Promise resolving to the preview of the edited order
   */
  async previewEditOrder(orderID: string, newData: object): Promise<PreviewOrderResponse> {
    const data = { order_id: orderID, ...newData };
    return await this.postRequest<PreviewOrderResponse>(`/orders/edit_preview`, data);
  }

  /**
   * **List Orders**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/orders/historical/batch
   * 
   * **Description:**
   * 
   * Retrieve a list of historical orders.
   * 
   * @param queryParams - Optional query parameters for filtering the results
   * @returns Promise resolving to the list of historical orders
   */
  async listOrders(queryParams?: object): Promise<ListOrdersResponse> {
    return await this.getRequest<ListOrdersResponse>(`/orders/historical/batch`, queryParams);
  }

  /**
   * **List Fills**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/orders/historical/fills
   * 
   * **Description:**
   * 
   * Retrieve a list of fills.
   * 
   * @param queryParams - Optional query parameters for filtering the results
   * @returns Promise resolving to the list of fills
   */
  async listFills(queryParams?: object): Promise<ListFillsResponse> {
    return await this.getRequest<ListFillsResponse>(`/orders/historical/fills`, queryParams);
  }

  /**
   * **Get Order**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/orders/historical/{orderID}
   * 
   * **Description:**
   * 
   * Retrieve information about a specific order.
   * 
   * @param orderID - The ID of the order to retrieve
   * @returns Promise resolving to the order information
   */
  async getOrder(orderID: string): Promise<GetOrderResponse> {
    return await this.getRequest<GetOrderResponse>(`/orders/historical/${orderID}`);
  }
}

export default OrdersClient;
