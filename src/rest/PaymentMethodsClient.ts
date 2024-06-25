import BaseRestClient from "./BaseRestClient";
import { ListPaymentMethodsResponse, GetPaymentMethodResponse } from "./types/payment_methods";

class PaymentMethodsClient extends BaseRestClient {
  /**
   * **List Payment Methods**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/payment_methods
   * 
   * **Description:**
   * 
   * Retrieve a list of payment methods for the current user.
   * 
   * @returns Promise resolving to the list of payment methods
   */
  async listPaymentMethods(): Promise<ListPaymentMethodsResponse> {
    return await this.getRequest<ListPaymentMethodsResponse>(`/payment_methods`);
  }

  /**
   * **Get Payment Method**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/payment_methods/{payment_method_id}
   * 
   * **Description:**
   * 
   * Get information about a payment method for the current user.
   * 
   * @param payment_method_id - Unique identifier for the payment method
   * @returns Promise resolving to the payment method details
   */
  async getPaymentMethod(payment_method_id: string): Promise<GetPaymentMethodResponse> {
    return await this.getRequest<GetPaymentMethodResponse>(`/payment_methods/${payment_method_id}`);
  }
}

export default PaymentMethodsClient;
