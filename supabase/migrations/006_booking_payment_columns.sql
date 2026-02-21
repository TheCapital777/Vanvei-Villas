-- ============================================
-- Migration 006: Booking Payment Columns
-- ============================================
-- Adds denormalized payment fields to bookings for fast single-row reads.
-- The payments table still holds full detail; these columns give a quick
-- payment state snapshot directly on the booking.

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS payment_reference TEXT,
  ADD COLUMN IF NOT EXISTS payment_status TEXT
    NOT NULL DEFAULT 'unpaid'
    CHECK (payment_status IN ('unpaid', 'paid', 'failed')),
  ADD COLUMN IF NOT EXISTS payment_method TEXT;

-- Index for availability expiry query (pending + unpaid + created_at)
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status
  ON bookings(payment_status, status, created_at);

COMMENT ON COLUMN bookings.payment_reference IS
  'AzamPay transaction ID populated after payment confirmation';
COMMENT ON COLUMN bookings.payment_status IS
  'unpaid (default) | paid (confirmed by callback) | failed';
COMMENT ON COLUMN bookings.payment_method IS
  'Provider used: Mpesa, Tigo, Airtel, Halopesa, CRDB, NMB';
