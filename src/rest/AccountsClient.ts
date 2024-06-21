import BaseRestClient from "./BaseRestClient"; 
import { GetAccountResponse } from "./types/accounts/GetAccountResponse";
import { ListAccountsResponse } from "./types/accounts/ListAccountsResponse";

class AccountsClient extends BaseRestClient {
  async listAccounts(): Promise<ListAccountsResponse> {
    return await this.getRequest("/accounts");
  }

  async getAccount(accountUUID: string): Promise<GetAccountResponse> {
    return await this.getRequest(`/accounts/${accountUUID}`);
  }
}

export default AccountsClient;
