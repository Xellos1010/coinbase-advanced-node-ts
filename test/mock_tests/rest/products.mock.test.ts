import nock from 'nock';
import ProductsClient from '../../../src/rest/ProductsClient';
import { GetProductBookParams, GetBestBidAskParams, GetProductBookResponse, GetMarketTradesResponse, GetProductCandlesResponse, GetProductResponse, ListProductsResponse, GetBestBidAskResponse, GetProductCandlesParams } from '../../../src/rest/types/products';

const keyFile = process.env.KEY_FILENAME; //Example filepath in top level of Project Hierarchy: key/{insert_keyfile_name}.json

describe('ProductsClient', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('should fetch best bid ask with specified parameters', async () => {
    const client = new ProductsClient(keyFile);

    const expectedResponse: GetBestBidAskResponse = {
      pricebooks: [
        {
          product_id: 'BTC-USD',
          bids: [{ price: '30000.00', size: '1.0' }],
          asks: [{ price: '30010.00', size: '1.0' }],
          time: '2022-01-01T00:00:00Z'
        }
      ]
    };

    const params: GetBestBidAskParams = {
      product_ids: ['BTC-USD']
    };

    nock('https://api.coinbase.com')
      .get('/api/v3/brokerage/best_bid_ask')
      .query({ product_ids: 'BTC-USD' })
      .reply(200, expectedResponse);

    const bestBidAsk = await client.getBestBidAsk(params);

    expect(bestBidAsk).toEqual(expectedResponse);
  });

  it('should list products', async () => {
    const client = new ProductsClient(keyFile);

    const expectedResponse: ListProductsResponse = {
      products: [
        {
          product_id: 'BTC-USD',
          price: '30000.00',
          price_percentage_change_24h: '0.5',
          volume_24h: '1000.0',
          volume_percentage_change_24h: '10.0',
          base_increment: '0.00000001',
          quote_increment: '0.01',
          quote_min_size: '10.00',
          quote_max_size: '1000000.00',
          base_min_size: '0.0001',
          base_max_size: '100.00',
          base_name: 'Bitcoin',
          quote_name: 'USD',
          watched: false,
          is_disabled: false,
          new: false,
          status: 'online',
          cancel_only: false,
          limit_only: false,
          post_only: false,
          trading_disabled: false,
          auction_mode: false,
          product_type: 'SPOT',
          quote_currency_id: 'USD',
          base_currency_id: 'BTC',
          base_display_symbol: 'BTC',
          quote_display_symbol: 'USD',
          price_increment: '0.01'
        }
      ],
      num_products: 1
    };

    nock('https://api.coinbase.com')
      .get('/api/v3/brokerage/products')
      .reply(200, expectedResponse);

    const products = await client.listProducts();

    expect(products).toEqual(expectedResponse);
  });

  it('should fetch product by ID', async () => {
    const client = new ProductsClient(keyFile);

    const expectedResponse: GetProductResponse = {
      product_id: 'BTC-USD',
      price: '30000.00',
      price_percentage_change_24h: '0.5',
      volume_24h: '1000.0',
      volume_percentage_change_24h: '10.0',
      base_increment: '0.00000001',
      quote_increment: '0.01',
      quote_min_size: '10.00',
      quote_max_size: '1000000.00',
      base_min_size: '0.0001',
      base_max_size: '100.00',
      base_name: 'Bitcoin',
      quote_name: 'USD',
      watched: false,
      is_disabled: false,
      new: false,
      status: 'online',
      cancel_only: false,
      limit_only: false,
      post_only: false,
      trading_disabled: false,
      auction_mode: false,
      product_type: 'SPOT',
      quote_currency_id: 'USD',
      base_currency_id: 'BTC',
      base_display_symbol: 'BTC',
      quote_display_symbol: 'USD',
      price_increment: '0.01'
    };

    nock('https://api.coinbase.com')
      .get('/api/v3/brokerage/products/BTC-USD')
      .reply(200, expectedResponse);

    const product = await client.getProduct('BTC-USD');

    expect(product).toEqual(expectedResponse);
  });

  it('should fetch product candles', async () => {
    const client = new ProductsClient(keyFile);
  
    const expectedResponse: GetProductCandlesResponse = {
      candles: [
        { start: '2022-01-01T00:00:00Z', low: '29000.00', high: '31000.00', open: '29500.00', close: '30000.00', volume: '500.0' }
      ]
    };
  
    const productID = 'BTC-USD';
    const queryParams: GetProductCandlesParams = { start: '1625097600', end: '1625184000', granularity: 'ONE_HOUR' };
  
    nock('https://api.coinbase.com')
      .get(`/api/v3/brokerage/products/${productID}/candles`)
      .query(queryParams as any)
      .reply(200, expectedResponse);
  
    const candles = await client.getProductCandles(productID, queryParams);
  
    expect(candles).toEqual(expectedResponse);
  });
  
  
  

  it('should fetch market trades', async () => {
    const client = new ProductsClient(keyFile);

    const expectedResponse: GetMarketTradesResponse = {
      trades: [
        { trade_id: 'trade1', product_id: 'BTC-USD', price: '30000.00', size: '0.1', time: '2022-01-01T00:00:00Z', side: 'BUY', bid: '29990.00', ask: '30010.00' }
      ],
      best_bid: '29990.00',
      best_ask: '30010.00'
    };

    const productID = 'BTC-USD';
    const queryParams = { limit: 1 };

    nock('https://api.coinbase.com')
      .get(`/api/v3/brokerage/products/${productID}/ticker`)
      .query(queryParams)
      .reply(200, expectedResponse);

    const trades = await client.getMarketTrades(productID, queryParams);

    expect(trades).toEqual(expectedResponse);
  });

  it('should fetch product book', async () => {
    const client = new ProductsClient(keyFile);

    const expectedResponse: GetProductBookResponse = {
      pricebook: {
        product_id: 'BTC-USD',
        bids: [{ price: '29990.00', size: '1.0' }],
        asks: [{ price: '30010.00', size: '1.0' }],
        time: '2022-01-01T00:00:00Z'
      }
    };

    const queryParams: GetProductBookParams = { product_id: 'BTC-USD', limit: 10 };

    nock('https://api.coinbase.com')
      .get('/api/v3/brokerage/product_book')
      .query(queryParams as any)
      .reply(200, expectedResponse);

    const productBook = await client.getProductBook(queryParams);

    expect(productBook).toEqual(expectedResponse);
  });
});
