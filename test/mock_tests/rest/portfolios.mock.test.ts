import nock from 'nock';
import {
  ListPortfoliosResponse,
  GetPortfolioBreakdownResponse,
  GetCurrentMarginWindowResponse,
  CreatePortfolioResponse,
  MovePortfolioFundsResponse,
  EditPortfolioResponse,
  DeletePortfolioResponse,
  ClosePositionResponse,
  GetFuturesBalanceSummaryResponse,
  ListFuturesPositionsResponse,
  GetFuturesPositionResponse,
  ListFuturesSweepsResponse,
  GetIntradayMarginSettingResponse,
  SetIntradayMarginSettingResponse,
  ScheduleFuturesSweepResponse,
  CancelFuturesSweepResponse,
  GetPerpetualsPortfolioSummaryResponse,
  ListPerpetualsPositionsResponse,
  GetPerpetualsPositionResponse,
  GetPortfolioBalancesResponse,
  AllocatePortfolioResponse,
  OptInOutMultiAssetCollateralResponse,
  ListPortfoliosParams,
  GetPortfolioBreakdownParams,
  GetCurrentMarginWindowParams,
  CreatePortfolioParams,
  MovePortfolioFundsParams
} from '../../../src/rest/types/portfolios';
import PortfolioClient from '../../../src/rest/PortfolioClient';

const keyFile = process.env.KEY_FILENAME; //Example filepath in top level of Project Hierarchy: key/{insert_keyfile_name}.json

