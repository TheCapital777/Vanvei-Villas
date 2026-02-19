-- ═══════════════════════════════════════════
-- Vanvei Villas — Initial Database Schema
-- ═══════════════════════════════════════════

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ═══════════════════════════════════════════
-- PROFILES (extends Supabase auth.users)
-- ═══════════════════════════════════════════
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text,
  phone         text,
  role          text not null default 'guest' check (role in ('guest', 'admin')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ═══════════════════════════════════════════
-- APARTMENTS
-- ═══════════════════════════════════════════
create table public.apartments (
  id              uuid primary key default uuid_generate_v4(),
  slug            text unique not null,
  name            text not null,
  description     text not null,
  price_per_night integer not null,
  bedrooms        integer not null,
  max_guests      integer not null,
  min_nights      integer not null default 2,
  amenities       text[] not null default '{}',
  gallery_urls    text[] not null default '{}',
  gradient        text not null,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ═══════════════════════════════════════════
-- BLOCKED DATES (admin-set unavailability)
-- ═══════════════════════════════════════════
create table public.blocked_dates (
  id            uuid primary key default uuid_generate_v4(),
  apartment_id  uuid not null references public.apartments(id) on delete cascade,
  start_date    date not null,
  end_date      date not null,
  reason        text,
  created_at    timestamptz not null default now(),
  constraint valid_date_range check (end_date > start_date)
);

create index idx_blocked_dates_apartment on public.blocked_dates(apartment_id, start_date, end_date);

-- ═══════════════════════════════════════════
-- BOOKINGS
-- ═══════════════════════════════════════════
create table public.bookings (
  id              uuid primary key default uuid_generate_v4(),
  apartment_id    uuid not null references public.apartments(id),
  guest_id        uuid not null references public.profiles(id),
  check_in        date not null,
  check_out       date not null,
  num_guests      integer not null,
  total_price     integer not null,
  status          text not null default 'pending'
                    check (status in ('pending', 'confirmed', 'cancelled')),
  guest_name      text not null,
  guest_email     text not null,
  guest_phone     text,
  special_requests text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint valid_booking_range check (check_out > check_in),
  constraint min_stay check ((check_out - check_in) >= 2)
);

create index idx_bookings_apartment_dates on public.bookings(apartment_id, check_in, check_out);
create index idx_bookings_guest on public.bookings(guest_id);
create index idx_bookings_status on public.bookings(status);

-- ═══════════════════════════════════════════
-- AVAILABILITY CHECK FUNCTION
-- ═══════════════════════════════════════════
create or replace function public.is_available(
  p_apartment_id uuid,
  p_check_in date,
  p_check_out date
) returns boolean as $$
begin
  -- Check against existing non-cancelled bookings
  if exists (
    select 1 from public.bookings
    where apartment_id = p_apartment_id
      and status != 'cancelled'
      and check_in < p_check_out
      and check_out > p_check_in
  ) then
    return false;
  end if;

  -- Check against blocked dates
  if exists (
    select 1 from public.blocked_dates
    where apartment_id = p_apartment_id
      and start_date < p_check_out
      and end_date > p_check_in
  ) then
    return false;
  end if;

  return true;
end;
$$ language plpgsql security definer;

-- ═══════════════════════════════════════════
-- UPDATED_AT TRIGGER
-- ═══════════════════════════════════════════
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger set_apartments_updated_at before update on public.apartments
  for each row execute function public.set_updated_at();
create trigger set_bookings_updated_at before update on public.bookings
  for each row execute function public.set_updated_at();
