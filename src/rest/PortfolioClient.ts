import BaseRestClient from "./BaseRestClient";
import {
  ListPortfoliosParams,
  ListPortfoliosResponse,
  GetPortfolioBreakdownParams,
  GetPortfolioBreakdownResponse,
  GetFuturesBalanceSummaryResponse,
  ListFuturesPositionsResponse,
  GetFuturesPositionResponse,
  ListFuturesSweepsResponse,
  GetIntradayMarginSettingResponse,
  GetCurrentMarginWindowParams,
  GetCurrentMarginWindowResponse,
  GetPerpetualsPortfolioSummaryResponse,
  ListPerpetualsPositionsResponse,
  GetPerpetualsPositionResponse,
  GetPortfolioBalancesResponse
} from "./types/portfolios";

class PortfolioClient extends BaseRestClient {
  /**
   * **List Portfolios**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/portfolios
   * 
   * **Description:**
   * 
   * Retrieve a list of portfolios.
   * 
   * @param queryParams - Optional query parameters for filtering the results
   * @returns Promise resolving to the list of portfolios
   */
  async listPortfolios(queryParams: ListPortfoliosParams = {}): Promise<ListPortfoliosResponse> {
    return await this.getRequest<ListPortfoliosResponse>('/portfolios', queryParams);
  }

  /**
   * **Get Portfolio Breakdown**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/portfolios/{portfolioUUID}
   * 
   * **Description:**
   * 
   * Retrieve a detailed breakdown of a specific portfolio.
   * 
   * @param portfolioUUID - The UUID of the portfolio
   * @param queryParams - Optional query parameters for filtering the results
   * @returns Promise resolving to the portfolio breakdown
   */
  async getPortfolioBreakdown(portfolioUUID: string, queryParams: GetPortfolioBreakdownParams = {}): Promise<GetPortfolioBreakdownResponse> {
    return await this.getRequest<GetPortfolioBreakdownResponse>(`/portfolios/${portfolioUUID}`, queryParams);
  }

  /**
   * **Get Futures Balance Summary**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/cfm/balance_summary
   * 
   * **Description:**
   * 
   * Retrieve a summary of the futures balance.
   * 
   * @returns Promise resolving to the futures balance summary
   */
  async getFuturesBalanceSummary(): Promise<GetFuturesBalanceSummaryResponse> {
    return await this.getRequest<GetFuturesBalanceSummaryResponse>('/cfm/balance_summary');
  }

  /**
   * **List Futures Positions**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/cfm/positions
   * 
   * **Description:**
   * 
   * Retrieve a list of futures positions.
   * 
   * @returns Promise resolving to the list of futures positions
   */
  async listFuturesPositions(): Promise<ListFuturesPositionsResponse> {
    return await this.getRequest<ListFuturesPositionsResponse>('/cfm/positions');
  }

  /**
   * **Get Futures Position**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/cfm/positions/{productID}
   * 
   * **Description:**
   * 
   * Retrieve information about a specific futures position.
   * 
   * @param productID - The ID of the product
   * @returns Promise resolving to the futures position
   */
  async getFuturesPosition(productID: string): Promise<GetFuturesPositionResponse> {
    return await this.getRequest<GetFuturesPositionResponse>(`/cfm/positions/${productID}`);
  }

  /**
   * **List Futures Sweeps**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/cfm/sweeps
   * 
   * **Description:**
   * 
   * Retrieve a list of futures sweeps.
   * 
   * @returns Promise resolving to the list of futures sweeps
   */
  async listFuturesSweeps(): Promise<ListFuturesSweepsResponse> {
    return await this.getRequest<ListFuturesSweepsResponse>('/cfm/sweeps');
  }

  /**
   * **Get Intraday Margin Setting**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/cfm/intraday/margin_setting
   * 
   * **Description:**
   * 
   * Retrieve the intraday margin setting.
   * 
   * @returns Promise resolving to the intraday margin setting
   */
  async getIntradayMarginSetting(): Promise<GetIntradayMarginSettingResponse> {
    return await this.getRequest<GetIntradayMarginSettingResponse>('/cfm/intraday/margin_setting');
  }

  /**
   * **Get Current Margin Window**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/cfm/intraday/current_margin_window
   * 
   * **Description:**
   * 
   * Retrieve the current margin window.
   * 
   * @param queryParams - Optional query parameters for filtering the results
   * @returns Promise resolving to the current margin window
   */
  async getCurrentMarginWindow(queryParams: GetCurrentMarginWindowParams): Promise<GetCurrentMarginWindowResponse> {
    return await this.getRequest<GetCurrentMarginWindowResponse>('/cfm/intraday/current_margin_window', queryParams);
  }

  /**
   * **Get Perpetuals Portfolio Summary**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/intx/portfolio/{portfolioUUID}
   * 
   * **Description:**
   * 
   * Retrieve a summary of a perpetuals portfolio.
   * 
   * @param portfolioUUID - The UUID of the portfolio
   * @returns Promise resolving to the perpetuals portfolio summary
   */
  async getPerpetualsPortfolioSummary(portfolioUUID: string): Promise<GetPerpetualsPortfolioSummaryResponse> {
    return await this.getRequest<GetPerpetualsPortfolioSummaryResponse>(`/intx/portfolio/${portfolioUUID}`);
  }

  /**
   * **List Perpetuals Positions**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/intx/positions/{portfolioUUID}
   * 
   * **Description:**
   * 
   * Retrieve a list of perpetuals positions.
   * 
   * @param portfolioUUID - The UUID of the portfolio
   * @returns Promise resolving to the list of perpetuals positions
   */
  async listPerpetualsPositions(portfolioUUID: string): Promise<ListPerpetualsPositionsResponse> {
    return await this.getRequest<ListPerpetualsPositionsResponse>(`/intx/positions/${portfolioUUID}`);
  }

  /**
   * **Get Perpetuals Position**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/intx/positions/{portfolioUUID}/{symbol}
   * 
   * **Description:**
   * 
   * Retrieve information about a specific perpetuals position.
   * 
   * @param portfolioUUID - The UUID of the portfolio
   * @param symbol - The symbol of the position
   * @returns Promise resolving to the perpetuals position
   */
  async getPerpetualsPosition(portfolioUUID: string, symbol: string): Promise<GetPerpetualsPositionResponse> {
    return await this.getRequest<GetPerpetualsPositionResponse>(`/intx/positions/${portfolioUUID}/${symbol}`);
  }

  /**
   * **Get Portfolio Balances**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/intx/balances/{portfolioUUID}
   * 
   * **Description:**
   * 
   * Retrieve the balances of a specific portfolio.
   * 
   * @param portfolioUUID - The UUID of the portfolio
   * @returns Promise resolving to the portfolio balances
   */
  async getPortfolioBalances(portfolioUUID: string): Promise<GetPortfolioBalancesResponse> {
    return await this.getRequest<GetPortfolioBalancesResponse>(`/intx/balances/${portfolioUUID}`);
  }
}

export default PortfolioClient;