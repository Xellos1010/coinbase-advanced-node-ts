// test\orders.integration.test.ts
import CoinbaseClient from "../src/CoinbaseClient";
import { loadRestConfig } from "../src/config";
import KeyFileConfig from "../src/config/KeyFileConfig";
import { startPerformanceTimings, recordStepTiming, writePerformanceDataToFile, Timings } from "./performanceUtils";

const keyFile = process.env.KEY_FILENAME;
const config = loadRestConfig(keyFile);

describe('Coinbase API Integration Test - Orders', () => {
  it('should create a buy order, preview it, edit it, and then cancel it', async () => {
    const timings: Timings = startPerformanceTimings();

    try {
      const client = new CoinbaseClient(
        KeyFileConfig.getInstance(
          config.name,
          config.privateKey
        )
      );

      const startGenerateClientOrderID = performance.now();
      const uniqueOrderId = await client.orders?.generateClientOrderID();
      recordStepTiming(timings, 'generateClientOrderID', startGenerateClientOrderID);

      if (!uniqueOrderId) {
        throw new Error("Failed to generate client order ID");
      }

      const endTime = new Date(Date.now() + 1 * 60 * 1000).toISOString();
      const buyOrderConfig = {
        limit_price: "20000.00",
        end_time: endTime,
      };

      const startCreateBuyOrder = performance.now();
      const createOrderResponse = await client.orders?.createBuyOrder(
        "BTC-USD",
        "0.00001",
        uniqueOrderId,
        buyOrderConfig
      );
      recordStepTiming(timings, 'createBuyOrder', startCreateBuyOrder);

      console.log("Created buy order response:", createOrderResponse);

      const orderID = createOrderResponse?.order_id;
      if (!orderID) {
        throw new Error("Failed to get order ID");
      }

      const startCancelOrders = performance.now();
      const cancelOrderResponse = await client.orders?.cancelOrders([orderID]);
      recordStepTiming(timings, 'cancelOrders', startCancelOrders);

      console.log("Cancelled order response:", cancelOrderResponse);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error calling Coinbase API:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      timings.endTime = performance.now();
      writePerformanceDataToFile('coinbaseIntegrationTest_orders_createAndCancel', timings);
    }
  });

  it('should list orders and fills, and get an order by ID', async () => {
    const timings: Timings = startPerformanceTimings();

    try {
      const client = new CoinbaseClient(
        KeyFileConfig.getInstance(
          config.name,
          config.privateKey
        )
      );

      const startListOrders = performance.now();
      const listOrdersResponse = await client.orders?.listOrders();
      recordStepTiming(timings, 'listOrders', startListOrders);

      console.log('List orders response:', JSON.stringify(listOrdersResponse, null, 2));

      const startListFills = performance.now();
      const listFillsResponse = await client.orders?.listFills();
      recordStepTiming(timings, 'listFills', startListFills);

      console.log('List fills response:', JSON.stringify(listFillsResponse, null, 2));

      if (listOrdersResponse?.orders && listOrdersResponse.orders.length > 0) {
        const orderID = listOrdersResponse.orders[0].order_id;

        const startGetOrder = performance.now();
        const getOrderResponse = await client.orders?.getOrder(orderID);
        recordStepTiming(timings, 'getOrder', startGetOrder);

        console.log('Get order response:', JSON.stringify(getOrderResponse, null, 2));
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error calling Coinbase API:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    } finally {
      timings.endTime = performance.now();
      writePerformanceDataToFile('coinbaseIntegrationTest_orders_listAndGet', timings);
    }
  });
});
