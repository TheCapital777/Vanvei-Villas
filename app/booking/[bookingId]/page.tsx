import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import BookingConfirmation from "./BookingConfirmation";

interface PageProps {
  params: Promise<{ bookingId: string }>;
}

export default async function BookingPage({ params }: PageProps) {
  const { bookingId } = await params;
  const supabase = await createClient();

  // Check auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch booking
  const { data: booking } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .eq("guest_id", user.id)
    .single();

  if (!booking) notFound();

  // Fetch apartment
  const { data: apartment } = await supabase
    .from("apartments")
    .select("name, slug, bedrooms, max_guests, price_per_night")
    .eq("id", booking.apartment_id)
    .single();

  // Fetch latest payment for this booking (if any)
  const { data: payment } = await supabase
    .from("payments")
    .select("status, provider, completed_at")
    .eq("booking_id", bookingId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return (
    <BookingConfirmation
      booking={booking}
      apartmentName={apartment?.name || "Apartment"}
      paymentStatus={payment?.status || null}
      paymentProvider={payment?.provider || null}
      paidAt={payment?.completed_at || booking.paid_at || null}
    />
  );
}
