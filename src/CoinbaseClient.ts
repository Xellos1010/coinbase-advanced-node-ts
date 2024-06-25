import BaseClient from "./BaseClient";
import OrdersClient from "./rest/OrdersClient";
import ProductsClient from "./rest/ProductsClient";
import AccountsClient from "./rest/AccountsClient";
import FeesClient from "./rest/FeesClient";
import ConvertsClient from "./rest/ConvertsClient";
import PaymentMethodsClient from "./rest/PaymentMethodsClient";
import PortfolioClient from "./rest/PortfolioClient";
import PublicClient from "./rest/PublicClient";
import KeyFileConfig from "./config/KeyFileConfig";
import { LazyProxyHandler } from "./LazyProxyHandler";
import BaseWebSocketClient from "./websocket/BaseWebSocketClient";

class CoinbaseClient extends BaseClient {
  public public?: PublicClient;
  public orders?: OrdersClient;
  public products?: ProductsClient;
  public accounts?: AccountsClient;
  public fees?: FeesClient;
  public converts?: ConvertsClient;
  public payments?: PaymentMethodsClient;
  public portfolio?: PortfolioClient;
  public websocket?: BaseWebSocketClient; 

  constructor(config?: KeyFileConfig) {
    super(config);
    // Public endpoints
    this.public = new Proxy({}, new LazyProxyHandler(() => new PublicClient(this.keyFile), false, this.keyFile));
    
    // Note: This needs to be loaded with a websocket config so we need to check if the config passed is a websocket config or

    this.websocket = new Proxy({}, new LazyProxyHandler(() => new BaseWebSocketClient(this.keyFile), true, this.keyFile));
    
    if (this.keyFile) {
      this.orders = new Proxy({}, new LazyProxyHandler(() => new OrdersClient(this.keyFile), true, this.keyFile));
      this.products = new Proxy({}, new LazyProxyHandler(() => new ProductsClient(this.keyFile), true, this.keyFile));
      this.accounts = new Proxy({}, new LazyProxyHandler(() => new AccountsClient(this.keyFile), true, this.keyFile));
      this.fees = new Proxy({}, new LazyProxyHandler(() => new FeesClient(this.keyFile), true, this.keyFile));
      this.converts = new Proxy({}, new LazyProxyHandler(() => new ConvertsClient(this.keyFile), true, this.keyFile));
      this.payments = new Proxy({}, new LazyProxyHandler(() => new PaymentMethodsClient(this.keyFile), true, this.keyFile));
      this.portfolio = new Proxy({}, new LazyProxyHandler(() => new PortfolioClient(this.keyFile), true, this.keyFile));
    } else {
      const handler = {
        get: function(target: any, prop: string) {
          throw new Error("Authentication required: keyFile is missing.");
        }
      };
      this.orders = new Proxy({}, handler);
      this.products = new Proxy({}, handler);
      this.accounts = new Proxy({}, handler);
      this.fees = new Proxy({}, handler);
      this.converts = new Proxy({}, handler);
      this.payments = new Proxy({}, handler);
      this.portfolio = new Proxy({}, handler);
    }
  }
}

export default CoinbaseClient;
