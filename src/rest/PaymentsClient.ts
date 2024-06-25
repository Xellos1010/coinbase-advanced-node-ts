import BaseRestClient from "./BaseRestClient";

class PaymentsClient extends BaseRestClient {
  /**
   * **List Payment Methods**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/payment_methods
   * 
   * **Description:**
   * 
   * Retrieve a list of payment methods.
   * 
   * @returns Promise resolving to the list of payment methods
   */
  async listPaymentMethods(): Promise<any> {
    return await this.getRequest(`/payment_methods`);
  }
}

export default PaymentsClient;
