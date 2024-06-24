// src/rest/fees.ts
import BaseRestClient from "./BaseRestClient"; 
import { TransactionsSummaryParams } from "./types/fees/TransactionsSummaryParams";
import { TransactionsSummaryResponse } from "./types/fees/TransactionsSummaryResponse";

/**
 * **Get Transactions Summary**
 * _____________________________
 *
 * [GET] https://api.coinbase.com/api/v3/brokerage/transaction_summary
 *
 * __________
 *
 * **Description:**
 *
 * Get a summary of transactions with fee tiers, total volume, and fees.
 *
 * __________
 *
 * **Read more on the official documentation:** `Get Transaction Summary <https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_gettransactionsummary/>`_
 */
class FeesClient extends BaseRestClient {
  async getTransactionsSummary(queryParams: TransactionsSummaryParams = {}): Promise<TransactionsSummaryResponse> {
    const filteredParams = Object.keys(queryParams)
      .filter(key => {
        const value = queryParams[key];
        return value !== undefined && value !== '' && value !== null;
      })
      .reduce((obj, key) => {
        obj[key] = queryParams[key];
        return obj;
      }, {} as TransactionsSummaryParams);
    
    const queryString = new URLSearchParams(filteredParams as any).toString();
    return await this.getRequest(`/transaction_summary`, queryString);
  }
}

export default FeesClient;