describe('PortfolioClient', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('should fetch portfolios with specified parameters', async () => {
    const client = new PortfolioClient(keyFile);

    const expectedResponse: ListPortfoliosResponse = {
      portfolios: [
        {
          name: 'portfolio1',
          uuid: 'uuid1',
          type: 'DEFAULT',
          deleted: false,
        },
        {
          name: 'portfolio2',
          uuid: 'uuid2',
          type: 'CONSUMER',
          deleted: false,
        }
      ]
    };

    const params: ListPortfoliosParams = {
      portfolio_type: 'DEFAULT'
    };

    nock('https://api.coinbase.com')
      .get('/api/v3/brokerage/portfolios')
      .query({
        portfolio_type: params.portfolio_type
      })
      .reply(200, expectedResponse);

    const portfolios = await client.listPortfolios(params);

    expect(portfolios).toEqual(expectedResponse);
  });

  it('should create a new portfolio', async () => {
    const client = new PortfolioClient(keyFile);

    const expectedResponse: CreatePortfolioResponse = {
      portfolio: {
        name: 'portfolio1',
        uuid: 'uuid1',
        type: 'DEFAULT',
        deleted: false,
      }
    };

    const params: CreatePortfolioParams = {
      name: 'portfolio1'
    };

    nock('https://api.coinbase.com')
      .post('/api/v3/brokerage/portfolios', body => body.name === params.name)
      .reply(200, expectedResponse);

    const portfolio = await client.createPortfolio(params);

    expect(portfolio).toEqual(expectedResponse);
  });

  it('should fetch portfolio breakdown by UUID', async () => {
    const client = new PortfolioClient(keyFile);

    const expectedResponse: GetPortfolioBreakdownResponse = {
      breakdown: {
        portfolio: {
          name: 'portfolio1',
          uuid: 'uuid1',
          type: 'DEFAULT',
          deleted: false,
        },
        portfolio_balances: {
          total_balance: { value: '1000', currency: 'USD' },
          total_futures_balance: { value: '500', currency: 'USD' },
          total_cash_equivalent_balance: { value: '300', currency: 'USD' },
          total_crypto_balance: { value: '200', currency: 'USD' },
          futures_unrealized_pnl: { value: '50', currency: 'USD' },
          perp_unrealized_pnl: { value: '20', currency: 'USD' }
        },
        spot_positions: [],
        perp_positions: [],
        futures_positions: []
      }
    };

    const portfolioUUID = 'uuid1';
    const params: GetPortfolioBreakdownParams = {
      currency: 'USD'
    };

    nock('https://api.coinbase.com')
      .get(`/api/v3/brokerage/portfolios/${portfolioUUID}`)
      .query({
        currency: params.currency
      })
      .reply(200, expectedResponse);

    const breakdown = await client.getPortfolioBreakdown(portfolioUUID, params);

    expect(breakdown).toEqual(expectedResponse);
  });

  it('should move funds between portfolios', async () => {
    const client = new PortfolioClient(keyFile);

    const expectedResponse: MovePortfolioFundsResponse = {
      source_portfolio_uuid: 'uuid1',
      target_portfolio_uuid: 'uuid2'
    };

    const params: MovePortfolioFundsParams = {
      funds: { value: '100', currency: 'USD' },
      source_portfolio_uuid: 'uuid1',
      target_portfolio_uuid: 'uuid2'
    };

    nock('https://api.coinbase.com')
      .post('/api/v3/brokerage/portfolios/move_funds', body => body.funds.value === params.funds.value && body.funds.currency === params.funds.currency)
      .reply(200, expectedResponse);

    const moveFundsResult = await client.movePortfolioFunds(params);

    expect(moveFundsResult).toEqual(expectedResponse);
  });

  it('should edit a portfolio', async () => {
    const client = new PortfolioClient(keyFile);

    const expectedResponse: EditPortfolioResponse = {
      portfolio: {
        name: 'portfolio1',
        uuid: 'uuid1',
        type: 'DEFAULT',
        deleted: false,
      }
    };

    const portfolioUUID = 'uuid1';
    const newName = 'newPortfolioName';

    nock('https://api.coinbase.com')
      .put(`/api/v3/brokerage/portfolios/${portfolioUUID}`, { name: newName })
      .reply(200, expectedResponse);

    const editResult = await client.editPortfolio(portfolioUUID, newName);

    expect(editResult).toEqual(expectedResponse);
  });

  it('should delete a portfolio', async () => {
    const client = new PortfolioClient(keyFile);

    const expectedResponse: DeletePortfolioResponse = {};

    const portfolioUUID = 'uuid1';

    nock('https://api.coinbase.com')
      .delete(`/api/v3/brokerage/portfolios/${portfolioUUID}`)
      .reply(200, expectedResponse);

    const deleteResult = await client.deletePortfolio(portfolioUUID);

    expect(deleteResult).toEqual(expectedResponse);
  });

  it('should close a position', async () => {
    const client = new PortfolioClient(keyFile);

    const expectedResponse: ClosePositionResponse = {
      success: true,
      success_response: {
        order_id: 'orderId123',
        product_id: 'productId123',
        side: 'BUY',
        client_order_id: 'clientOrderId123'
      },
      error_response: {
        error: '',
        message: '',
        error_details: '',
        preview_failure_reason: '',
        new_order_failure_reason: ''
      }
    };

    const portfolioUUID = 'uuid1';
    const positionID = 'position1';

    nock('https://api.coinbase.com')
      .post(`/api/v3/brokerage/portfolios/${portfolioUUID}/positions/${positionID}/close`, {})
      .reply(200, expectedResponse);

    const closePositionResult = await client.closePosition(portfolioUUID, positionID);

    expect(closePositionResult).toEqual(expectedResponse);
  });

  it('should fetch futures balance summary', async () => {
    const client = new PortfolioClient(keyFile);

    const expectedResponse: GetFuturesBalanceSummaryResponse = {
      balance_summary: {
        futures_buying_power: { value: '1000', currency: 'USD' },
        total_usd_balance: { value: '1000', currency: 'USD' },
        cbi_usd_balance: { value: '500', currency: 'USD' },
        cfm_usd_balance: { value: '300', currency: 'USD' },
        total_open_orders_hold_amount: { value: '200', currency: 'USD' },
        unrealized_pnl: { value: '50', currency: 'USD' },
        daily_realized_pnl: { value: '10', currency: 'USD' },
        initial_margin: { value: '100', currency: 'USD' },
        available_margin: { value: '200', currency: 'USD' },
        liquidation_threshold: { value: '50', currency: 'USD' },
        liquidation_buffer_amount: { value: '20', currency: 'USD' },
        liquidation_buffer_percentage: '0.02',
        intraday_margin_window_measure: {
          margin_window_type: 'INTRADAY',
          margin_level: 'BASE',
          initial_margin: '100',
          maintenance_margin: '50',
          liquidation_buffer: '20',
          total_hold: '30',
          futures_buying_power: '1000'
        },
        overnight_margin_window_measure: {
          margin_window_type: 'OVERNIGHT',
          margin_level: 'BASE',
          initial_margin: '200',
          maintenance_margin: '100',
          liquidation_buffer: '40',
          total_hold: '60',
          futures_buying_power: '2000'
        }
      }
    };

    nock('https://api.coinbase.com')
      .get('/api/v3/brokerage/cfm/balance_summary')
      .reply(200, expectedResponse);

    const balanceSummary = await client.getFuturesBalanceSummary();

    expect(balanceSummary).toEqual(expectedResponse);
  });

  it('should fetch futures positions', async () => {
    const client = new PortfolioClient(keyFile);

    const expectedResponse: ListFuturesPositionsResponse = {
      positions: [
        {
          product_id: 'product1',
          expiration_time: '2022-12-31T00:00:00Z',
          side: 'LONG',
          number_of_contracts: '10',
          current_price: '100',
          avg_entry_price: '90',
          unrealized_pnl: '100',
          daily_realized_pnl: '10'
        },
        {
          product_id: 'product2',
          expiration_time: '2022-12-31T00:00:00Z',
          side: 'SHORT',
          number_of_contracts: '5',
          current_price: '200',
          avg_entry_price: '180',
          unrealized_pnl: '200',
          daily_realized_pnl: '20'
        }
      ]
    };

    nock('https://api.coinbase.com')
      .get('/api/v3/brokerage/cfm/positions')
      .reply(200, expectedResponse);

    const positions = await client.listFuturesPositions();

    expect(positions).toEqual(expectedResponse);
  });

  it('should fetch a specific futures position', async () => {
    const client = new PortfolioClient(keyFile);

    const expectedResponse: GetFuturesPositionResponse = {
      position: {
        product_id: 'product1',
        expiration_time: '2022-12-31T00:00:00Z',
        side: 'LONG',
        number_of_contracts: '10',
        current_price: '100',
        avg_entry_price: '90',
        unrealized_pnl: '100',
        daily_realized_pnl: '10'
      }
    };

    const productID = 'product1';

    nock('https://api.coinbase.com')
      .get(`/api/v3/brokerage/cfm/positions/${productID}`)
      .reply(200, expectedResponse);

    const position = await client.getFuturesPosition(productID);

    expect(position).toEqual(expectedResponse);
  });

  it('should fetch futures sweeps', async () => {
    const client = new PortfolioClient(keyFile);

    const expectedResponse: ListFuturesSweepsResponse = {
      sweeps: [
        {
          id: 'sweep1',
          requested_amount: { value: '100', currency: 'USD' },
          should_sweep_all: true,
          status: 'PENDING',
          scheduled_time: '2022-12-31T00:00:00Z'
        }
      ]
    };

    nock('https://api.coinbase.com')
      .get('/api/v3/brokerage/cfm/sweeps')
      .reply(200, expectedResponse);

    const sweeps = await client.listFuturesSweeps();

    expect(sweeps).toEqual(expectedResponse);
  });

  it('should fetch intraday margin setting', async () => {
    const client = new PortfolioClient(keyFile);

    const expectedResponse: GetIntradayMarginSettingResponse = {
      intraday_margin_setting: 'STANDARD'
    };

    nock('https://api.coinbase.com')
      .get('/api/v3/brokerage/cfm/intraday/margin_setting')
      .reply(200, expectedResponse);

    const marginSetting = await client.getIntradayMarginSetting();

    expect(marginSetting).toEqual(expectedResponse);
  });

  it('should set intraday margin setting', async () => {
    const client = new PortfolioClient(keyFile);

    const params = { intraday_margin_setting: 'INTRADAY' };

    const expectedResponse: SetIntradayMarginSettingResponse = {};

    nock('https://api.coinbase.com')
      .post('/api/v3/brokerage/cfm/intraday/margin_setting', params)
      .reply(200, expectedResponse);

    const result = await client.setIntradayMarginSetting(params);

    expect(result).toEqual(expectedResponse);
  });

  it('should fetch current margin window with specified parameters', async () => {
    const client = new PortfolioClient(keyFile);

    const expectedResponse: GetCurrentMarginWindowResponse = {
      margin_window: {
        margin_window_type: 'INTRADAY',
        end_time: '2022-01-01T00:00:00Z',
        is_intraday_margin_killswitch_enabled: true,
        is_intraday_margin_enrollment_killswitch_enabled: false
      }
    };

    const params: GetCurrentMarginWindowParams = {
      margin_profile_type: 'RETAIL_INTRADAY_MARGIN_1'
    };

    nock('https://api.coinbase.com')
      .get('/api/v3/brokerage/cfm/intraday/current_margin_window')
      .query({
        margin_profile_type: params.margin_profile_type
      })
      .reply(200, expectedResponse);

    const marginWindow = await client.getCurrentMarginWindow(params);

    expect(marginWindow).toEqual(expectedResponse);
  });

  it('should schedule a futures sweep', async () => {
    const client = new PortfolioClient(keyFile);

    const params = {
      requested_amount: { value: '100', currency: 'USD' },
      should_sweep_all: true
    };

    const expectedResponse: ScheduleFuturesSweepResponse = {
      success: true
    };

    nock('https://api.coinbase.com')
      .post('/api/v3/brokerage/cfm/sweeps', params)
      .reply(200, expectedResponse);

    const result = await client.scheduleFuturesSweep(params);

    expect(result).toEqual(expectedResponse);
  });

  it('should cancel a pending futures sweep', async () => {
    const client = new PortfolioClient(keyFile);

    const sweepID = 'sweep1';

    const expectedResponse: CancelFuturesSweepResponse = {
      success: true
    };

    nock('https://api.coinbase.com')
      .delete(`/api/v3/brokerage/cfm/sweeps/${sweepID}`)
      .reply(200, expectedResponse);

    const result = await client.cancelPendingFuturesSweep(sweepID);

    expect(result).toEqual(expectedResponse);
  });

  it('should fetch perpetuals portfolio summary', async () => {
    const client = new PortfolioClient(keyFile);

    const expectedResponse: GetPerpetualsPortfolioSummaryResponse = {
      portfolios: [
        {
          portfolio_uuid: 'uuid1',
          collateral: '100',
          position_notional: '200',
          open_position_notional: '300',
          pending_fees: '10',
          borrow: '50',
          accrued_interest: '5',
          rolling_debt: '15',
          portfolio_initial_margin: '20',
          portfolio_im_notional: { value: '100', currency: 'USD' },
          portfolio_maintenance_margin: '25',
          portfolio_mm_notional: { value: '200', currency: 'USD' },
          liquidation_percentage: '0.1',
          liquidation_buffer: '30',
          margin_type: 'MARGIN_TYPE_CROSS',
          margin_flags: 'PORTFOLIO_MARGIN_FLAGS_IN_LIQUIDATION',
          liquidation_status: 'PORTFOLIO_LIQUIDATION_STATUS_MANUAL',
          unrealized_pnl: { value: '50', currency: 'USD' },
          total_balance: { value: '500', currency: 'USD' },
          summary: {
            unrealized_pnl: { value: '50', currency: 'USD' },
            buying_power: { value: '200', currency: 'USD' },
            total_balance: { value: '500', currency: 'USD' },
            max_withdrawal_amount: { value: '100', currency: 'USD' }
          }
        }
      ]
    };

    const portfolioUUID = 'uuid1';

    nock('https://api.coinbase.com')
      .get(`/api/v3/brokerage/intx/portfolio/${portfolioUUID}`)
      .reply(200, expectedResponse);

    const summary = await client.getPerpetualsPortfolioSummary(portfolioUUID);

    expect(summary).toEqual(expectedResponse);
  });

  it('should fetch perpetuals positions', async () => {
    const client = new PortfolioClient(keyFile);

    const expectedResponse: ListPerpetualsPositionsResponse = {
      positions: [
        {
          product_id: 'product1',
          product_uuid: 'uuid1',
          portfolio_uuid: 'portfolio1',
          symbol: 'BTCUSD',
          vwap: { value: '1000', currency: 'USD' },
          entry_vwap: { value: '950', currency: 'USD' },
          position_side: 'POSITION_SIDE_LONG',
          margin_type: 'MARGIN_TYPE_CROSS',
          net_size: '10',
          buy_order_size: '5',
          sell_order_size: '5',
          im_contribution: '100',
          unrealized_pnl: { value: '50', currency: 'USD' },
          mark_price: { value: '1000', currency: 'USD' },
          liquidation_price: { value: '900', currency: 'USD' },
          leverage: '10',
          im_notional: { value: '1000', currency: 'USD' },
          mm_notional: { value: '500', currency: 'USD' },
          position_notional: '10000',
          aggregated_pnl: { value: '50', currency: 'USD' },
          summary: {
            aggregated_pnl: { value: '50', currency: 'USD' }
          }
        }
      ]
    };

    const portfolioUUID = 'portfolio1';

    nock('https://api.coinbase.com')
      .get(`/api/v3/brokerage/intx/positions/${portfolioUUID}`)
      .reply(200, expectedResponse);

    const positions = await client.listPerpetualsPositions(portfolioUUID);

    expect(positions).toEqual(expectedResponse);
  });

  it('should fetch a specific perpetuals position', async () => {
    const client = new PortfolioClient(keyFile);

    const expectedResponse: GetPerpetualsPositionResponse = {
      position: {
        product_id: 'product1',
        product_uuid: 'uuid1',
        portfolio_uuid: 'portfolio1',
        symbol: 'BTCUSD',
        vwap: { value: '1000', currency: 'USD' },
        entry_vwap: { value: '950', currency: 'USD' },
        position_side: 'POSITION_SIDE_LONG',
        margin_type: 'MARGIN_TYPE_CROSS',
        net_size: '10',
        buy_order_size: '5',
        sell_order_size: '5',
        im_contribution: '100',
        unrealized_pnl: { value: '50', currency: 'USD' },
        mark_price: { value: '1000', currency: 'USD' },
        liquidation_price: { value: '900', currency: 'USD' },
        leverage: '10',
        im_notional: { value: '1000', currency: 'USD' },
        mm_notional: { value: '500', currency: 'USD' },
        position_notional: '10000',
        aggregated_pnl: { value: '50', currency: 'USD' },
      }
    };

    const portfolioUUID = 'portfolio1';
    const symbol = 'BTCUSD';

    nock('https://api.coinbase.com')
      .get(`/api/v3/brokerage/intx/positions/${portfolioUUID}/${symbol}`)
      .reply(200, expectedResponse);

    const position = await client.getPerpetualsPosition(portfolioUUID, symbol);

    expect(position).toEqual(expectedResponse);
  });

  it('should fetch portfolio balances', async () => {
    const client = new PortfolioClient(keyFile);

    const expectedResponse: GetPortfolioBalancesResponse = {
      portfolio_balances: [
        {
          portfolio_uuid: 'uuid1',
          balances: [
            {
              asset: {
                asset_id: 'asset1',
                asset_uuid: 'uuid1',
                asset_name: 'BTC',
                status: 'AVAILABLE',
                collateral_weight: '0.5',
                account_collateral_limit: '1000',
                ecosystem_collateral_limit_breached: false,
                asset_icon_url: 'https://example.com/btc.png',
                supported_networks_enabled: true,
                quantity: '1',
                hold: '0.1',
                transfer_hold: '0.05',
                collateral_value: '50000',
                max_withdraw_amount: '0.9',
                loan: '0.2',
                loan_collateral_requirement_usd: '10000',
                pledged_quantity: '0.1',
                is_margin_limit_reached: false
              },
              portfolio_uuid: 'uuid1'
            }
          ]
        }
      ]
    };

    const portfolioUUID = 'uuid1';

    nock('https://api.coinbase.com')
      .get(`/api/v3/brokerage/intx/balances/${portfolioUUID}`)
      .reply(200, expectedResponse);

    const balances = await client.getPortfolioBalances(portfolioUUID);

    expect(balances).toEqual(expectedResponse);
  });

  it('should allocate portfolio funds', async () => {
    const client = new PortfolioClient(keyFile);

    const expectedResponse: AllocatePortfolioResponse = {};

    const portfolioUUID = 'uuid1';
    const params = { /* Allocation params */ };

    nock('https://api.coinbase.com')
      .post(`/api/v3/brokerage/portfolios/${portfolioUUID}/allocate`, params)
      .reply(200, expectedResponse);

    const result = await client.allocatePortfolio(portfolioUUID, params);

    expect(result).toEqual(expectedResponse);
  });

  it('should opt in or out of multi asset collateral', async () => {
    const client = new PortfolioClient(keyFile);

    const expectedResponse: OptInOutMultiAssetCollateralResponse = {
      multi_asset_collateral_enabled: true
    };

    const params = { /* Opt in/out params */ };

    nock('https://api.coinbase.com')
      .post('/api/v3/brokerage/portfolios/multi_asset_collateral', params)
      .reply(200, expectedResponse);

    const result = await client.optInOutMultiAssetCollateral(params);

    expect(result).toEqual(expectedResponse);
  });
});
