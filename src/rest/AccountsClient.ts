import BaseRestClient from "./BaseRestClient";
import { ListAccountsParams, GetAccountResponse, ListAccountsResponse } from "./types/accounts";

class AccountsClient extends BaseRestClient {
  /**
   * **List Accounts**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/accounts
   * 
   * **Description:**
   * 
   * Get a list of authenticated accounts for the current user.
   * 
   * @param params - Optional parameters for filtering accounts
   * @returns Promise resolving to the list of accounts
   */
  async listAccounts(params?: ListAccountsParams): Promise<ListAccountsResponse> {
    const url = '/accounts';
    const queryParams: { [key: string]: string } = {};
    if (params) {
      if (params.limit !== undefined && params.limit !== 0) {
        queryParams.limit = params.limit.toString();
      }
      if (params.cursor) {
        queryParams.cursor = params.cursor;
      }
      if (params.retailPortfolioId) {
        queryParams.retail_portfolio_id = params.retailPortfolioId; // Ensure correct parameter format
      }
    }
    return await this.getRequest<ListAccountsResponse>(url, queryParams);
  }

  /**
   * **Get Account**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/accounts/{accountUUID}
   * 
   * **Description:**
   * 
   * Get a list of information about an account, given an account UUID.
   * 
   * @param accountUUID - The UUID of the account to retrieve
   * @returns Promise resolving to the account information
   */
  async getAccount(accountUUID: string): Promise<GetAccountResponse> {
    return await this.getRequest<GetAccountResponse>(`/accounts/${accountUUID}`);
  }
}

export default AccountsClient;
