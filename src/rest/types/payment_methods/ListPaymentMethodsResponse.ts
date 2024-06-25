export interface PaymentMethod {
    id: string;
    type: string;
    name: string;
    currency: string;
    verified: boolean;
    allow_buy: boolean;
    allow_sell: boolean;
    allow_deposit: boolean;
    allow_withdraw: boolean;
    created_at: string; // date-time
    updated_at: string; // date-time
  }
  
  export interface ListPaymentMethodsResponse {
    payment_methods: PaymentMethod[];
  }
  