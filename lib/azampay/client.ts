/**
 * AzamPay API Client
 * ──────────────────
 * Server-side only. Handles authentication and payment requests.
 * Uses raw fetch API (no SDK dependency needed).
 */

import { AZAMPAY_CONFIG } from "./config";

// ─── Token Cache ──────────────────────────────────
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

/** Get authentication token (cached until expiry) */
async function getToken(): Promise<string> {
  const now = Date.now();

  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && tokenExpiry > now + 60_000) {
    return cachedToken;
  }

  const response = await fetch(
    `${AZAMPAY_CONFIG.authUrl}/AppRegistration/GenerateToken`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appName: AZAMPAY_CONFIG.appName,
        clientId: AZAMPAY_CONFIG.clientId,
        clientSecret: AZAMPAY_CONFIG.clientSecret,
      }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    console.error("AzamPay auth failed:", text);
    throw new Error("Failed to authenticate with AzamPay");
  }

  const result = await response.json();

  if (!result.data?.accessToken) {
    throw new Error("No access token in AzamPay response");
  }

  cachedToken = result.data.accessToken;
  // Parse expiry or default to 55 minutes
  tokenExpiry = now + 55 * 60 * 1000;

  return cachedToken!;
}

// ─── MNO Checkout ─────────────────────────────────

interface MNOCheckoutPayload {
  accountNumber: string; // Phone number (e.g. 0712345678)
  amount: string;
  currency: string;
  externalId: string;
  provider: "Mpesa" | "Tigo" | "Airtel" | "Halopesa" | "Azampesa";
  additionalProperties?: Record<string, string>;
}

interface CheckoutResponse {
  transactionId: string;
  message: string;
  success: boolean;
}

/**
 * Initiate MNO (mobile money) checkout.
 * Sends a USSD push to the user's phone — they enter PIN to confirm.
 */
export async function mnoCheckout(
  payload: MNOCheckoutPayload
): Promise<CheckoutResponse> {
  const token = await getToken();

  const response = await fetch(
    `${AZAMPAY_CONFIG.checkoutUrl}/azampay/mno/checkout`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-API-KEY": AZAMPAY_CONFIG.apiKey,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    console.error("AzamPay MNO checkout failed:", text);
    throw new Error("MNO checkout request failed");
  }

  return response.json();
}

// ─── Bank Checkout ────────────────────────────────

interface BankCheckoutPayload {
  amount: string;
  currencyCode: string;
  merchantAccountNumber: string;
  merchantMobileNumber: string;
  merchantName?: string;
  otp: string;
  provider: "CRDB" | "NMB";
  referenceId: string;
  additionalProperties?: Record<string, string>;
}

/**
 * Initiate bank checkout.
 * User provides OTP from their bank for confirmation.
 */
export async function bankCheckout(
  payload: BankCheckoutPayload
): Promise<CheckoutResponse> {
  const token = await getToken();

  const response = await fetch(
    `${AZAMPAY_CONFIG.checkoutUrl}/azampay/bank/checkout`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-API-KEY": AZAMPAY_CONFIG.apiKey,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    console.error("AzamPay bank checkout failed:", text);
    throw new Error("Bank checkout request failed");
  }

  return response.json();
}

// ─── Transaction Status ───────────────────────────

interface TransactionStatusResponse {
  data: string;
  message: string;
  success: boolean;
  statusCode: number;
}

/** Check payment transaction status */
export async function getTransactionStatus(
  reference: string,
  bankName: string
): Promise<TransactionStatusResponse> {
  const token = await getToken();

  const response = await fetch(
    `${AZAMPAY_CONFIG.checkoutUrl}/azampay/transactionstatus`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-API-KEY": AZAMPAY_CONFIG.apiKey,
      },
      body: JSON.stringify({ reference, bankName }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    console.error("AzamPay status check failed:", text);
    throw new Error("Transaction status check failed");
  }

  return response.json();
}
