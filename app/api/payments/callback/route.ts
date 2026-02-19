import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * AzamPay Payment Callback Webhook
 * ─────────────────────────────────
 * AzamPay calls this endpoint when a payment is completed or fails.
 * Uses service role key to bypass RLS and update payment + booking status.
 */

// Create admin client (bypasses RLS)
function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient(supabaseUrl, serviceRoleKey);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // AzamPay callback payload fields (may vary — log for debugging)
    console.log("AzamPay callback received:", JSON.stringify(body));

    const {
      transactionId,
      externalId,
      transactionstatus,
      message,
      utilityref,
      operator,
      reference,
    } = body;

    // Determine the external reference
    const extId = externalId || utilityref || reference;

    if (!extId) {
      console.error("No external reference in callback:", body);
      return NextResponse.json(
        { error: "Missing external reference" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Find the payment by external_id
    const { data: payment, error: findError } = await supabase
      .from("payments")
      .select("id, booking_id, status")
      .eq("external_id", extId)
      .single();

    if (findError || !payment) {
      console.error("Payment not found for external_id:", extId, findError);
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    // Already completed? Skip.
    if (payment.status === "completed") {
      return NextResponse.json({ status: "already_completed" });
    }

    // Determine success/failure
    const isSuccess =
      transactionstatus === "success" ||
      transactionstatus === "completed" ||
      transactionstatus === true;

    if (isSuccess) {
      // 1. Update payment → completed
      await supabase
        .from("payments")
        .update({
          status: "completed",
          transaction_id: transactionId || payment.id,
          completed_at: new Date().toISOString(),
        })
        .eq("id", payment.id);

      // 2. Update booking → confirmed
      await supabase
        .from("bookings")
        .update({
          status: "confirmed",
          payment_id: payment.id,
          paid_at: new Date().toISOString(),
        })
        .eq("id", payment.booking_id);

      console.log(`Payment ${payment.id} completed, booking ${payment.booking_id} confirmed.`);
    } else {
      // Payment failed
      await supabase
        .from("payments")
        .update({
          status: "failed",
          failure_reason: message || "Payment was not successful",
          transaction_id: transactionId || null,
        })
        .eq("id", payment.id);

      console.log(`Payment ${payment.id} failed:`, message);
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Callback processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// AzamPay may also send GET requests for verification
export async function GET() {
  return NextResponse.json({ status: "Vanvei Villas payment callback active" });
}
