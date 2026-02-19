"use server";

import { createClient } from "@/lib/supabase/server";
import { mnoCheckout, bankCheckout } from "@/lib/azampay/client";
import { AZAMPAY_CONFIG } from "@/lib/azampay/config";
import type { MNOProvider, BankProvider } from "@/lib/types/database";

// ─── Generate unique external ID ──────────────────
function generateExternalId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 10);
  return `VV-${timestamp}-${random}`.slice(0, 30);
}

// ─── Format phone number for AzamPay ──────────────
function formatPhoneNumber(phone: string): string {
  // Remove spaces, dashes, plus
  let cleaned = phone.replace(/[\s\-+]/g, "");
  // Convert +255 or 255 prefix to 0
  if (cleaned.startsWith("255")) {
    cleaned = "0" + cleaned.slice(3);
  }
  return cleaned;
}

// ─── Initiate Mobile Money Payment ────────────────

interface MNOPaymentInput {
  bookingId: string;
  phoneNumber: string;
  provider: MNOProvider;
}

export async function initiateMobilePayment(input: MNOPaymentInput) {
  const supabase = await createClient();

  // 1. Verify auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be signed in." };
  }

  // 2. Get booking
  const { data: booking } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", input.bookingId)
    .eq("guest_id", user.id)
    .single();

  if (!booking) {
    return { success: false, error: "Booking not found." };
  }

  if (booking.status === "confirmed") {
    return { success: false, error: "Booking is already confirmed." };
  }

  if (booking.status === "cancelled") {
    return { success: false, error: "Booking has been cancelled." };
  }

  // 3. Generate external ID
  const externalId = generateExternalId();
  const formattedPhone = formatPhoneNumber(input.phoneNumber);

  // 4. Create payment record
  const { data: payment, error: insertError } = await supabase
    .from("payments")
    .insert({
      booking_id: input.bookingId,
      guest_id: user.id,
      provider: input.provider,
      payment_method: "mno",
      account_number: formattedPhone,
      amount: booking.total_price,
      currency: AZAMPAY_CONFIG.currency,
      external_id: externalId,
      status: "initiated",
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("Payment insert error:", insertError);
    return { success: false, error: "Failed to create payment record." };
  }

  // 5. Call AzamPay MNO Checkout
  try {
    const result = await mnoCheckout({
      accountNumber: formattedPhone,
      amount: booking.total_price.toString(),
      currency: AZAMPAY_CONFIG.currency,
      externalId,
      provider: input.provider,
      additionalProperties: {
        bookingId: input.bookingId,
        paymentId: payment.id,
      },
    });

    if (result.success) {
      // Update payment with transaction ID and set status to pending
      await supabase
        .from("payments")
        .update({
          transaction_id: result.transactionId,
          status: "pending",
        })
        .eq("id", payment.id);

      return {
        success: true,
        paymentId: payment.id,
        message: "Payment request sent to your phone. Please enter your PIN to confirm.",
      };
    } else {
      // Update payment as failed
      await supabase
        .from("payments")
        .update({
          status: "failed",
          failure_reason: result.message,
        })
        .eq("id", payment.id);

      return {
        success: false,
        error: result.message || "Payment request failed. Please try again.",
      };
    }
  } catch (err) {
    // Update payment as failed
    await supabase
      .from("payments")
      .update({
        status: "failed",
        failure_reason: err instanceof Error ? err.message : "Unknown error",
      })
      .eq("id", payment.id);

    return {
      success: false,
      error: "Payment service unavailable. Please try again later.",
    };
  }
}

// ─── Initiate Bank Payment ────────────────────────

interface BankPaymentInput {
  bookingId: string;
  accountNumber: string;
  provider: BankProvider;
  otp: string;
}

export async function initiateBankPayment(input: BankPaymentInput) {
  const supabase = await createClient();

  // 1. Verify auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be signed in." };
  }

  // 2. Get booking
  const { data: booking } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", input.bookingId)
    .eq("guest_id", user.id)
    .single();

  if (!booking) {
    return { success: false, error: "Booking not found." };
  }

  if (booking.status === "confirmed") {
    return { success: false, error: "Booking is already confirmed." };
  }

  // 3. Generate reference
  const externalId = generateExternalId();

  // 4. Create payment record
  const { data: payment, error: insertError } = await supabase
    .from("payments")
    .insert({
      booking_id: input.bookingId,
      guest_id: user.id,
      provider: input.provider,
      payment_method: "bank",
      account_number: input.accountNumber,
      amount: booking.total_price,
      currency: AZAMPAY_CONFIG.currency,
      external_id: externalId,
      status: "initiated",
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("Payment insert error:", insertError);
    return { success: false, error: "Failed to create payment record." };
  }

  // 5. Call AzamPay Bank Checkout
  try {
    const merchantPhone = process.env.AZAMPAY_MERCHANT_PHONE || "";
    const merchantAccount = process.env.AZAMPAY_MERCHANT_ACCOUNT || "";

    const result = await bankCheckout({
      amount: booking.total_price.toString(),
      currencyCode: AZAMPAY_CONFIG.currency,
      merchantAccountNumber: merchantAccount,
      merchantMobileNumber: merchantPhone,
      merchantName: "Vanvei Villas",
      otp: input.otp,
      provider: input.provider,
      referenceId: externalId,
      additionalProperties: {
        bookingId: input.bookingId,
        paymentId: payment.id,
      },
    });

    if (result.success) {
      await supabase
        .from("payments")
        .update({
          transaction_id: result.transactionId,
          status: "pending",
        })
        .eq("id", payment.id);

      return {
        success: true,
        paymentId: payment.id,
        message: "Bank payment initiated. Processing your payment...",
      };
    } else {
      await supabase
        .from("payments")
        .update({
          status: "failed",
          failure_reason: result.message,
        })
        .eq("id", payment.id);

      return {
        success: false,
        error: result.message || "Bank payment failed. Please try again.",
      };
    }
  } catch (err) {
    await supabase
      .from("payments")
      .update({
        status: "failed",
        failure_reason: err instanceof Error ? err.message : "Unknown error",
      })
      .eq("id", payment.id);

    return {
      success: false,
      error: "Payment service unavailable. Please try again later.",
    };
  }
}

// ─── Check Payment Status ─────────────────────────

export async function checkPaymentStatus(paymentId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated." };
  }

  const { data: payment } = await supabase
    .from("payments")
    .select("*")
    .eq("id", paymentId)
    .eq("guest_id", user.id)
    .single();

  if (!payment) {
    return { success: false, error: "Payment not found." };
  }

  return {
    success: true,
    status: payment.status,
    transactionId: payment.transaction_id,
    provider: payment.provider,
    amount: payment.amount,
    completedAt: payment.completed_at,
    failureReason: payment.failure_reason,
  };
}
