import nock from 'nock';
import FeesClient from '../../../src/rest/FeesClient';
import { TransactionsSummaryResponse } from '../../../src/rest/types/fees/TransactionsSummaryResponse';

const keyFile = process.env.KEY_FILENAME;
// Constants for testing

describe('FeesClient', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('should get transaction summary', async () => {
    const client = new FeesClient(keyFile);

    const expectedResponse: TransactionsSummaryResponse = {
      total_volume: 1000,
      total_fees: 50,
      fee_tier: {
        pricing_tier: 'tier1',
        usd_from: '1000',
        usd_to: '5000',
        taker_fee_rate: '0.0025',
        maker_fee_rate: '0.0010',
        aop_from: '1000',
        aop_to: '5000',
        margin_rate: {
          value: '0.0001',
        },
      },
      goods_and_services_tax: {
        rate: '0.1',
        type: 'INCLUSIVE',
      },
      advanced_trade_only_volume: 500,
      advanced_trade_only_fees: 25,
      coinbase_pro_volume: 500,
      coinbase_pro_fees: 25,
    };

    nock('https://api.coinbase.com')
      .get('/api/v3/brokerage/transaction_summary')
      .query({
        product_type: 'product_type',
        contract_expiry_type: 'contract_expiry_type',
      })
      .reply(200, expectedResponse);

    const summary = await client.getTransactionsSummary({
      product_type: 'product_type',
      contract_expiry_type: 'contract_expiry_type',
    });

    expect(summary).toEqual(expectedResponse);
  });
});
