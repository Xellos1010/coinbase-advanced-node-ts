// src\rest\types\converts\CommitConvertTrade.ts
export interface CommitConvertTradeRequest {
    from_account: string; // required
    to_account: string; // required
  }
  
  export interface CommitConvertTradeResponse {
    trade: {
      id: string;
      status: 'TRADE_STATUS_UNSPECIFIED' | 'TRADE_STATUS_CREATED' | 'TRADE_STATUS_STARTED' | 'TRADE_STATUS_COMPLETED' | 'TRADE_STATUS_CANCELED';
      user_entered_amount: {
        value: string;
        currency: string;
      };
      amount: {
        value: string;
        currency: string;
      };
      subtotal: {
        value: string;
        currency: string;
      };
      total: {
        value: string;
        currency: string;
      };
      fees: Array<{
        title: string;
        description: string;
        amount: {
          value: string;
          currency: string;
        };
        label: string;
        disclosure: {
          title: string;
          description: string;
          link: {
            text: string;
            url: string;
          };
        };
      }>;
      total_fee: {
        title: string;
        description: string;
        amount: {
          value: string;
          currency: string;
        };
        label: string;
        disclosure: {
          title: string;
          description: string;
          link: {
            text: string;
            url: string;
          };
        };
      };
      source: {
        type: 'LEDGER_NAMED_ACCOUNT';
        network: string;
        ledger_account: {
          account_id: string;
          currency: string;
          owner: {
            id: string;
            uuid: string;
            user_uuid: string;
            type: 'UNKNOWN' | 'INVESTMENT_VEHICLE' | 'RETAIL' | 'VENUE' | 'PORTFOLIO';
          };
        };
      };
      target: {
        type: 'LEDGER_NAMED_ACCOUNT';
        network: string;
        ledger_account: {
          account_id: string;
          currency: string;
          owner: {
            id: string;
            uuid: string;
            user_uuid: string;
            type: 'UNKNOWN' | 'INVESTMENT_VEHICLE' | 'RETAIL' | 'VENUE' | 'PORTFOLIO';
          };
        };
      };
      unit_price: {
        target_to_fiat: {
          amount: {
            value: string;
            currency: string;
          };
          scale: number;
        };
        target_to_source: {
          amount: {
            value: string;
            currency: string;
          };
          scale: number;
        };
        source_to_fiat: {
          amount: {
            value: string;
            currency: string;
          };
          scale: number;
        };
      };
      user_warnings: Array<{
        id: string;
        link: {
          text: string;
          url: string;
        };
        context: {
          details: string[];
          title: string;
          link_text: string;
        };
        code: string;
        message: string;
        user_reference: string;
      }>;
      source_currency: string;
      target_currency: string;
      cancellation_reason?: {
        message: string;
        code: string;
      };
      error_code?: 'ERROR_CODES_UNSPECIFIED' | 'ERROR_CODES_AUTHENTICATION_ERROR' | 'ERROR_CODES_PERMISSION_DENIED' | 'ERROR_CODES_NOT_FOUND' | 'ERROR_CODES_INTERNAL_SERVER_ERROR' | 'ERROR_CODES_SERVICE_UNAVAILABLE' | 'ERROR_CODES_INVALID' | 'ERROR_CODES_REJECTED' | 'ERROR_CODES_LIMIT_ERROR' | 'ERROR_CODES_LIMIT_ERROR_INCREASE_ELIGIBLE' | 'ERROR_CODES_MONORAIL_USER_ACTIONABLE_ERROR' | 'ERROR_CODES_MONORAIL_FALLBACK_ERROR' | 'HIGH_RISK_SCORE_CANCELED' | 'ERROR_CODES_DEPOSIT_CHECK_QUESTIONNAIRE_REQUIRED' | 'ERROR_CODES_DEPOSIT_CHECK_FACEMATCH_REQUIRED' | 'ERROR_CODES_DEPOSIT_CHECK_FACEMATCH_AND_QUESTIONNAIRE_REQUIRED' | 'ERROR_CODES_INSUFFICIENT_BALANCE' | 'ERROR_CODES_RATE_LIMITED';
      error_cta?: 'ERROR_CTA_UNSPECIFIED' | 'ERROR_CTA_BUY_MINIMUM' | 'ERROR_CTA_BUY_MAXIMUM' | 'ERROR_CTA_BUY_INSUFFICIENT_BALANCE' | 'ERROR_CTA_SELL_MINIMUM' | 'ERROR_CTA_SELL_ALL' | 'ERROR_CTA_SWITCH_PAYMENT';
      source_id: string;
      target_id: string;
      exchange_rate: {
        value: string;
        currency: string;
      };
      tax_details: Array<{
        name: string;
        amount: {
          value: string;
          currency: string;
        };
      }>;
      trade_incentive_info?: {
        applied_incentive: boolean;
        user_incentive_id: string;
        code_val: string;
        ends_at: string;
        fee_without_incentive: {
          value: string;
          currency: string;
        };
        redeemed: boolean;
        total_fee_without_tax: {
          title: string;
          description: string;
          amount: {
            value: string;
            currency: string;
          };
          label: string;
          disclosure: {
            title: string;
            description: string;
            link: {
              text: string;
              url: string;
            };
          };
        };
        fiat_denoted_total: {
          value: string;
          currency: string;
        };
      };
    };
  }
  