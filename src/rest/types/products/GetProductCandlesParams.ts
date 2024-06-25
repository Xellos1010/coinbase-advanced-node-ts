// src/rest/types/products/GetProductCandlesParams.ts
export interface GetProductCandlesParams {
    start: string;
    end: string;
    granularity: 'ONE_MINUTE' | 'FIVE_MINUTE' | 'FIFTEEN_MINUTE' | 'THIRTY_MINUTE' | 'ONE_HOUR' | 'TWO_HOUR' | 'SIX_HOUR' | 'ONE_DAY';
}
