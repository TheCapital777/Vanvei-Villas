import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyTransaction } from "@/lib/azampay";

/**
 * AzamPay Payment Callback Webhook
 * ─────────────────────────────────
 * AzamPay calls this endpoint when a payment is completed or fails.
 *
 * Security:
 * - Uses service role key to bypass RLS (admin client)
 * - Calls verifyTransaction() to confirm payment directly with AzamPay
 *   before trusting the callback payload (prevents spoofed callbacks)
 * - Deduplication: skips if payment already completed
 *
 * Production safety checklist before going live:
 * - Switch AZAMPAY_ENV=LIVE in Netlify env vars
 * - Add HMAC signature verification via x-callback-signature header
 * - Ensure callback URL uses HTTPS (automatic on Netlify)
 * - All payment responses are logged below for audit trail
 */

// ─── Admin Supabase client (bypasses RLS) ─────────

function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, serviceRoleKey);
}

// ─── POST — Main callback handler ─────────────────

export async function POST(request: NextRequest) {
  const receivedAt = new Date().toISOString();

  try {
    const body = await request.json();

    // Log full callback payload for debugging and audit trail
    console.log("[AzamPay Callback] Received at:", receivedAt);
    console.log("[AzamPay Callback] Payload:", JSON.stringify(body));

    const {
      transactionId,
      externalId,
      transactionstatus,
      message,
      utilityref,
      operator,
      reference,
    } = body;

    // Determine the external reference (field name varies by provider)
    const extId = externalId || utilityref || reference;

    if (!extId) {
      console.error("[AzamPay Callback] Missing external reference in payload:", body);
      // Return 200 so AzamPay doesn't keep retrying a genuinely bad payload
      return NextResponse.json({ status: "ignored", reason: "missing_reference" });
    }

    const supabase = createAdminClient();

    // ── Find payment by external_id ──────────────
    const { data: payment, error: findError } = await supabase
      .from("payments")
      .select("id, booking_id, status, provider")
      .eq("external_id", extId)
      .single();

    if (findError || !payment) {
      console.error("[AzamPay Callback] Payment not found for external_id:", extId, findError);
      return NextResponse.json({ status: "ignored", reason: "payment_not_found" });
    }

    // ── Deduplication guard ───────────────────────
    if (payment.status === "completed") {
      console.log("[AzamPay Callback] Already completed — skipping:", payment.id);
      return NextResponse.json({ status: "already_completed" });
    }

    // ── Determine success from callback payload ───
    const callbackSuccess =
      transactionstatus === "success" ||
      transactionstatus === "completed" ||
      transactionstatus === true;

    // ── Verify with AzamPay API (prevents spoofed callbacks) ──
    let verified = false;
    if (callbackSuccess) {
      const providerName = operator || payment.provider || "Mpesa";
      const verification = await verifyTransaction(extId, providerName);
      verified = verification.verified;

      console.log("[AzamPay Callback] Verification result:", JSON.stringify(verification));

      // In SANDBOX mode, AzamPay's verification endpoint may not confirm
      // test transactions — fall back to trusting the callback payload
      if (!verified && process.env.AZAMPAY_ENV !== "LIVE") {
        console.warn("[AzamPay Callback] Sandbox mode: verification inconclusive, trusting callback payload");
        verified = true;
      }
    }

    const isSuccess = callbackSuccess && verified;
    const txId = transactionId || extId;

    if (isSuccess) {
      // 1. Update payment → completed
      await supabase
        .from("payments")
        .update({
          status: "completed",
          transaction_id: txId,
          completed_at: new Date().toISOString(),
        })
        .eq("id", payment.id);

      // 2. Update booking → confirmed + populate new payment columns (Migration 006)
      await supabase
        .from("bookings")
        .update({
          status: "confirmed",
          payment_id: payment.id,
          paid_at: new Date().toISOString(),
          payment_status: "paid",
          payment_reference: txId,
          payment_method: operator || payment.provider || null,
        })
        .eq("id", payment.booking_id);

      console.log(
        `[AzamPay Callback] ✅ Payment ${payment.id} completed — booking ${payment.booking_id} confirmed.`
      );
    } else {
      // Payment failed
      await supabase
        .from("payments")
        .update({
          status: "failed",
          failure_reason: message || "Payment was not successful",
          transaction_id: txId || null,
        })
        .eq("id", payment.id);

      // Update booking payment_status to failed (booking stays pending)
      await supabase
        .from("bookings")
        .update({
          payment_status: "failed",
        })
        .eq("id", payment.booking_id);

      console.log(`[AzamPay Callback] ❌ Payment ${payment.id} failed:`, message || "no message");
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("[AzamPay Callback] Processing error:", error);
    // Always return 200 to prevent AzamPay from retrying indefinitely
    return NextResponse.json({ status: "error_logged" });
  }
}

// ─── GET — Health check ────────────────────────────

export async function GET() {
  return NextResponse.json({
    status: "active",
    endpoint: "Vanvei Villas — AzamPay payment callback",
  });
}
