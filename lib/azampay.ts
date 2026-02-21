/**
 * lib/azampay.ts
 * ──────────────
 * Public-facing AzamPay module.
 * Provides clean functions for token retrieval, payment request creation,
 * and transaction verification. Wraps the lower-level client internals.
 *
 * Environment variables required:
 *   AZAMPAY_CLIENT_ID      — from AzamPay developer portal
 *   AZAMPAY_CLIENT_SECRET  — from AzamPay developer portal
 *   AZAMPAY_APP_NAME       — registered app name (default: VanveiVillas)
 *   AZAMPAY_API_KEY        — API key for checkout endpoints
 *   AZAMPAY_ENV            — "SANDBOX" | "LIVE" (default: SANDBOX)
 *   NEXT_PUBLIC_APP_URL    — base URL for callback (e.g. https://vanvei-villas.netlify.app)
 *
 * Note: AZAMPAY_BASE_URL is the same as the checkout URL derived from AZAMPAY_ENV.
 * It is not a separate env var — use AZAMPAY_ENV to control sandbox vs live.
 */

import { AZAMPAY_CONFIG } from "./azampay/config";
import {
  mnoCheckout,
  getTransactionStatus,
} from "./azampay/client";

// ─── Types ────────────────────────────────────────

export interface BookingPaymentInput {
  id: string;           // booking ID
  total_price: number;  // amount in TZS
  guest_phone: string;  // formatted phone number (e.g. 0712345678)
  provider: "Mpesa" | "Tigo" | "Airtel" | "Halopesa" | "Azampesa";
}

export interface PaymentRequestResult {
  success: boolean;
  externalId: string;
  transactionId?: string;
  payment_url?: string;   // present if AzamPay returns a redirect URL
  message: string;
}

export interface VerifyTransactionResult {
  verified: boolean;
  status: "success" | "pending" | "failed" | "unknown";
  raw?: unknown;
}

// ─── Token ────────────────────────────────────────

/**
 * Get an AzamPay access token.
 * Token is cached internally for ~55 minutes.
 * Uses AZAMPAY_CLIENT_ID, AZAMPAY_CLIENT_SECRET, AZAMPAY_APP_NAME.
 */
export async function getAccessToken(): Promise<string> {
  // The internal getToken() in client.ts is private — replicate the call here
  // using the same config values so this module is fully self-contained.
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
    console.error("[AzamPay] getAccessToken failed:", text);
    throw new Error("Failed to authenticate with AzamPay");
  }

  const result = await response.json();

  if (!result.data?.accessToken) {
    throw new Error("No access token in AzamPay response");
  }

  return result.data.accessToken as string;
}

// ─── Generate Reference ───────────────────────────

function generateExternalRef(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 9);
  return `VV-${timestamp}-${random}`.slice(0, 30);
}

// ─── Create Payment Request ───────────────────────

/**
 * Create a payment request for a booking via AzamPay MNO checkout.
 * Sends a USSD push to the guest's phone — they enter PIN to confirm.
 *
 * Returns externalId (our reference), transactionId (AzamPay's reference),
 * and optionally a payment_url if AzamPay returns one.
 */
export async function createPaymentRequest(
  booking: BookingPaymentInput
): Promise<PaymentRequestResult> {
  const externalId = generateExternalRef();

  try {
    const result = await mnoCheckout({
      accountNumber: booking.guest_phone,
      amount: booking.total_price.toString(),
      currency: AZAMPAY_CONFIG.currency,
      externalId,
      provider: booking.provider,
      additionalProperties: {
        bookingId: booking.id,
      },
    });

    console.log("[AzamPay] createPaymentRequest response:", JSON.stringify(result));

    return {
      success: result.success,
      externalId,
      transactionId: result.transactionId || undefined,
      // AzamPay MNO does not return a redirect URL — forward-compat field
      payment_url: (result as unknown as Record<string, unknown>).paymentUrl as string | undefined,
      message: result.message || (result.success
        ? "Payment request sent. Please enter your PIN on your phone."
        : "Payment request failed."),
    };
  } catch (err) {
    console.error("[AzamPay] createPaymentRequest error:", err);
    return {
      success: false,
      externalId,
      message: err instanceof Error ? err.message : "Payment service unavailable.",
    };
  }
}

// ─── Verify Transaction ───────────────────────────

/**
 * Verify a payment transaction status directly from AzamPay.
 * Call this inside the callback webhook to confirm the payment is genuine
 * before updating booking status.
 *
 * @param reference  The externalId we sent to AzamPay (our reference)
 * @param bankName   Provider name (e.g. "Mpesa", "CRDB") — required by AzamPay API
 */
export async function verifyTransaction(
  reference: string,
  bankName: string = "Mpesa"
): Promise<VerifyTransactionResult> {
  try {
    const result = await getTransactionStatus(reference, bankName);

    console.log("[AzamPay] verifyTransaction response:", JSON.stringify(result));

    // AzamPay returns statusCode 200 and success=true for completed payments
    const isVerified = result.success === true && result.statusCode === 200;
    const statusStr = result.data?.toLowerCase() ?? "";

    let status: VerifyTransactionResult["status"] = "unknown";
    if (statusStr.includes("success") || statusStr.includes("complet")) {
      status = "success";
    } else if (statusStr.includes("pending") || statusStr.includes("process")) {
      status = "pending";
    } else if (statusStr.includes("fail") || statusStr.includes("error")) {
      status = "failed";
    }

    return { verified: isVerified, status, raw: result };
  } catch (err) {
    console.error("[AzamPay] verifyTransaction error:", err);
    // On verification failure, do NOT confirm the booking — return unverified
    return { verified: false, status: "unknown" };
  }
}
