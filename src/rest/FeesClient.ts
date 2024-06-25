import BaseRestClient from "./BaseRestClient"; 
import { TransactionsSummaryParams, TransactionsSummaryResponse } from "./types/fees";

/**
 * **Get Transactions Summary**
 * 
 * [GET] https://api.coinbase.com/api/v3/brokerage/transaction_summary
 * 
 * **Description:**
 * 
 * Get a summary of transactions with fee tiers, total volume, and fees.
 */
class FeesClient extends BaseRestClient {
  async getTransactionsSummary(queryParams: TransactionsSummaryParams = {}): Promise<TransactionsSummaryResponse> {
    return await this.getRequest<TransactionsSummaryResponse>(`/transaction_summary`, queryParams);
  }
}

export default FeesClient;
