import nock from 'nock';
import ConvertsClient from '../../../src/rest/ConvertsClient';
import { API_PREFIX } from '../../../src/config/constants';
import {
  CreateConvertQuoteRequest,
  CreateConvertQuoteResponse,
  CommitConvertTradeRequest,
  CommitConvertTradeResponse,
  GetConvertTradeParams,
  GetConvertTradeResponse,
} from '../../../src/rest/types/converts';

const keyFile = process.env.KEY_FILENAME; //Example filepath in top level of Project Hierarchy: key/{insert_keyfile_name}.json

describe('ConvertsClient', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('should create a convert quote', async () => {
    const client = new ConvertsClient(keyFile);

    const expectedResponse: CreateConvertQuoteResponse = {
      trade: {
        id: '1234',
        status: 'TRADE_STATUS_CREATED',
        user_entered_amount: {
          value: '100',
          currency: 'USD',
        },
        amount: {
          value: '100',
          currency: 'USD',
        },
        subtotal: {
          value: '100',
          currency: 'USD',
        },
        total: {
          value: '100',
          currency: 'USD',
        },
        fees: [],
        total_fee: {
          title: 'Total Fee',
          description: 'Total fee for the trade',
          amount: {
            value: '0',
            currency: 'USD',
          },
          label: 'Fee',
          disclosure: {
            title: 'Disclosure',
            description: 'Fee disclosure',
            link: {
              text: 'Link Text',
              url: 'https://example.com',
            },
          },
        },
        source: {
          type: 'LEDGER_NAMED_ACCOUNT',
          network: 'network',
          ledger_account: {
            account_id: 'from_account',
            currency: 'USD',
            owner: {
              id: 'owner_id',
              uuid: 'owner_uuid',
              user_uuid: 'user_uuid',
              type: 'RETAIL',
            },
          },
        },
        target: {
          type: 'LEDGER_NAMED_ACCOUNT',
          network: 'network',
          ledger_account: {
            account_id: 'to_account',
            currency: 'USD',
            owner: {
              id: 'owner_id',
              uuid: 'owner_uuid',
              user_uuid: 'user_uuid',
              type: 'RETAIL',
            },
          },
        },
        unit_price: {
          target_to_fiat: {
            amount: {
              value: '1',
              currency: 'USD',
            },
            scale: 2,
          },
          target_to_source: {
            amount: {
              value: '1',
              currency: 'USD',
            },
            scale: 2,
          },
          source_to_fiat: {
            amount: {
              value: '1',
              currency: 'USD',
            },
            scale: 2,
          },
        },
        user_warnings: [],
        source_currency: 'USD',
        target_currency: 'USD',
        source_id: 'source_id',
        target_id: 'target_id',
        exchange_rate: {
          value: '1',
          currency: 'USD',
        },
        tax_details: [],
      },
    };

    const requestBody: CreateConvertQuoteRequest = {
      from_account: 'from_account',
      to_account: 'to_account',
      amount: '100',
      trade_incentive_metadata: {
        user_incentive_id: '1234',
        code_val: 'test_val',
      },
    };

    nock('https://api.coinbase.com')
      .post(`${API_PREFIX}/convert/quote`, requestBody as any)
      .reply(200, expectedResponse);

    const quote = await client.createConvertQuote(
      'from_account',
      'to_account',
      '100',
      '1234',
      'test_val'
    );

    expect(quote).toEqual(expectedResponse);
  });

  it('should get a convert trade', async () => {
    const client = new ConvertsClient(keyFile);

    const expectedResponse: GetConvertTradeResponse = {
      trade: {
        id: '1234',
        status: 'TRADE_STATUS_CREATED',
        user_entered_amount: {
          value: '100',
          currency: 'USD',
        },
        amount: {
          value: '100',
          currency: 'USD',
        },
        subtotal: {
          value: '100',
          currency: 'USD',
        },
        total: {
          value: '100',
          currency: 'USD',
        },
        fees: [],
        total_fee: {
          title: 'Total Fee',
          description: 'Total fee for the trade',
          amount: {
            value: '0',
            currency: 'USD',
          },
          label: 'Fee',
          disclosure: {
            title: 'Disclosure',
            description: 'Fee disclosure',
            link: {
              text: 'Link Text',
              url: 'https://example.com',
            },
          },
        },
        source: {
          type: 'LEDGER_NAMED_ACCOUNT',
          network: 'network',
          ledger_account: {
            account_id: 'from_account',
            currency: 'USD',
            owner: {
              id: 'owner_id',
              uuid: 'owner_uuid',
              user_uuid: 'user_uuid',
              type: 'RETAIL',
            },
          },
        },
        target: {
          type: 'LEDGER_NAMED_ACCOUNT',
          network: 'network',
          ledger_account: {
            account_id: 'to_account',
            currency: 'USD',
            owner: {
              id: 'owner_id',
              uuid: 'owner_uuid',
              user_uuid: 'user_uuid',
              type: 'RETAIL',
            },
          },
        },
        unit_price: {
          target_to_fiat: {
            amount: {
              value: '1',
              currency: 'USD',
            },
            scale: 2,
          },
          target_to_source: {
            amount: {
              value: '1',
              currency: 'USD',
            },
            scale: 2,
          },
          source_to_fiat: {
            amount: {
              value: '1',
              currency: 'USD',
            },
            scale: 2,
          },
        },
        user_warnings: [],
        source_currency: 'USD',
        target_currency: 'USD',
        source_id: 'source_id',
        target_id: 'target_id',
        exchange_rate: {
          value: '1',
          currency: 'USD',
        },
        tax_details: [],
      },
    };

    const params: GetConvertTradeParams = {
      from_account: 'from_account',
      to_account: 'to_account',
    };

    nock('https://api.coinbase.com')
      .get(`${API_PREFIX}/convert/trade/1234`)
      .query(params as any)
      .reply(200, expectedResponse);

    const trade = await client.getConvertTrade('1234', 'from_account', 'to_account');

    expect(trade).toEqual(expectedResponse);
  });

  it('should commit a convert trade', async () => {
    const client = new ConvertsClient(keyFile);

    const expectedResponse: CommitConvertTradeResponse = {
      trade: {
        id: '1234',
        status: 'TRADE_STATUS_CREATED',
        user_entered_amount: {
          value: '100',
          currency: 'USD',
        },
        amount: {
          value: '100',
          currency: 'USD',
        },
        subtotal: {
          value: '100',
          currency: 'USD',
        },
        total: {
          value: '100',
          currency: 'USD',
        },
        fees: [],
        total_fee: {
          title: 'Total Fee',
          description: 'Total fee for the trade',
          amount: {
            value: '0',
            currency: 'USD',
          },
          label: 'Fee',
          disclosure: {
            title: 'Disclosure',
            description: 'Fee disclosure',
            link: {
              text: 'Link Text',
              url: 'https://example.com',
            },
          },
        },
        source: {
          type: 'LEDGER_NAMED_ACCOUNT',
          network: 'network',
          ledger_account: {
            account_id: 'from_account',
            currency: 'USD',
            owner: {
              id: 'owner_id',
              uuid: 'owner_uuid',
              user_uuid: 'user_uuid',
              type: 'RETAIL',
            },
          },
        },
        target: {
          type: 'LEDGER_NAMED_ACCOUNT',
          network: 'network',
          ledger_account: {
            account_id: 'to_account',
            currency: 'USD',
            owner: {
              id: 'owner_id',
              uuid: 'owner_uuid',
              user_uuid: 'user_uuid',
              type: 'RETAIL',
            },
          },
        },
        unit_price: {
          target_to_fiat: {
            amount: {
              value: '1',
              currency: 'USD',
            },
            scale: 2,
          },
          target_to_source: {
            amount: {
              value: '1',
              currency: 'USD',
            },
            scale: 2,
          },
          source_to_fiat: {
            amount: {
              value: '1',
              currency: 'USD',
            },
            scale: 2,
          },
        },
        user_warnings: [],
        source_currency: 'USD',
        target_currency: 'USD',
        source_id: 'source_id',
        target_id: 'target_id',
        exchange_rate: {
          value: '1',
          currency: 'USD',
        },
        tax_details: [],
      },
    };

    const requestBody: CommitConvertTradeRequest = {
      from_account: 'from_account',
      to_account: 'to_account',
    };

    nock('https://api.coinbase.com')
      .post(`${API_PREFIX}/convert/trade/1234`, requestBody as any)
      .reply(200, expectedResponse);

    const trade = await client.commitConvertTrade('1234', 'from_account', 'to_account');

    expect(trade).toEqual(expectedResponse);
  });
});
