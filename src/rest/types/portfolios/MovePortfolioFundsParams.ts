export interface MovePortfolioFundsParams {
    funds: {
      value: string;
      currency: string;
    };
    source_portfolio_uuid: string;
    target_portfolio_uuid: string;
  }
  