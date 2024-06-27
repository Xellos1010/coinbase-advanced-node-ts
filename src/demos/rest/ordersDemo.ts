import CoinbaseClient from "../../CoinbaseClient";
import { loadRestConfig } from "../../config";
import KeyFileConfig from "../../config/KeyFileConfig";

const keyFile = process.env.KEY_FILENAME;
const config = loadRestConfig(keyFile);

async function demo() {
  const client = new CoinbaseClient(
    KeyFileConfig.getInstance(config.name, config.privateKey)
  );

  try {
    const uniqueOrderId = await client.orders?.generateClientOrderID();
    if (!uniqueOrderId) {
      throw new Error("Failed to generate client order ID");
    }

    const endTime = new Date(Date.now() + 1 * 60 * 1000).toISOString();
    const buyOrderConfig = {
      limit_price: "20000.00",
      end_time: endTime,
    };

    const createOrderResponse = await client.orders?.createBuyOrder(
      "BTC-USD",
      "0.00001",
      uniqueOrderId,
      buyOrderConfig
    );

    console.log("Created buy order response:", createOrderResponse);

    const orderID = createOrderResponse?.order_id;
    if (!orderID) {
      throw new Error("Failed to get order ID");
    }

    const cancelOrderResponse = await client.orders?.cancelOrders([orderID]);
    console.log("Cancelled order response:", cancelOrderResponse);
  } catch (error) {
    console.error("Error calling Coinbase API:", error instanceof Error ? error.message : error);
  }
}

demo().catch(console.error);
