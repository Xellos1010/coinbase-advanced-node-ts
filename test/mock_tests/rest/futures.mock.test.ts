import nock from 'nock';
import FuturesClient from '../../../src/rest/FuturesClient';
import {
  ClosePositionParams,
  FuturesBalanceSummaryResponse,
  ListFuturesPositionsResponse,
  FuturesPositionResponse,
  ScheduleFuturesSweepParams,
  ScheduleFuturesSweepResponse,
  CancelFuturesSweepResponse,
  GetIntradayMarginSettingResponse,
  GetCurrentMarginWindowResponse,
  SetIntradayMarginSettingParams,
  SetIntradayMarginSettingResponse,
} from '../../../src/rest/types/futures';

const keyFile = process.env.KEY_FILENAME; //Example filepath in top level of Project Hierarchy: key/{insert_keyfile_name}.json

describe('FuturesClient', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('should close position', async () => {
    const client = new FuturesClient(keyFile);
    const expectedResponse: FuturesPositionResponse = {
      success: true,
      success_response: {
        order_id: "order_id_1",
        product_id: "product_id_1",
        side: "SELL",
        client_order_id: "client_order_id_1",
      }
    };

    nock('https://api.coinbase.com')
      .post('/api/v3/brokerage/orders/close_position')
      .reply(200, expectedResponse);

    const params: ClosePositionParams = {
      client_order_id: "client_order_id_1",
      product_id: "product_id_1",
      size: "100",
    };
    const closedOrder = await client.closePosition(params);

    expect(closedOrder).toEqual(expectedResponse);
  });

  it('should get futures balance summary', async () => {
    const client = new FuturesClient(keyFile);
    const expectedResponse: FuturesBalanceSummaryResponse = {
      balance_summary: {
        futures_buying_power: { value: "1000", currency: "USD" },
        total_usd_balance: { value: "2000", currency: "USD" },
        cbi_usd_balance: { value: "1500", currency: "USD" },
        cfm_usd_balance: { value: "500", currency: "USD" },
        total_open_orders_hold_amount: { value: "300", currency: "USD" },
        unrealized_pnl: { value: "50", currency: "USD" },
        daily_realized_pnl: { value: "20", currency: "USD" },
        initial_margin: { value: "200", currency: "USD" },
        available_margin: { value: "1800", currency: "USD" },
        liquidation_threshold: { value: "100", currency: "USD" },
        liquidation_buffer_amount: { value: "1700", currency: "USD" },
        liquidation_buffer_percentage: "85",
        intraday_margin_window_measure: {
          margin_window_type: "INTRADAY",
          margin_level: "BASE",
          initial_margin: "200",
          maintenance_margin: "150",
          liquidation_buffer: "100",
          total_hold: "250",
          futures_buying_power: "1200",
        },
        overnight_margin_window_measure: {
          margin_window_type: "OVERNIGHT",
          margin_level: "BASE",
          initial_margin: "200",
          maintenance_margin: "150",
          liquidation_buffer: "100",
          total_hold: "250",
          futures_buying_power: "1200",
        },
      }
    };

    nock('https://api.coinbase.com')
      .get('/api/v3/brokerage/cfm/balance_summary')
      .reply(200, expectedResponse);

    const balanceSummary = await client.getFuturesBalanceSummary();

    expect(balanceSummary).toEqual(expectedResponse);
  });

  it('should list futures positions', async () => {
    const client = new FuturesClient(keyFile);
    const expectedResponse: ListFuturesPositionsResponse = {
      positions: [
        {
          product_id: "product_id_1",
          expiration_time: "2024-12-31T00:00:00Z",
          side: "LONG",
          number_of_contracts: "5",
          current_price: "10000",
          avg_entry_price: "9500",
          unrealized_pnl: "2500",
          daily_realized_pnl: "500",
        },
      ]
    };

    nock('https://api.coinbase.com')
      .get('/api/v3/brokerage/cfm/positions')
      .reply(200, expectedResponse);

    const positions = await client.listFuturesPositions();

    expect(positions).toEqual(expectedResponse);
  });

  it('should get futures position', async () => {
    const client = new FuturesClient(keyFile);
    const expectedResponse: FuturesPositionResponse = {
      success: true,
      success_response: {
        order_id: "order_id_1",
        product_id: "product_id_1",
        side: "SELL",
        client_order_id: "client_order_id_1",
      }
    };

    nock('https://api.coinbase.com')
      .get('/api/v3/brokerage/cfm/positions/PRODUCT_ID_1')
      .reply(200, expectedResponse);

    const position = await client.getFuturesPosition("PRODUCT_ID_1");

    expect(position).toEqual(expectedResponse);
  });

  it('should schedule futures sweep', async () => {
    const client = new FuturesClient(keyFile);
    const expectedResponse: ScheduleFuturesSweepResponse = { success: true };

    nock('https://api.coinbase.com')
      .post('/api/v3/brokerage/cfm/sweeps/schedule')
      .reply(200, expectedResponse);

    const params: ScheduleFuturesSweepParams = { usd_amount: "5" };
    const response = await client.scheduleFuturesSweep(params);

    expect(response).toEqual(expectedResponse);
  });

  it('should list futures sweeps', async () => {
    const client = new FuturesClient(keyFile);
    const expectedResponse: ScheduleFuturesSweepResponse[] = [
      { success: true },
      { success: false },
    ];

    nock('https://api.coinbase.com')
      .get('/api/v3/brokerage/cfm/sweeps')
      .reply(200, expectedResponse);

    const sweeps = await client.listFuturesSweeps();

    expect(sweeps).toEqual(expectedResponse);
  });

  it('should cancel pending futures sweep', async () => {
    const client = new FuturesClient(keyFile);
    const expectedResponse: CancelFuturesSweepResponse = { success: true };

    nock('https://api.coinbase.com')
      .delete('/api/v3/brokerage/cfm/sweeps')
      .reply(200, expectedResponse);

    const response = await client.cancelPendingFuturesSweep();

    expect(response).toEqual(expectedResponse);
  });

  it('should get intraday margin setting', async () => {
    const client = new FuturesClient(keyFile);
    const expectedResponse: GetIntradayMarginSettingResponse = { intraday_margin_setting: "INTRADAY" };

    nock('https://api.coinbase.com')
      .get('/api/v3/brokerage/cfm/intraday/margin_setting')
      .reply(200, expectedResponse);

    const intradayMarginSetting = await client.getIntradayMarginSetting();

    expect(intradayMarginSetting).toEqual(expectedResponse);
  });

  it('should get current margin window', async () => {
    const client = new FuturesClient(keyFile);
    const expectedResponse: GetCurrentMarginWindowResponse = {
      margin_window: {
        margin_window_type: "INTRADAY",
        end_time: "2024-12-31T00:00:00Z",
        is_intraday_margin_killswitch_enabled: true,
        is_intraday_margin_enrollment_killswitch_enabled: false,
      }
    };

    nock('https://api.coinbase.com')
      .get('/api/v3/brokerage/cfm/intraday/current_margin_window')
      .query({ margin_profile_type: "MARGIN_PROFILE_TYPE_1" })
      .reply(200, expectedResponse);

    const params = { margin_profile_type: "MARGIN_PROFILE_TYPE_1" };
    const marginWindow = await client.getCurrentMarginWindow(params);

    expect(marginWindow).toEqual(expectedResponse);
  });

  it('should set intraday margin setting', async () => {
    const client = new FuturesClient(keyFile);
    const expectedResponse: SetIntradayMarginSettingResponse = { success: true };

    nock('https://api.coinbase.com')
      .post('/api/v3/brokerage/cfm/intraday/margin_setting')
      .reply(200, expectedResponse);

    const params: SetIntradayMarginSettingParams = { setting: "INTRADAY" };
    const setting = await client.setIntradayMarginSetting(params);

    expect(setting).toEqual(expectedResponse);
  });
});
