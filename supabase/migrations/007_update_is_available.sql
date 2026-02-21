-- ============================================
-- Migration 007: Update is_available RPC
-- ============================================
-- Prevents fake booking locks by ignoring pending+unpaid bookings
-- that are older than 30 minutes. A guest who starts a booking but
-- doesn't pay within 30 minutes should free up those dates.
--
-- Rule:
--   A booking blocks availability if:
--     status = 'confirmed'
--     OR (status = 'pending' AND payment_status = 'paid')
--     OR (status = 'pending' AND payment_status = 'unpaid' AND created_at > NOW() - 30 min)
--   In all other cases (cancelled, or pending+unpaid+expired) → do NOT block.

CREATE OR REPLACE FUNCTION public.is_available(
  p_apartment_id uuid,
  p_check_in date,
  p_check_out date
) RETURNS boolean AS $$
DECLARE
  v_expiry_cutoff timestamptz;
BEGIN
  -- 30-minute window for pending unpaid bookings
  v_expiry_cutoff := NOW() - INTERVAL '30 minutes';

  -- Check against existing bookings that should block availability
  IF EXISTS (
    SELECT 1 FROM public.bookings
    WHERE apartment_id = p_apartment_id
      AND check_in < p_check_out
      AND check_out > p_check_in
      AND status != 'cancelled'
      AND (
        -- Confirmed bookings always block
        status = 'confirmed'
        OR
        -- Pending bookings that have been paid block
        (status = 'pending' AND payment_status = 'paid')
        OR
        -- Pending unpaid bookings only block if created within last 30 min
        (status = 'pending' AND payment_status = 'unpaid' AND created_at > v_expiry_cutoff)
        OR
        -- Pending bookings with NULL payment_status (legacy rows) block if recent
        (status = 'pending' AND payment_status IS NULL AND created_at > v_expiry_cutoff)
      )
  ) THEN
    RETURN false;
  END IF;

  -- Check against admin-blocked dates
  IF EXISTS (
    SELECT 1 FROM public.blocked_dates
    WHERE apartment_id = p_apartment_id
      AND start_date < p_check_out
      AND end_date > p_check_in
  ) THEN
    RETURN false;
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
