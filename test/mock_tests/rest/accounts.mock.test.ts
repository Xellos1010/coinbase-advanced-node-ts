import nock from 'nock';
import { GetAccountResponse } from '../../../src/rest/types/accounts/GetAccountResponse';
import { ListAccountsParams } from '../../../src/rest/types/accounts/ListAccountsParams';
import { ListAccountsResponse } from '../../../src/rest/types/accounts/ListAccountsResponse';
import AccountsClient from '../../../src/rest/AccountsClient';

const keyFile = process.env.KEY_FILENAME;

describe('AccountsClient', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('should fetch accounts with specified parameters', async () => {
    const client = new AccountsClient(keyFile);

    const expectedResponse: ListAccountsResponse = {
      accounts: [
        {
          uuid: 'account1',
          name: 'account1',
          currency: 'USD',
          available_balance: { value: '100.00', currency: 'USD' },
          default: true,
          active: true,
          created_at: '2022-01-01T00:00:00Z',
          updated_at: '2022-01-01T00:00:00Z',
          type: 'ACCOUNT_TYPE_FIAT',
          ready: true,
          hold: { value: '0.00', currency: 'USD' },
          retail_portfolio_id: 'portfolio1'
        },
        {
          uuid: 'account2',
          name: 'account2',
          currency: 'USD',
          available_balance: { value: '200.00', currency: 'USD' },
          default: false,
          active: true,
          created_at: '2022-01-01T00:00:00Z',
          updated_at: '2022-01-01T00:00:00Z',
          type: 'ACCOUNT_TYPE_FIAT',
          ready: true,
          hold: { value: '0.00', currency: 'USD' },
          retail_portfolio_id: 'portfolio2'
        }
      ],
      has_next: false,
      cursor: '',
      size: 2
    };

    const params: ListAccountsParams = {
      limit: 2,
      cursor: 'abcd',
      retailPortfolioId: 'portfolio1'
    };

    nock('https://api.coinbase.com')
      .get('/api/v3/brokerage/accounts')
      .query({
        limit: params.limit?.toString(),
        cursor: params.cursor,
        retail_portfolio_id: params.retailPortfolioId // Ensure snake_case here
      })
      .reply(200, expectedResponse);

    const accounts = await client.listAccounts(params);

    expect(accounts).toEqual(expectedResponse);
  });

  it('should fetch account by UUID', async () => {
    const client = new AccountsClient(keyFile);

    const expectedResponse: GetAccountResponse = {
      account: {
        uuid: 'account1',
        name: 'account1',
        currency: 'USD',
        available_balance: { value: '100.00', currency: 'USD' },
        default: true,
        active: true,
        created_at: '2022-01-01T00:00:00Z',
        updated_at: '2022-01-01T00:00:00Z',
        type: 'ACCOUNT_TYPE_FIAT',
        ready: true,
        hold: { value: '0.00', currency: 'USD' },
        retail_portfolio_id: 'portfolio1'
      }
    };

    nock('https://api.coinbase.com')
      .get('/api/v3/brokerage/accounts/account1')
      .reply(200, expectedResponse);

    const account = await client.getAccount('account1');

    expect(account).toEqual(expectedResponse);
  });
});
