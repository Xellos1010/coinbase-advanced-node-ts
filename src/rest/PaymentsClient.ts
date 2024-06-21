// src/rest/payments.ts
import BaseRestClient from "./BaseRestClient"; 

class PaymentsClient extends BaseRestClient {
  async listPaymentMethods(): Promise<any> {
    return await this.getRequest(`/payment_methods`);
  }
}

export default PaymentsClient;
