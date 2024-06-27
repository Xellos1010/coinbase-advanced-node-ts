**README.md**

# Coinbase Advanced Node.js Client

This is a Node.js client library for interacting with the Coinbase Advanced Trade API, providing both REST and WebSocket capabilities. This library is designed to help developers easily integrate Coinbase trading features into their applications.

Based on the [Official Coinbase Python](https://github.com/coinbase/coinbase-advanced-py/tree/master) repository

## Features

- **REST API Support**: Comprehensive access to Coinbase's REST endpoints.
- **WebSocket API Support**: Websocket Channel Management and Event Handling with retry mechanisms.
- **Authenticated and Public Endpoints**: Support for both authenticated and public API requests.
- **Proxy Pattern for Lazy Initialization**: Efficient initialization of clients using the Proxy pattern.

## Installation

use git clone https://github.com/Xellos1010/coinbase-advanced-node-ts to clone this repo 

## Getting Started

### Configuration
Download your key from Coinbase (Please refer to [Coinbase documentation](https://help.coinbase.com/en/international-exchange/manage-account/how-to-create-an-api-key))

Place the key in a folder at the top level:
key\[your key name].json

Create a .env file with the following:
KEY_FILENAME=key\[your key name].json

Alternativly you can add you keyname and private key to the src\config\constants.ts file:
export const API_ENV_KEY = "COINBASE_API_KEY";
export const API_SECRET_ENV_KEY = "COINBASE_API_SECRET";

### Usage

#### Initializing an Authenticated REST Client
Ensure the imports are relative the scripts placement in your directory. This assumes you have a file at the top level of this clones project
```typescript
import CoinbaseClient from "../src/CoinbaseClient";
import KeyFileConfig from "../src/config/KeyFileConfig";
import { loadKeyfile } from "../src/config/KeyLoader";

const keyFile = process.env.KEY_FILENAME; //Example filepath in top level of Project Hierarchy: key/{insert_keyfile_name}.json
const config = loadKeyfile(keyFile);

const client = new CoinbaseClient(
        KeyFileConfig.getInstance(
          config.name,
          config.privateKey
        )
      );

// Continue to execute an authenticated request:
const accountsData = await client.accounts?.listAccounts();
```

### Demos

All demo scripts are executable from the root directory. If you want to use specific credentials with a demo script, simply add a .env file to the root of this package

npx ts-node ./src/demo/dump-candles.ts

Tip: There is a .env.defaults file which serves as a template. Just remove its .defaults extension and enter your credentials to get started. Do not commit this file (or your credentials) to any repository!

### Executing Tests

#### Executing a Single Test

Run the command yarn test:single test/public.integration.test.ts
You have to that '/' pointing to the test you want to run.

#### Executing all tests

Run the command yarn test

### Building the Project

run the command yarn build

### Checklist of Endpoints Tested

#### Authenticated Endpoints

| Endpoint                       | Method | Resource                                | Status |
| ------------------------------ | ------ | --------------------------------------- | ------ |
| List Accounts                  | GET    | /accounts                               | Tested |
| Get Account                    | GET    | /accounts/:account_id                   | Tested |
| Create Order                   | POST   | /orders                                 | Tested |
| Cancel Orders                  | POST   | /orders/batch_cancel                    | Tested |
| List Orders                    | GET    | /orders/historical/batch                | Tested |
| List Fills                     | GET    | /orders/historical/fills                | Tested |
| Get Order                      | GET    | /orders/historical/{order_id}           | Tested |
| Preview Orders                 | POST   | /orders/preview                         | Tested |
| Get Best Bid/Ask               | GET    | /best_bid_ask                           | Tested |
| Get Product Book               | GET    | /product_book                           | Tested |
| List Products                  | GET    | /products                               | Tested |
| Get Product                    | GET    | /products/{product_id}                  | Tested |
| Get Product Candles            | GET    | /products/{product_id}/candles          | Tested |
| Get Market Trades              | GET    | /products/{product_id}/ticker           | Tested |
| Get Transactions Summary       | GET    | /transaction_summary                    | Tested |
| Create Convert Quote           | POST   | /convert/quote                          | Tested |
| Commit Convert Trade           | POST   | /convert/{trade_id}                     | Tested |
| Get Convert Trade              | GET    | /convert/{trade_id}                     | Tested |
| List Portfolios                | GET    | /portfolios                             | Tested |
| Create Portfolio               | POST   | /portfolios                             | Tested |
| Move Portfolio Funds           | POST   | /portfolios                             | Tested |
| Get Portfolio Breakdown        | GET    | /portfolios                             | Tested |
| Delete Portfolio               | DELETE | /portfolios                             | Tested |
| Edit Portfolio                 | PUT    | /portfolios                             | Tested |
| Get Futures Balance Summary    | GET    | /cfm/balance_summary                    | Tested |
| List Futures Positions         | GET    | /cfm/positions                          | Tested |
| Get Futures Position           | GET    | /cfm/positions/{product_id}             | Tested |
| Schedule Futures Sweep         | POST   | /cfm/sweeps/schedule                    | Tested |
| List Futures Sweeps            | GET    | /cfm/sweeps                             | Tested |
| Cancel Futures Sweep           | DELETE | /cfm/sweeps                             | Tested |
| Get Intraday Margin Setting    | GET    | /cfm/intraday/margin_setting            | Tested |
| Set Intraday Margin Setting    | POST   | /cfm/intraday/margin_setting            | Tested |
| Get Current Margin Window      | GET    | /cfm/intraday/current_margin_window     | Tested |
| Get Perpetuals Portfolio Summary| GET    | /intx/portfolio                        | Tested |
| List Perpetuals Positions      | GET    | /intx/positions                         | Tested |
| Get Perpetuals Position        | GET    | /intx/positions                         | Tested |
| Get Perpetuals Portfolio Balances| GET   | /intx/balances                         | Tested |
| Opt-In Multi Asset Collateral  | POST   | /intx/multi_asset_collateral            | Tested |
| Allocate Portfolio             | POST   | /intx/allocate                          | Tested |
| List Payment Methods           | GET    | /payment_methods                        | Tested |
| Get Payment Method             | GET    | /payment_methods/{payment_method_id}    | Tested |

#### Public Endpoints

| Endpoint                   | Method | Resource                              | Status |
| -------------------------- | ------ | ------------------------------------- | ------ |
| Get Server Time            | GET    | /time                                 | Tested |
| Get Public Product Book    | GET    | /market/product_book                  | Tested |
| List Public Products       | GET    | /market/products                      | Tested |
| Get Public Product         | GET    | /market/products/{product_id}         | Tested |
| Get Public Product Candles | GET    | /market/products/{product_id}/candles | Tested |
| Get Public Market Trades   | GET    | /market/products/{product_id}/ticker  | Tested |

#### Websocket Channels
| Endpoint         | Status |
| -----------------| ------ |
| Candles          | Tested |
| Heartbeat        | Tested |
| Level2           | Tested |
| MarketTrades     | Tested |
| Status           | Tested |
| Ticker           | Tested |
| TickerBatch      | Tested |
| User             | Tested |
## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss improvements or bugs.

### ⭐️ Show your support ⭐️

Please leave a star if you find this project useful.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```