import nock from 'nock';
import { ListPortfoliosResponse } from '../../../src/rest/types/portfolios/ListPortfoliosResponse';
import { GetPortfolioBreakdownResponse } from '../../../src/rest/types/portfolios/GetPortfolioBreakdownResponse';
import { GetCurrentMarginWindowResponse } from '../../../src/rest/types/portfolios/GetCurrentMarginWindowResponse';
import { ListPortfoliosParams } from '../../../src/rest/types/portfolios/ListPortfoliosParams';
import { GetPortfolioBreakdownParams } from '../../../src/rest/types/portfolios/GetPortfolioBreakdownParams';
import { GetCurrentMarginWindowParams } from '../../../src/rest/types/portfolios/GetCurrentMarginWindowParams';
import PortfolioClient from '../../../src/rest/PortfolioClient';

const keyFile = process.env.KEY_FILENAME;

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
});
