import nock from 'nock';
import PublicClient from '../../../src/rest/PublicClient';
import {
  ServerTimeResponse,
  ProductsResponse,
  ProductResponse,
  ProductBookResponse,
  ProductCandlesResponse,
  MarketTradesResponse
} from '../../../src/rest/types/public';
import {
  GetProductBookParams,
  GetProductCandlesParams,
  GetMarketTradesParams
} from '../../../src/rest/types/public/publicParams';

const keyFile = process.env.KEY_FILENAME;

describe('PublicClient', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('should fetch server time', async () => {
    const client = new PublicClient(keyFile);

    const expectedResponse: ServerTimeResponse = {
      iso: '2023-06-25T00:00:00Z',
      epochSeconds: '1687680000',
      epochMillis: '1687680000000'
    };

    nock('https://api.coinbase.com')
      .get('/api/v3/brokerage/time')
      .reply(200, expectedResponse);

    const serverTime = await client.getServerTime();

    expect(serverTime).toEqual(expectedResponse);
  });

  it('should fetch product book', async () => {
    const client = new PublicClient(keyFile);

    const params: GetProductBookParams = { productID: 'BTC-USD', limit: 10 };
    const expectedResponse: ProductBookResponse = {
      product_id: 'BTC-USD',
      bids: [{ price: '30000.00', size: '1.0' }],
      asks: [{ price: '30001.00', size: '1.0' }],
      time: '2023-06-25T00:00:00Z'
    };

    nock('https://api.coinbase.com')
      .get('/api/v3/brokerage/market/product_book')
      .query({ product_id: 'BTC-USD', limit: '10' })
      .reply(200, expectedResponse);

    const productBook = await client.getProductBook(params);

    expect(productBook).toEqual(expectedResponse);
  });

  it('should list products', async () => {
    const client = new PublicClient(keyFile);

    const expectedResponse: ProductsResponse = {
      products: [
        {
          product_id: 'BTC-USD',
          price: '30000.00',
          price_percentage_change_24h: '1.00',
          volume_24h: '1000.0',
          volume_percentage_change_24h: '1.00',
          base_increment: '0.00000001',
          quote_increment: '0.01',
          quote_min_size: '1.0',
          quote_max_size: '1000000.0',
          base_min_size: '0.0001',
          base_max_size: '1000.0',
          base_name: 'Bitcoin',
          quote_name: 'US Dollar',
          watched: true,
          is_disabled: false,
          new: false,
          status: 'online',
          cancel_only: false,
          limit_only: false,
          post_only: false,
          trading_disabled: false,
          auction_mode: false,
          product_type: 'spot',
          quote_currency_id: 'USD',
          base_currency_id: 'BTC'
        }
      ]
    };

    nock('https://api.coinbase.com')
      .get('/api/v3/brokerage/market/products')
      .reply(200, expectedResponse);

    const products = await client.listProducts();

    expect(products).toEqual(expectedResponse);
  });

  it('should fetch a product by ID', async () => {
    const client = new PublicClient(keyFile);

    const expectedResponse: ProductResponse = {
      product_id: 'BTC-USD',
      price: '30000.00',
      price_percentage_change_24h: '1.00',
      volume_24h: '1000.0',
      volume_percentage_change_24h: '1.00',
      base_increment: '0.00000001',
      quote_increment: '0.01',
      quote_min_size: '1.0',
      quote_max_size: '1000000.0',
      base_min_size: '0.0001',
      base_max_size: '1000.0',
      base_name: 'Bitcoin',
      quote_name: 'US Dollar',
      watched: true,
      is_disabled: false,
      new: false,
      status: 'online',
      cancel_only: false,
      limit_only: false,
      post_only: false,
      trading_disabled: false,
      auction_mode: false,
      product_type: 'spot',
      quote_currency_id: 'USD',
      base_currency_id: 'BTC'
    };

    nock('https://api.coinbase.com')
      .get('/api/v3/brokerage/market/products/BTC-USD')
      .reply(200, expectedResponse);

    const product = await client.getProduct('BTC-USD');

    expect(product).toEqual(expectedResponse);
  });

  it('should fetch product candles', async () => {
    const client = new PublicClient(keyFile);

    const params: GetProductCandlesParams = {
      productID: 'BTC-USD',
      start: '2023-06-24T00:00:00Z',
      end: '2023-06-25T00:00:00Z',
      granularity: 'ONE_HOUR'
    };
    const expectedResponse: ProductCandlesResponse = {
      candles: [
        {
          start: '2023-06-24T00:00:00Z',
          low: '29000.00',
          high: '31000.00',
          open: '30000.00',
          close: '30500.00',
          volume: '500.0'
        }
      ]
    };

    nock('https://api.coinbase.com')
      .get('/api/v3/brokerage/market/products/BTC-USD/candles')
      .query({
        start: '2023-06-24T00:00:00Z',
        end: '2023-06-25T00:00:00Z',
        granularity: '86400'
      })
      .reply(200, expectedResponse);

    const productCandles = await client.getProductCandles(params);

    expect(productCandles).toEqual(expectedResponse);
  });

  it('should fetch market trades', async () => {
    const client = new PublicClient(keyFile);

    const params: GetMarketTradesParams = { productID: 'BTC-USD', limit: 10 };
    const expectedResponse: MarketTradesResponse = {
      trades: [
        {
          trade_id: '1',
          product_id: 'BTC-USD',
          price: '30000.00',
          size: '0.1',
          time: '2023-06-25T00:00:00Z',
          side: 'buy'
        }
      ],
      best_bid: '30000.00',
      best_ask: '30001.00'
    };

    nock('https://api.coinbase.com')
      .get('/api/v3/brokerage/market/products/BTC-USD/ticker')
      .query({ limit: '10' })
      .reply(200, expectedResponse);

    const marketTrades = await client.getMarketTrades(params);

    expect(marketTrades).toEqual(expectedResponse);
  });
});
