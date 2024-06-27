import nock from 'nock';
import { ListPaymentMethodsResponse } from '../../../src/rest/types/payment_methods/ListPaymentMethodsResponse';
import { GetPaymentMethodResponse } from '../../../src/rest/types/payment_methods/GetPaymentMethodResponse';
import PaymentMethodsClient from '../../../src/rest/PaymentMethodsClient';

const keyFile = process.env.KEY_FILENAME; //Example filepath in top level of Project Hierarchy: key/{insert_keyfile_name}.json

describe('PaymentMethodsClient', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('should fetch list of payment methods', async () => {
    const client = new PaymentMethodsClient(keyFile);

    const expectedResponse: ListPaymentMethodsResponse = {
      payment_methods: [
        {
          id: 'payment_method1',
          type: 'BANK_ACCOUNT',
          name: 'Bank Account 1',
          currency: 'USD',
          verified: true,
          allow_buy: true,
          allow_sell: true,
          allow_deposit: true,
          allow_withdraw: true,
          created_at: '2022-01-01T00:00:00Z',
          updated_at: '2022-01-01T00:00:00Z'
        },
        {
          id: 'payment_method2',
          type: 'CREDIT_CARD',
          name: 'Credit Card 1',
          currency: 'USD',
          verified: true,
          allow_buy: true,
          allow_sell: true,
          allow_deposit: false,
          allow_withdraw: false,
          created_at: '2022-01-01T00:00:00Z',
          updated_at: '2022-01-01T00:00:00Z'
        }
      ]
    };

    nock('https://api.coinbase.com')
      .get('/api/v3/brokerage/payment_methods')
      .reply(200, expectedResponse);

    const paymentMethods = await client.listPaymentMethods();

    expect(paymentMethods).toEqual(expectedResponse);
  });

  it('should fetch a specific payment method by ID', async () => {
    const client = new PaymentMethodsClient(keyFile);

    const expectedResponse: GetPaymentMethodResponse = {
      payment_method: {
        id: 'payment_method1',
        type: 'BANK_ACCOUNT',
        name: 'Bank Account 1',
        currency: 'USD',
        verified: true,
        allow_buy: true,
        allow_sell: true,
        allow_deposit: true,
        allow_withdraw: true,
        created_at: '2022-01-01T00:00:00Z',
        updated_at: '2022-01-01T00:00:00Z'
      }
    };

    nock('https://api.coinbase.com')
      .get('/api/v3/brokerage/payment_methods/payment_method1')
      .reply(200, expectedResponse);

    const paymentMethod = await client.getPaymentMethod('payment_method1');

    expect(paymentMethod).toEqual(expectedResponse);
  });
});
