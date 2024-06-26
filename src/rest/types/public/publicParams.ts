// src/rest/types/public/publicParams.ts

export interface GetProductBookParams {
    productID: string;
    limit?: number;
  }

export interface GetProductCandlesParams {
    productID: string;
    start: string;
    end: string;
    granularity: 'ONE_MINUTE' | 'FIVE_MINUTE' | 'FIFTEEN_MINUTE' | 'THIRTY_MINUTE' | 'ONE_HOUR' | 'TWO_HOUR' | 'SIX_HOUR' | 'ONE_DAY';
  }
  
  
  export interface GetMarketTradesParams {
    productID: string;
    limit: number;
  }
  