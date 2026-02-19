export type BookingStatus = "pending" | "confirmed" | "cancelled";
export type UserRole = "guest" | "admin";

export interface Apartment {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_per_night: number;
  bedrooms: number;
  max_guests: number;
  min_nights: number;
  amenities: string[];
  gallery_urls: string[];
  gradient: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  apartment_id: string;
  guest_id: string;
  check_in: string;
  check_out: string;
  num_guests: number;
  total_price: number;
  status: BookingStatus;
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
  special_requests: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface BlockedDateRange {
  id: string;
  apartment_id: string;
  start_date: string;
  end_date: string;
  reason: string | null;
  created_at: string;
}

// ─── Payment Types ────────────────────────────────
export type PaymentMethod = "mno" | "bank";
export type PaymentStatus = "initiated" | "pending" | "completed" | "failed";
export type MNOProvider = "Mpesa" | "Tigo" | "Airtel" | "Halopesa";
export type BankProvider = "CRDB" | "NMB";
export type PaymentProvider = MNOProvider | BankProvider;

export interface Payment {
  id: string;
  booking_id: string;
  guest_id: string;
  provider: PaymentProvider;
  payment_method: PaymentMethod;
  account_number: string;
  amount: number;
  currency: string;
  external_id: string;
  transaction_id: string | null;
  status: PaymentStatus;
  failure_reason: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}
