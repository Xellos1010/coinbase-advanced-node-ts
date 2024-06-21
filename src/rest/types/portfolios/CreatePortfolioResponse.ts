export interface Portfolio {
    name: string;
    uuid: string;
    type: "UNDEFINED" | "DEFAULT" | "CONSUMER" | "INTX";
    deleted: boolean;
  }
  
  export interface CreatePortfolioResponse {
    portfolio: Portfolio;
  }
  