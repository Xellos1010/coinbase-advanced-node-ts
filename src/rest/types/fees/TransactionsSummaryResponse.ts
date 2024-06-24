export interface TransactionsSummaryResponse {
  total_volume: number;
  total_fees: number;
  fee_tier: {
    pricing_tier: string;
    usd_from: string;
    usd_to: string;
    taker_fee_rate: string;
    maker_fee_rate: string;
    aop_from: string;
    aop_to: string;
    margin_rate: {
      value: string;
    };
  };
  goods_and_services_tax: {
    rate: string;
    type: string; // Possible values: [INCLUSIVE, EXCLUSIVE]
  };
  advanced_trade_only_volume: number;
  advanced_trade_only_fees: number;
  coinbase_pro_volume: number;
  coinbase_pro_fees: number;
  [key: string]: any;
}
