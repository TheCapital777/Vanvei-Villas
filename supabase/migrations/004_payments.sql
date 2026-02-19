-- ============================================
-- Migration 004: Payments (AzamPay Integration)
-- ============================================

-- 1. Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES auth.users(id),

  -- AzamPay fields
  provider TEXT NOT NULL,          -- Mpesa, Tigo, Airtel, Halopesa, Azampesa, CRDB, NMB
  payment_method TEXT NOT NULL,    -- mno | bank
  account_number TEXT NOT NULL,    -- phone number or bank account

  -- Amounts
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'TZS',

  -- AzamPay references
  external_id TEXT UNIQUE NOT NULL,       -- our reference sent to AzamPay
  transaction_id TEXT,                     -- AzamPay's transaction ID (from response)

  -- Status
  status TEXT NOT NULL DEFAULT 'initiated', -- initiated | pending | completed | failed
  failure_reason TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 2. Add payment_id reference to bookings
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS payment_id UUID REFERENCES payments(id),
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_external_id ON payments(external_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_guest_id ON payments(guest_id);

-- 4. Updated_at trigger
CREATE TRIGGER set_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- 5. RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Guests can view their own payments
CREATE POLICY "Guests can view own payments"
  ON payments FOR SELECT
  USING (auth.uid() = guest_id);

-- Guests can insert their own payments
CREATE POLICY "Guests can insert own payments"
  ON payments FOR INSERT
  WITH CHECK (auth.uid() = guest_id);

-- Service role can update any payment (for webhook callbacks)
-- Note: Supabase service role bypasses RLS by default

-- Allow guests to see updated status on their payments
CREATE POLICY "Guests can see payment updates"
  ON payments FOR UPDATE
  USING (auth.uid() = guest_id)
  WITH CHECK (auth.uid() = guest_id);
