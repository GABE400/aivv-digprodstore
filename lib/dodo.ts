import DodoPayments from "dodopayments";

const dodoApiKey = process.env.DODO_PAYMENTS_API_KEY || "";
const envMode = process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode" ? "live_mode" : "test_mode";

export const dodo = new DodoPayments({
  bearerToken: dodoApiKey,
  environment: envMode,
});
