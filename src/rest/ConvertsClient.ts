import BaseRestClient from "./BaseRestClient";
import { 
  CreateConvertQuoteRequest, 
  CreateConvertQuoteResponse,
  CommitConvertTradeRequest,
  CommitConvertTradeResponse,
  GetConvertTradeParams,
  GetConvertTradeResponse
} from "./types/converts";

class ConvertsClient extends BaseRestClient {
  /**
   * **Create Convert Quote**
   * ________________________
   * 
   * [POST] https://api.coinbase.com/api/v3/brokerage/convert/quote
   * 
   * **Description:**
   * 
   * Create a convert quote with a specified source currency, target currency, and amount.
   * 
   * **Read more on the official documentation:** `Create Convert Quote <https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_createconvertquote>`_
   */
  async createConvertQuote(
    fromAccount: string,
    toAccount: string,
    amount: string,
    userIncentiveId?: string,
    codeVal?: string
  ): Promise<CreateConvertQuoteResponse> {
    const endpoint = `/convert/quote`;

    const data: CreateConvertQuoteRequest = {
      from_account: fromAccount,
      to_account: toAccount,
      amount: amount,
    };

    if (userIncentiveId || codeVal) {
      data.trade_incentive_metadata = {
        ...(userIncentiveId && { user_incentive_id: userIncentiveId }),
        ...(codeVal && { code_val: codeVal }),
      };
    }

    return await this.postRequest(endpoint, data);
  }

  /**
   * **Get Convert Trade**
   * _____________________
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/convert/trade/{trade_id}
   * 
   * **Description:**
   * 
   * Gets a list of information about a convert trade with a specified trade ID, source currency, and target currency.
   * 
   * **Read more on the official documentation:** `Get Convert Trade <https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getconverttrade>`_
   */
  async getConvertTrade(
    tradeID: string,
    fromAccount: string,
    toAccount: string,
    additionalParams: object = {}
  ): Promise<GetConvertTradeResponse> {
    const endpoint = `/convert/trade/${tradeID}`;

    const params: GetConvertTradeParams = {
      from_account: fromAccount,
      to_account: toAccount,
      ...additionalParams,
    };
    const queryString = new URLSearchParams(params as any).toString();
    return await this.getRequest(endpoint, queryString);
  }

  /**
   * **Commit Convert Trade**
   * ________________________
   * 
   * [POST] https://api.coinbase.com/api/v3/brokerage/convert/trade/{trade_id}
   * 
   * **Description:**
   * 
   * Commits a convert trade with a specified trade ID, source currency, and target currency.
   * 
   * **Read more on the official documentation:** `Commit Convert Trade <https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_commitconverttrade>`_
   */
  async commitConvertTrade(
    tradeID: string,
    fromAccount: string,
    toAccount: string,
    additionalParams: object = {}
  ): Promise<CommitConvertTradeResponse> {
    const endpoint = `/convert/trade/${tradeID}`;

    const data: CommitConvertTradeRequest = {
      from_account: fromAccount,
      to_account: toAccount,
      ...additionalParams,
    };

    return await this.postRequest(endpoint, data);
  }
}

export default ConvertsClient;
