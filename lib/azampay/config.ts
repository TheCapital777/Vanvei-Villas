/**
 * AzamPay Configuration
 * ─────────────────────
 * Centralized config for AzamPay payment gateway.
 * Uses environment variables for secrets.
 */

export const AZAMPAY_CONFIG = {
  // Environment
  isSandbox: process.env.AZAMPAY_ENV !== "LIVE",
  env: (process.env.AZAMPAY_ENV || "SANDBOX") as "SANDBOX" | "LIVE",

  // Credentials
  clientId: process.env.AZAMPAY_CLIENT_ID || "",
  clientSecret: process.env.AZAMPAY_CLIENT_SECRET || "",
  appName: process.env.AZAMPAY_APP_NAME || "VanveiVillas",
  apiKey: process.env.AZAMPAY_API_KEY || "",

  // URLs
  authUrl: process.env.AZAMPAY_ENV === "LIVE"
    ? "https://authenticator.azampay.co.tz"
    : "https://authenticator-sandbox.azampay.co.tz",

  checkoutUrl: process.env.AZAMPAY_ENV === "LIVE"
    ? "https://checkout.azampay.co.tz"
    : "https://sandbox.azampay.co.tz",

  // Callback
  callbackUrl: process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/callback`
    : "http://localhost:3000/api/payments/callback",

  // Currency
  currency: "TZS",
} as const;

/** Supported MNO providers with display names */
export const MNO_PROVIDERS = [
  { id: "Mpesa" as const, name: "M-Pesa", icon: "📱", color: "#4CAF50" },
  { id: "Tigo" as const, name: "Tigo Pesa", icon: "📱", color: "#003399" },
  { id: "Airtel" as const, name: "Airtel Money", icon: "📱", color: "#FF0000" },
  { id: "Halopesa" as const, name: "Halopesa", icon: "📱", color: "#FF6600" },
] as const;

/** Supported bank providers */
export const BANK_PROVIDERS = [
  { id: "CRDB" as const, name: "CRDB Bank", icon: "🏦" },
  { id: "NMB" as const, name: "NMB Bank", icon: "🏦" },
] as const;
