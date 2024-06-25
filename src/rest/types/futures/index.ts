export interface ClosePositionParams {
    client_order_id: string;
    product_id: string;
    size?: string;
  }
  
  export interface FuturesPositionResponse {
    success: boolean;
    success_response?: {
      order_id: string;
      product_id: string;
      side: string;
      client_order_id: string;
    };
    error_response?: {
      error: string;
      message: string;
      error_details: string;
      preview_failure_reason: string;
      new_order_failure_reason: string;
      order_configuration?: any;  // Add specific order configuration if needed
    };
  }
  
  export interface FuturesBalanceSummaryResponse {
    balance_summary: {
      futures_buying_power: {
        value: string;
        currency: string;
      };
      total_usd_balance: {
        value: string;
        currency: string;
      };
      cbi_usd_balance: {
        value: string;
        currency: string;
      };
      cfm_usd_balance: {
        value: string;
        currency: string;
      };
      total_open_orders_hold_amount: {
        value: string;
        currency: string;
      };
      unrealized_pnl: {
        value: string;
        currency: string;
      };
      daily_realized_pnl: {
        value: string;
        currency: string;
      };
      initial_margin: {
        value: string;
        currency: string;
      };
      available_margin: {
        value: string;
        currency: string;
      };
      liquidation_threshold: {
        value: string;
        currency: string;
      };
      liquidation_buffer_amount: {
        value: string;
        currency: string;
      };
      liquidation_buffer_percentage: string;
      intraday_margin_window_measure: {
        margin_window_type: string;
        margin_level: string;
        initial_margin: string;
        maintenance_margin: string;
        liquidation_buffer: string;
        total_hold: string;
        futures_buying_power: string;
      };
      overnight_margin_window_measure: {
        margin_window_type: string;
        margin_level: string;
        initial_margin: string;
        maintenance_margin: string;
        liquidation_buffer: string;
        total_hold: string;
        futures_buying_power: string;
      };
    };
  }
  
  export interface ListFuturesPositionsResponse {
    positions: Array<{
      product_id: string;
      expiration_time: string;
      side: string;
      number_of_contracts: string;
      current_price: string;
      avg_entry_price: string;
      unrealized_pnl: string;
      daily_realized_pnl: string;
    }>;
  }
  
  export interface ScheduleFuturesSweepParams {
    usd_amount: string;
  }
  
  export interface ScheduleFuturesSweepResponse {
    success: boolean;
  }
  
  export interface CancelFuturesSweepResponse {
    success: boolean;
  }
  
  export interface GetIntradayMarginSettingResponse {
    intraday_margin_setting: string;
  }
  
  export interface GetCurrentMarginWindowParams {
    margin_profile_type: string;
  }
  
  export interface GetCurrentMarginWindowResponse {
    margin_window: {
      margin_window_type: string;
      end_time: string;
      is_intraday_margin_killswitch_enabled: boolean;
      is_intraday_margin_enrollment_killswitch_enabled: boolean;
    };
  }
  
  export interface SetIntradayMarginSettingParams {
    setting: string;
  }
  
  export interface SetIntradayMarginSettingResponse {
    success: boolean;
  }
  