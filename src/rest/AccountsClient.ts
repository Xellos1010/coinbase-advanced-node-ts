import BaseRestClient from "./BaseRestClient";
import { ListAccountsParams } from "./types/accounts/ListAccountsParams";
import { GetAccountResponse } from "./types/accounts/GetAccountResponse";
import { ListAccountsResponse } from "./types/accounts/ListAccountsResponse";

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
   * **Read more on the official documentation:** 
   * https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getaccounts
   * 
   * @param params - Optional parameters for filtering accounts
   * @returns Promise resolving to the list of accounts
   */
  async listAccounts(params?: ListAccountsParams): Promise<ListAccountsResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      if (params.limit !== undefined && params.limit !== 0) {
        queryParams.append('limit', params.limit.toString());
      }
      if (params.cursor && params.cursor !== undefined) {
        queryParams.append('cursor', params.cursor);
      }
      if (params.retailPortfolioId && params.cursor !== undefined) {
        queryParams.append('retail_portfolio_id', params.retailPortfolioId);
      }
    }

    const queryString = queryParams.toString();
    const url = '/accounts';
    
    return await this.getRequest(url, queryString);
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
   * **Read more on the official documentation:** 
   * https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getaccount
   * 
   * @param accountUUID - The UUID of the account to retrieve
   * @returns Promise resolving to the account information
   */
  async getAccount(accountUUID: string): Promise<GetAccountResponse> {
    return await this.getRequest(`/accounts/${accountUUID}`);
  }
}

export default AccountsClient;
