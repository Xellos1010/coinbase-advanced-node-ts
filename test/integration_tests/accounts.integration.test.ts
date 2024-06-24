import CoinbaseClient from "../../src/CoinbaseClient";
import KeyFileConfig from "../../src/config/KeyFileConfig";
import { loadKeyfile } from "../../src/config/KeyLoader";
import { startPerformanceTimings, recordStepTiming, writePerformanceDataToFile, Timings } from "../performanceUtils";
import { ListAccountsParams } from "../../src/rest/types/accounts/ListAccountsParams";

const keyFile = process.env.KEY_FILENAME;
const config = loadKeyfile(keyFile);

describe('Coinbase API Integration Test - Accounts', () => {
  it('should fetch accounts and then fetch an account by UUID', async () => {
    const timings: Timings = startPerformanceTimings();

    try {
      const client = new CoinbaseClient(
        KeyFileConfig.getInstance(
          config.name,
          config.privateKey
        )
      );

      const startListAccounts = performance.now();

      // Define the parameters
      const params: ListAccountsParams = {
        limit: 5,
        cursor: undefined,
        retailPortfolioId: undefined
      };

      const accountsData = await client.accounts?.listAccounts(params);
      recordStepTiming(timings, 'listAccounts', startListAccounts);

      console.log('Fetched accounts data:', JSON.stringify(accountsData, null, 2));

      if (!accountsData?.accounts || accountsData.accounts.length === 0) {
        throw new Error("No accounts found");
      }

      const accountUUID = accountsData.accounts[0].uuid;

      const startGetAccount = performance.now();
      const accountData = await client.accounts?.getAccount(accountUUID);
      recordStepTiming(timings, 'getAccount', startGetAccount);

      console.log('Fetched account data:', accountData);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error calling Coinbase API:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    } finally {
      timings.endTime = performance.now();
      writePerformanceDataToFile('coinbaseIntegrationTest_accounts', timings);
    }
  });
});
