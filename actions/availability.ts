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

  // Fetch bookings that overlap this month
  const { data: bookings } = await supabase
    .from("bookings")
    .select("check_in, check_out")
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

  // Convert ranges to individual dates
  const bookedDates: string[] = [];
  if (bookings) {
    for (const b of bookings) {
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
