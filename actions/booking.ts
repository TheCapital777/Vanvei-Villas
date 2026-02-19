"use server";

import { createClient } from "@/lib/supabase/server";
import { APARTMENTS } from "@/lib/constants/apartments";

interface CreateBookingInput {
  apartmentSlug: string;
  checkIn: string;
  checkOut: string;
  numGuests: number;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  specialRequests?: string;
}

export async function createBooking(input: CreateBookingInput) {
  const supabase = await createClient();

  // 1. Verify user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be signed in to book." };
  }

  // 2. Find the apartment
  const apartment = APARTMENTS.find((a) => a.slug === input.apartmentSlug);
  if (!apartment) {
    return { success: false, error: "Apartment not found." };
  }

  // 3. Validate dates
  const today = new Date().toISOString().split("T")[0];
  if (input.checkIn < today) {
    return { success: false, error: "Check-in date cannot be in the past." };
  }
  if (input.checkOut <= input.checkIn) {
    return { success: false, error: "Check-out must be after check-in." };
  }

  const nights = Math.round(
    (new Date(input.checkOut).getTime() - new Date(input.checkIn).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  if (nights < 2) {
    return { success: false, error: "Minimum stay is 2 nights." };
  }

  // 4. Validate guests
  if (input.numGuests < 1 || input.numGuests > apartment.guests) {
    return {
      success: false,
      error: `Maximum ${apartment.guests} guests allowed.`,
    };
  }

  // 5. Get apartment ID from database
  const { data: dbApartment } = await supabase
    .from("apartments")
    .select("id")
    .eq("slug", input.apartmentSlug)
    .single();

  if (!dbApartment) {
    return {
      success: false,
      error: "Apartment not found in database. Please contact support.",
    };
  }

  // 6. Check availability via database function
  const { data: available } = await supabase.rpc("is_available", {
    p_apartment_id: dbApartment.id,
    p_check_in: input.checkIn,
    p_check_out: input.checkOut,
  });

  if (!available) {
    return {
      success: false,
      error: "These dates are no longer available. Please select different dates.",
    };
  }

  // 7. Calculate total
  const totalPrice = nights * apartment.price;

  // 8. Create booking
  const { data: booking, error: insertError } = await supabase
    .from("bookings")
    .insert({
      apartment_id: dbApartment.id,
      guest_id: user.id,
      check_in: input.checkIn,
      check_out: input.checkOut,
      num_guests: input.numGuests,
      total_price: totalPrice,
      status: "pending",
      guest_name: input.guestName,
      guest_email: input.guestEmail,
      guest_phone: input.guestPhone || null,
      special_requests: input.specialRequests || null,
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("Booking insert error:", insertError);
    return { success: false, error: "Failed to create booking. Please try again." };
  }

  return { success: true, bookingId: booking.id };
}

export async function cancelBooking(bookingId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated." };
  }

  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId)
    .eq("guest_id", user.id);

  if (error) {
    return { success: false, error: "Failed to cancel booking." };
  }

  return { success: true };
}
