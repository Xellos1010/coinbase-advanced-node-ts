export interface TransactionsSummaryParams {
  product_type?: string;
  contract_expiry_type?: string;
  product_venue?: string;
  user_native_currency?: string;
  start_date?: string; // Deprecated
  end_date?: string; // Deprecated
  [key: string]: any;
}
