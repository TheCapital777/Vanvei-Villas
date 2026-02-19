-- ═══════════════════════════════════════════
-- Row Level Security Policies
-- ═══════════════════════════════════════════

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.apartments enable row level security;
alter table public.bookings enable row level security;
alter table public.blocked_dates enable row level security;

-- APARTMENTS: readable by everyone
create policy "Apartments are publicly readable"
  on public.apartments for select using (true);

-- PROFILES: users read/update own
create policy "Users can read own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- BOOKINGS: guests see own, guests can create own
create policy "Guests can read own bookings"
  on public.bookings for select using (auth.uid() = guest_id);
create policy "Guests can create bookings"
  on public.bookings for insert with check (auth.uid() = guest_id);

-- BLOCKED_DATES: readable by everyone (needed for calendar)
create policy "Blocked dates are publicly readable"
  on public.blocked_dates for select using (true);
