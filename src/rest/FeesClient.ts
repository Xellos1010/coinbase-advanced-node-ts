// src/rest/fees.ts
import BaseRestClient from "./BaseRestClient"; 

class FeesClient extends BaseRestClient {
  async getTransactionsSummary(queryParams: object = {}): Promise<any> {
    const queryString = new URLSearchParams(queryParams as any).toString();
    return await this.getRequest(`/transaction_summary`, queryString);
  }
}

export default FeesClient;
