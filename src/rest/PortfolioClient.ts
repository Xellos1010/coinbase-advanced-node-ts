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
  GetPortfolioBalancesResponse,
  CreatePortfolioParams,
  CreatePortfolioResponse,
  MovePortfolioFundsParams,
  MovePortfolioFundsResponse,
  EditPortfolioResponse,
  DeletePortfolioResponse,
  ClosePositionResponse,
  SetIntradayMarginSettingResponse,
  ScheduleFuturesSweepResponse,
  CancelFuturesSweepResponse,
  AllocatePortfolioResponse,
  OptInOutMultiAssetCollateralResponse
} from "./types/portfolios";

class PortfolioClient extends BaseRestClient {
  /**
   * **List Portfolios**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/portfolios
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
   * **Create Portfolio**
   * 
   * [POST] https://api.coinbase.com/api/v3/brokerage/portfolios
   * 
   * Create a new portfolio.
   * 
   * @param params - Parameters for creating a portfolio
   * @returns Promise resolving to the created portfolio
   */
  async createPortfolio(params: CreatePortfolioParams): Promise<CreatePortfolioResponse> {
    return await this.postRequest<CreatePortfolioResponse>('/portfolios', params);
  }

  /**
   * **Get Portfolio Breakdown**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/portfolios/{portfolioUUID}
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
   * **Move Portfolio Funds**
   * 
   * [POST] https://api.coinbase.com/api/v3/brokerage/portfolios/move_funds
   * 
   * Transfer funds between portfolios.
   * 
   * @param params - Parameters for moving portfolio funds
   * @returns Promise resolving to the result of the move
   */
  async movePortfolioFunds(params: MovePortfolioFundsParams): Promise<MovePortfolioFundsResponse> {
    return await this.postRequest<MovePortfolioFundsResponse>('/portfolios/move_funds', params);
  }

  /**
   * **Edit Portfolio**
   * 
   * [PUT] https://api.coinbase.com/api/v3/brokerage/portfolios/{portfolioUUID}
   * 
   * Modify a portfolio by portfolio ID.
   * 
   * @param portfolioUUID - The UUID of the portfolio
   * @param name - The new name for the portfolio
   * @returns Promise resolving to the edited portfolio
   */
  async editPortfolio(portfolioUUID: string, name: string): Promise<EditPortfolioResponse> {
    return await this.putRequest<EditPortfolioResponse>(`/portfolios/${portfolioUUID}`, { name });
  }

  /**
   * **Delete Portfolio**
   * 
   * [DELETE] https://api.coinbase.com/api/v3/brokerage/portfolios/{portfolioUUID}
   * 
   * Delete a portfolio by portfolio ID.
   * 
   * @param portfolioUUID - The UUID of the portfolio
   * @returns Promise resolving to the result of the deletion
   */
  async deletePortfolio(portfolioUUID: string): Promise<DeletePortfolioResponse> {
    return await this.deleteRequest<DeletePortfolioResponse>(`/portfolios/${portfolioUUID}`);
  }

  /**
   * **Close Position**
   * 
   * [POST] https://api.coinbase.com/api/v3/brokerage/portfolios/{portfolioUUID}/positions/{positionID}/close
   * 
   * Close a position in a portfolio.
   * 
   * @param portfolioUUID - The UUID of the portfolio
   * @param positionID - The ID of the position to close
   * @returns Promise resolving to the result of the position closure
   */
  async closePosition(portfolioUUID: string, positionID: string): Promise<ClosePositionResponse> {
    return await this.postRequest<ClosePositionResponse>(`/portfolios/${portfolioUUID}/positions/${positionID}/close`, {});
  }

  /**
   * **Get Futures Balance Summary**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/cfm/balance_summary
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
   * Retrieve the intraday margin setting.
   * 
   * @returns Promise resolving to the intraday margin setting
   */
  async getIntradayMarginSetting(): Promise<GetIntradayMarginSettingResponse> {
    return await this.getRequest<GetIntradayMarginSettingResponse>('/cfm/intraday/margin_setting');
  }

  /**
   * **Set Intraday Margin Setting**
   * 
   * [POST] https://api.coinbase.com/api/v3/brokerage/cfm/intraday/margin_setting
   * 
   * Set the intraday margin setting.
   * 
   * @param params - Parameters for setting the intraday margin
   * @returns Promise resolving to the result of the setting operation
   */
  async setIntradayMarginSetting(params: any): Promise<SetIntradayMarginSettingResponse> {
    return await this.postRequest<SetIntradayMarginSettingResponse>('/cfm/intraday/margin_setting', params);
  }

  /**
   * **Get Current Margin Window**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/cfm/intraday/current_margin_window
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
   * **Schedule Futures Sweep**
   * 
   * [POST] https://api.coinbase.com/api/v3/brokerage/cfm/sweeps
   * 
   * Schedule a futures sweep.
   * 
   * @param params - Parameters for scheduling the sweep
   * @returns Promise resolving to the result of the sweep scheduling
   */
  async scheduleFuturesSweep(params: any): Promise<ScheduleFuturesSweepResponse> {
    return await this.postRequest<ScheduleFuturesSweepResponse>('/cfm/sweeps', params);
  }

  /**
   * **Cancel Pending Futures Sweep**
   * 
   * [DELETE] https://api.coinbase.com/api/v3/brokerage/cfm/sweeps/{sweepID}
   * 
   * Cancel a pending futures sweep.
   * 
   * @param sweepID - The ID of the sweep to cancel
   * @returns Promise resolving to the result of the cancellation
   */
  async cancelPendingFuturesSweep(sweepID: string): Promise<CancelFuturesSweepResponse> {
    return await this.deleteRequest<CancelFuturesSweepResponse>(`/cfm/sweeps/${sweepID}`);
  }

  /**
   * **Get Perpetuals Portfolio Summary**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/intx/portfolio/{portfolioUUID}
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
   * Retrieve the balances of a specific portfolio.
   * 
   * @param portfolioUUID - The UUID of the portfolio
   * @returns Promise resolving to the portfolio balances
   */
  async getPortfolioBalances(portfolioUUID: string): Promise<GetPortfolioBalancesResponse> {
    return await this.getRequest<GetPortfolioBalancesResponse>(`/intx/balances/${portfolioUUID}`);
  }

  /**
   * **Allocate Portfolio**
   * 
   * [POST] https://api.coinbase.com/api/v3/brokerage/portfolios/{portfolioUUID}/allocate
   * 
   * Allocate funds within a portfolio.
   * 
   * @param portfolioUUID - The UUID of the portfolio
   * @param params - Parameters for the allocation
   * @returns Promise resolving to the result of the allocation
   */
  async allocatePortfolio(portfolioUUID: string, params: any): Promise<AllocatePortfolioResponse> {
    return await this.postRequest<AllocatePortfolioResponse>(`/portfolios/${portfolioUUID}/allocate`, params);
  }

  /**
   * **Opt In or Out of Multi Asset Collateral**
   * 
   * [POST] https://api.coinbase.com/api/v3/brokerage/portfolios/multi_asset_collateral
   * 
   * Opt in or out of multi asset collateral.
   * 
   * @param params - Parameters for opting in or out
   * @returns Promise resolving to the result of the operation
   */
  async optInOutMultiAssetCollateral(params: any): Promise<OptInOutMultiAssetCollateralResponse> {
    return await this.postRequest<OptInOutMultiAssetCollateralResponse>('/portfolios/multi_asset_collateral', params);
  }
}

export default PortfolioClient;
