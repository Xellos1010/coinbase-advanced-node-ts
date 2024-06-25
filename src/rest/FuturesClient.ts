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
  async closePosition(params: ClosePositionParams): Promise<FuturesPositionResponse> {
    const url = "/orders/close_position";
    return await this.postRequest<FuturesPositionResponse>(url, params);
  }

  async getFuturesBalanceSummary(): Promise<FuturesBalanceSummaryResponse> {
    const url = "/cfm/balance_summary";
    return await this.getRequest<FuturesBalanceSummaryResponse>(url);
  }

  async listFuturesPositions(): Promise<ListFuturesPositionsResponse> {
    const url = "/cfm/positions";
    return await this.getRequest<ListFuturesPositionsResponse>(url);
  }

  async getFuturesPosition(productId: string): Promise<FuturesPositionResponse> {
    const url = `/cfm/positions/${productId}`;
    return await this.getRequest<FuturesPositionResponse>(url);
  }

  async scheduleFuturesSweep(params: ScheduleFuturesSweepParams): Promise<ScheduleFuturesSweepResponse> {
    const url = "/cfm/sweeps/schedule";
    return await this.postRequest<ScheduleFuturesSweepResponse>(url, params);
  }

  async listFuturesSweeps(): Promise<ScheduleFuturesSweepResponse[]> {
    const url = "/cfm/sweeps";
    return await this.getRequest<ScheduleFuturesSweepResponse[]>(url);
  }

  async cancelPendingFuturesSweep(): Promise<CancelFuturesSweepResponse> {
    const url = "/cfm/sweeps";
    return await this.deleteRequest<CancelFuturesSweepResponse>(url);
  }

  async getIntradayMarginSetting(): Promise<GetIntradayMarginSettingResponse> {
    const url = "/cfm/intraday/margin_setting";
    return await this.getRequest<GetIntradayMarginSettingResponse>(url);
  }

  async getCurrentMarginWindow(params: GetCurrentMarginWindowParams): Promise<GetCurrentMarginWindowResponse> {
    const url = "/cfm/intraday/current_margin_window";
    return await this.getRequest<GetCurrentMarginWindowResponse>(url, params);
  }

  async setIntradayMarginSetting(params: SetIntradayMarginSettingParams): Promise<SetIntradayMarginSettingResponse> {
    const url = "/cfm/intraday/margin_setting";
    return await this.postRequest<SetIntradayMarginSettingResponse>(url, params);
  }
}

export default FuturesClient;
