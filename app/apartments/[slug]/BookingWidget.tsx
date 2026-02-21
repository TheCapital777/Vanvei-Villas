"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";
import DateRangePicker from "@/components/booking/DateRangePicker";
import GuestSelector from "@/components/booking/GuestSelector";
import BookingSummary from "@/components/booking/BookingSummary";
import AuthModal from "@/components/auth/AuthModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import PaymentMethodSelector from "@/components/payment/PaymentMethodSelector";
import MobilePaymentForm from "@/components/payment/MobilePaymentForm";
import BankPaymentForm from "@/components/payment/BankPaymentForm";
import PaymentStatusTracker from "@/components/payment/PaymentStatusTracker";
import { createBooking } from "@/actions/booking";
import { initiateMobilePayment, initiateBankPayment } from "@/actions/payment";
import { formatPrice } from "@/lib/utils/booking";
import type { APARTMENTS } from "@/lib/constants/apartments";
import type { PaymentMethod, MNOProvider, BankProvider } from "@/lib/types/database";

type ApartmentData = (typeof APARTMENTS)[number];

// Booking flow steps
type BookingStep = "dates" | "details" | "payment" | "processing";

export default function BookingWidget({
  apartment,
}: {
  apartment: ApartmentData;
}) {
  const router = useRouter();
  const { isAuthenticated, user, profile } = useAuth();
  const { showToast } = useToast();

  // Step tracking
  const [step, setStep] = useState<BookingStep>("dates");

  // Booking state
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [numGuests, setNumGuests] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Guest info
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [showGuestForm, setShowGuestForm] = useState(false);

  // Booking result (after creation)
  const [bookingId, setBookingId] = useState<string | null>(null);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [paymentProvider, setPaymentProvider] = useState<string>("");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [isPaymentSubmitting, setIsPaymentSubmitting] = useState(false);

  // Availability (populated from Supabase)
  const bookedDates = new Set<string>();
  const blockedDates = new Set<string>();

  // Calculate total
  const nights =
    checkIn && checkOut
      ? Math.round(
          (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;
  const totalPrice = nights * apartment.price;

  const handleDateChange = useCallback(
    (start: string | null, end: string | null) => {
      setCheckIn(start);
      setCheckOut(end);
      if (start && end) {
        setShowGuestForm(true);
        if (profile?.full_name) setGuestName(profile.full_name);
        if (user?.email) setGuestEmail(user.email);
        if (profile?.phone) setGuestPhone(profile.phone);
      } else {
        setShowGuestForm(false);
      }
    },
    [profile, user]
  );

  // ─── Step 1: Create booking, then move to payment ───
  const handleBookNow = async () => {
    if (!checkIn || !checkOut) return;

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (!guestName || !guestEmail) {
      showToast("error", "Please fill in your name and email.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createBooking({
        apartmentSlug: apartment.slug,
        checkIn,
        checkOut,
        numGuests,
        guestName,
        guestEmail,
        guestPhone: guestPhone || undefined,
        specialRequests: specialRequests || undefined,
      });

      if (result.success && result.bookingId) {
        setBookingId(result.bookingId);
        setStep("payment");
        showToast("success", "Booking created! Now complete payment.");
      } else {
        showToast("error", result.error || "Booking failed. Please try again.");
      }
    } catch {
      showToast("error", "Something went wrong. Please try again.");
    }

    setIsSubmitting(false);
  };

  // ─── Step 2a: Handle mobile money payment ───
  const handleMobilePayment = async (phone: string, provider: MNOProvider) => {
    if (!bookingId) return;
    setIsPaymentSubmitting(true);

    try {
      const result = await initiateMobilePayment({
        bookingId,
        phoneNumber: phone,
        provider,
      });

      if (result.success && result.paymentId) {
        // Forward-compat: if AzamPay returns a hosted checkout URL, redirect there
        const anyResult = result as Record<string, unknown>;
        if (anyResult.payment_url) {
          window.location.href = anyResult.payment_url as string;
          return;
        }
        setPaymentId(result.paymentId);
        setPaymentProvider(provider);
        setPaymentMessage(result.message || "Check your phone for the payment prompt.");
        setStep("processing");
      } else {
        showToast("error", result.error || "Payment failed.");
      }
    } catch {
      showToast("error", "Payment service error. Please try again.");
    }

    setIsPaymentSubmitting(false);
  };

  // ─── Step 2b: Handle bank payment ───
  const handleBankPayment = async (account: string, provider: BankProvider, otp: string) => {
    if (!bookingId) return;
    setIsPaymentSubmitting(true);

    try {
      const result = await initiateBankPayment({
        bookingId,
        accountNumber: account,
        provider,
        otp,
      });

      if (result.success && result.paymentId) {
        // Forward-compat: if AzamPay returns a hosted checkout URL, redirect there
        const anyResult = result as Record<string, unknown>;
        if (anyResult.payment_url) {
          window.location.href = anyResult.payment_url as string;
          return;
        }
        setPaymentId(result.paymentId);
        setPaymentProvider(provider);
        setPaymentMessage(result.message || "Processing your bank payment...");
        setStep("processing");
      } else {
        showToast("error", result.error || "Payment failed.");
      }
    } catch {
      showToast("error", "Payment service error. Please try again.");
    }

    setIsPaymentSubmitting(false);
  };

  const inputClasses =
    "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 focus:border-transparent transition-all duration-300 text-sm";

  return (
    <>
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">
              {formatPrice(apartment.price)}
            </span>
            <span className="text-white/40 text-sm">/ night</span>
          </div>
          <p className="text-white/30 text-xs mt-1">Minimum 2 nights</p>
        </div>

        {/* ── STEP: Processing (payment status tracker) ── */}
        {step === "processing" && paymentId && bookingId && (
          <div className="p-6">
            <PaymentStatusTracker
              paymentId={paymentId}
              bookingId={bookingId}
              provider={paymentProvider}
              message={paymentMessage}
            />
          </div>
        )}

        {/* ── STEP: Payment method selection ── */}
        {step === "payment" && (
          <div className="p-6 space-y-6">
            {/* Step header */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep("dates")}
                className="text-white/40 hover:text-white/70 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h3 className="text-white font-bold text-sm">Complete Payment</h3>
                <p className="text-white/40 text-xs">Choose how you want to pay</p>
              </div>
            </div>

            {/* Booking summary mini */}
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <div className="flex justify-between text-xs">
                <span className="text-white/50">{apartment.name}</span>
                <span className="text-white/50">{nights} night{nights !== 1 ? "s" : ""}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-white/50 text-xs">Total</span>
                <span className="text-[var(--color-gold)] font-bold">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>

            {/* Payment method selector */}
            <PaymentMethodSelector
              selected={paymentMethod}
              onSelect={setPaymentMethod}
            />

            {/* Payment form based on method */}
            {paymentMethod === "mno" && (
              <MobilePaymentForm
                amount={totalPrice}
                onSubmit={handleMobilePayment}
                isSubmitting={isPaymentSubmitting}
              />
            )}

            {paymentMethod === "bank" && (
              <BankPaymentForm
                amount={totalPrice}
                onSubmit={handleBankPayment}
                isSubmitting={isPaymentSubmitting}
              />
            )}

            {/* Skip payment option */}
            <button
              onClick={() => {
                if (bookingId) router.push(`/booking/${bookingId}`);
              }}
              className="w-full text-center text-xs text-white/30 hover:text-white/50 transition-colors py-2"
            >
              Pay later (booking will remain pending)
            </button>
          </div>
        )}

        {/* ── STEP: Date selection & Guest details ── */}
        {(step === "dates" || step === "details") && (
          <>
            {/* Calendar */}
            <div className="p-6 border-b border-white/10">
              <p className="text-sm font-medium text-white/70 mb-3">
                Select Dates
              </p>
              <DateRangePicker
                bookedDates={bookedDates}
                blockedDates={blockedDates}
                minNights={2}
                checkIn={checkIn}
                checkOut={checkOut}
                onDateChange={handleDateChange}
              />
            </div>

            {/* Guest selector + form */}
            {checkIn && checkOut && (
              <div className="p-6 border-b border-white/10 space-y-4">
                <GuestSelector
                  value={numGuests}
                  maxGuests={apartment.guests}
                  onChange={setNumGuests}
                />

                {showGuestForm && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Your full name"
                        required
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1">
                        Phone (optional)
                      </label>
                      <input
                        type="tel"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="+255 XXX XXX XXX"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1">
                        Special Requests (optional)
                      </label>
                      <textarea
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        placeholder="Any special requests..."
                        rows={3}
                        className={`${inputClasses} resize-none`}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Summary */}
            {checkIn && checkOut && (
              <div className="p-6 border-b border-white/10">
                <BookingSummary
                  apartmentName={apartment.name}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  pricePerNight={apartment.price}
                  numGuests={numGuests}
                />
              </div>
            )}

            {/* CTA */}
            <div className="p-6">
              {checkIn && checkOut ? (
                <button
                  onClick={handleBookNow}
                  disabled={isSubmitting}
                  className="w-full bg-[var(--color-gold)] text-black font-bold py-3.5 rounded-full hover:bg-[var(--color-gold-dark)] transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <LoadingSpinner size="sm" />
                  ) : isAuthenticated ? (
                    "Book & Pay"
                  ) : (
                    "Sign In to Book"
                  )}
                </button>
              ) : (
                <p className="text-center text-white/30 text-sm">
                  Select your dates to see pricing
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          showToast("success", "Signed in! You can now complete your booking.");
        }}
      />
    </>
  );
}
