"use server";

import { createClient } from "@/lib/supabase/server";
import { getDateRange } from "@/lib/utils/dates";

export async function checkAvailability(
  apartmentId: string,
  checkIn: string,
  checkOut: string
): Promise<{ available: boolean }> {
  const supabase = await createClient();

  const { data } = await supabase.rpc("is_available", {
    p_apartment_id: apartmentId,
    p_check_in: checkIn,
    p_check_out: checkOut,
  });

  return { available: !!data };
}

export async function getMonthAvailability(
  apartmentSlug: string,
  year: number,
  month: number
): Promise<{ bookedDates: string[]; blockedDates: string[] }> {
  const supabase = await createClient();

  // Calculate month range
  const monthStart = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  const monthEnd = `${nextYear}-${String(nextMonth + 1).padStart(2, "0")}-01`;

  // Get apartment ID
  const { data: apartment } = await supabase
    .from("apartments")
    .select("id")
    .eq("slug", apartmentSlug)
    .single();

  if (!apartment) {
    return { bookedDates: [], blockedDates: [] };
  }

  // 30-minute expiry cutoff for pending+unpaid bookings
  // Matches the same rule in the is_available() RPC (Migration 007)
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();

  // Fetch bookings that overlap this month AND should block availability:
  //   - confirmed bookings always block
  //   - pending + paid bookings block
  //   - pending + unpaid bookings block ONLY if created within last 30 min
  //   - cancelled bookings never block
  const { data: bookings } = await supabase
    .from("bookings")
    .select("check_in, check_out, status, payment_status, created_at")
    .eq("apartment_id", apartment.id)
    .neq("status", "cancelled")
    .lt("check_in", monthEnd)
    .gt("check_out", monthStart);

  // Fetch blocked dates that overlap this month
  const { data: blocked } = await supabase
    .from("blocked_dates")
    .select("start_date, end_date")
    .eq("apartment_id", apartment.id)
    .lt("start_date", monthEnd)
    .gt("end_date", monthStart);

  // Convert ranges to individual dates — skip expired pending+unpaid bookings
  const bookedDates: string[] = [];
  if (bookings) {
    for (const b of bookings) {
      // Skip pending+unpaid bookings older than 30 minutes (expired locks)
      if (
        b.status === "pending" &&
        (b.payment_status === "unpaid" || b.payment_status === null) &&
        b.created_at < thirtyMinutesAgo
      ) {
        continue;
      }
      bookedDates.push(...getDateRange(b.check_in, b.check_out));
    }
  }

  const blockedDates: string[] = [];
  if (blocked) {
    for (const b of blocked) {
      blockedDates.push(...getDateRange(b.start_date, b.end_date));
    }
  }

  return { bookedDates, blockedDates };
}
