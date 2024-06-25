import BaseRestClient from "./BaseRestClient";
import {
  ClosePositionParams,
  FuturesPositionResponse,
  FuturesBalanceSummaryResponse,
  ListFuturesPositionsResponse,
  ScheduleFuturesSweepParams,
  ScheduleFuturesSweepResponse,
  CancelFuturesSweepResponse,
  GetIntradayMarginSettingResponse,
  GetCurrentMarginWindowParams,
  GetCurrentMarginWindowResponse,
  SetIntradayMarginSettingParams,
  SetIntradayMarginSettingResponse,
} from "./types/futures";

class FuturesClient extends BaseRestClient {
  /**
   * **Close Position**
   * 
   * [POST] https://api.coinbase.com/api/v3/brokerage/orders/close_position
   * 
   * **Description:**
   * 
   * Close an existing futures position.
   * 
   * @param params - The parameters for closing the position
   * @returns Promise resolving to the closed position response
   */
  async closePosition(params: ClosePositionParams): Promise<FuturesPositionResponse> {
    const url = "/orders/close_position";
    return await this.postRequest<FuturesPositionResponse>(url, params);
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
  async getFuturesBalanceSummary(): Promise<FuturesBalanceSummaryResponse> {
    const url = "/cfm/balance_summary";
    return await this.getRequest<FuturesBalanceSummaryResponse>(url);
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
    const url = "/cfm/positions";
    return await this.getRequest<ListFuturesPositionsResponse>(url);
  }

  /**
   * **Get Futures Position**
   * 
   * [GET] https://api.coinbase.com/api/v3/brokerage/cfm/positions/{productId}
   * 
   * **Description:**
   * 
   * Retrieve information about a specific futures position.
   * 
   * @param productId - The ID of the product
   * @returns Promise resolving to the futures position information
   */
  async getFuturesPosition(productId: string): Promise<FuturesPositionResponse> {
    const url = `/cfm/positions/${productId}`;
    return await this.getRequest<FuturesPositionResponse>(url);
  }

  /**
   * **Schedule Futures Sweep**
   * 
   * [POST] https://api.coinbase.com/api/v3/brokerage/cfm/sweeps/schedule
   * 
   * **Description:**
   * 
   * Schedule a futures sweep.
   * 
   * @param params - The parameters for scheduling the sweep
   * @returns Promise resolving to the scheduled futures sweep response
   */
  async scheduleFuturesSweep(params: ScheduleFuturesSweepParams): Promise<ScheduleFuturesSweepResponse> {
    const url = "/cfm/sweeps/schedule";
    return await this.postRequest<ScheduleFuturesSweepResponse>(url, params);
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
  async listFuturesSweeps(): Promise<ScheduleFuturesSweepResponse[]> {
    const url = "/cfm/sweeps";
    return await this.getRequest<ScheduleFuturesSweepResponse[]>(url);
  }

  /**
   * **Cancel Pending Futures Sweep**
   * 
   * [DELETE] https://api.coinbase.com/api/v3/brokerage/cfm/sweeps
   * 
   * **Description:**
   * 
   * Cancel a pending futures sweep.
   * 
   * @returns Promise resolving to the cancellation response
   */
  async cancelPendingFuturesSweep(): Promise<CancelFuturesSweepResponse> {
    const url = "/cfm/sweeps";
    return await this.deleteRequest<CancelFuturesSweepResponse>(url);
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
    const url = "/cfm/intraday/margin_setting";
    return await this.getRequest<GetIntradayMarginSettingResponse>(url);
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
   * @param params - The parameters for getting the current margin window
   * @returns Promise resolving to the current margin window
   */
  async getCurrentMarginWindow(params: GetCurrentMarginWindowParams): Promise<GetCurrentMarginWindowResponse> {
    const url = "/cfm/intraday/current_margin_window";
    return await this.getRequest<GetCurrentMarginWindowResponse>(url, params);
  }

  /**
   * **Set Intraday Margin Setting**
   * 
   * [POST] https://api.coinbase.com/api/v3/brokerage/cfm/intraday/margin_setting
   * 
   * **Description:**
   * 
   * Set the intraday margin setting.
   * 
   * @param params - The parameters for setting the intraday margin
   * @returns Promise resolving to the intraday margin setting response
   */
  async setIntradayMarginSetting(params: SetIntradayMarginSettingParams): Promise<SetIntradayMarginSettingResponse> {
    const url = "/cfm/intraday/margin_setting";
    return await this.postRequest<SetIntradayMarginSettingResponse>(url, params);
  }
}

export default FuturesClient;
