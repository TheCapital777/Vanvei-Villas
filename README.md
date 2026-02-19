# Vanvei Villas — Architectural Authority

> This document is the single source of truth for all architectural and scope decisions.
> All development must align with this file. If it's not here, it's not in scope.

---

## 1. Project Purpose

**Vanvei Villas** is a premium apartment rental brand in Dar es Salaam, Tanzania (Tabata Kinyerezi) offering direct booking through its own website.

### This is NOT:
- A marketplace
- A multi-vendor platform
- A SaaS PMS product

### This IS:
- A single-brand luxury apartment website
- With direct booking functionality
- With admin dashboard
- With guest portal
- With concierge add-ons

---

## 2. Tech Stack

| Layer | Technology |
|----------|-------------------------------|
| Frontend | Next.js (App Router) |
| Styling | TailwindCSS |
| Backend | Supabase (PostgreSQL + Auth) |
| Payments | AzamPay (M-Pesa, Tigo Pesa, Airtel, CRDB, NMB) |
| Hosting | Domain TBD |

---

## 3. Core Modules

1. **Public Website** — Marketing pages, apartment listings, gallery
2. **Booking Engine** — Real-time availability, date selection, checkout
3. **Guest Portal** — View bookings, request add-ons, manage profile
4. **Admin Dashboard** — Manage bookings, availability, revenue overview
5. **Concierge Add-ons** — Extra services guests can request (e.g. airport pickup, cleaning)

---

## 4. Booking Rules

- Real-time availability check
- Minimum stay logic (configurable per apartment)
- AzamPay payment required to confirm booking (Mobile Money or Bank)
- **Booking status flow:**
  - `pending` — Booking created, awaiting payment
  - `confirmed` — Payment received, booking locked in
  - `cancelled` — Booking cancelled by guest or admin

---

## 5. User Roles

### Guest
- Book apartment
- View booking
- Request add-ons

### Admin
- View bookings
- Confirm / cancel bookings
- View revenue
- Manage availability

---

## 6. Non-Goals

- No AI pricing engine (Phase 1)
- No multi-property scaling
- No PMS integrations
- No owner dashboards

---

## 7. Phase Plan

| Phase | Focus | Status |
|-------|----------------|--------|
| 1 | UI Layout | Done |
| 2 | Booking Logic | Done |
| 3 | Payments (AzamPay) | Done |
| 4 | Dashboard | Next |
| 5 | Polishing | — |

---

## 8. Implementation Details

### Phase 1: UI Layout (Complete)
Single-page luxury marketing site with dark theme (#0a0a0a), gold accent (#b37212).
- Navbar, Hero, Apartments, About, Contact, Footer
- Motion (Framer Motion) v12.34 with LUXURY_EASE cubic-bezier [0.25, 0.1, 0.25, 1]
- No bounce/elastic/spring animations — luxury feel only
- Fully responsive (mobile-first)

### Phase 2: Booking Logic (Complete)
Full booking engine with Supabase backend.

**Database (Supabase PostgreSQL):**
- Connected to: `https://azyjbkvapxhvskexhgii.supabase.co`
- 4 tables: `profiles`, `apartments`, `bookings`, `blocked_dates`
- `is_available()` RPC function for overlap checking
- RLS enabled on all tables
- Migrations: `001_initial_schema.sql`, `002_seed_apartments.sql`, `003_rls_policies.sql`

**Auth Layer:**
- `components/auth/AuthProvider.tsx` — User context (user, profile, isAuthenticated)
- `components/auth/AuthModal.tsx` — Inline login/signup modal (no page redirect during booking)
- `components/auth/UserMenu.tsx` — Navbar dropdown with initials avatar
- `actions/auth.ts` — signUp, signIn, signOut server actions
- `app/auth/login/`, `app/auth/signup/`, `app/auth/callback/` — Standalone auth pages

**Apartment Detail Pages:**
- `app/apartments/[slug]/page.tsx` — Server component with generateStaticParams
- `app/apartments/[slug]/ApartmentDetail.tsx` — Hero banner, amenities grid, quick facts
- `app/apartments/[slug]/BookingWidget.tsx` — Calendar → guests → form → summary → payment

**Custom Calendar (no external library):**
- `components/booking/DateRangePicker.tsx` — Month navigation, date range selection
- `components/booking/CalendarGrid.tsx` — Month grid with weekday headers
- `components/booking/CalendarDay.tsx` — Day cell with status styling (available/booked/blocked/selected/in-range)

**Booking Flow:**
- `components/booking/GuestSelector.tsx` — +/- buttons with max validation
- `components/booking/BookingSummary.tsx` — Price breakdown card
- `components/booking/BookingStatusBadge.tsx` — pending (gold), confirmed (green), cancelled (red)
- `actions/booking.ts` — createBooking, cancelBooking (double availability check)
- `actions/availability.ts` — checkAvailability, getMonthAvailability

**UI Components:**
- `components/ui/Modal.tsx` — Portal modal with LUXURY_EASE animation
- `components/ui/LoadingSpinner.tsx` — Gold spinning circle (sm/md/lg)
- `components/ui/Toast.tsx` — ToastProvider with success/error, auto-dismiss 5s

**Shared Data:**
- `lib/constants/apartments.ts` — Single source of truth for 3 apartments (prices in TZS)
- `lib/types/database.ts` — TypeScript types for all tables
- `lib/utils/dates.ts` — Date formatting utilities
- `lib/utils/availability.ts` — Date range overlap checks
- `lib/utils/booking.ts` — Price calculation, formatPrice (TZS)

**Apartments (TZS pricing):**
| Apartment | Slug | Price/Night | Beds | Max Guests |
|-----------|------|-------------|------|------------|
| The Pearl Suite | pearl-suite | TZS 300,000 | 1 | 2 |
| The Coral Residence | coral-residence | TZS 450,000 | 2 | 4 |
| The Gold Penthouse | gold-penthouse | TZS 700,000 | 3 | 6 |

### Phase 3: Payments — AzamPay (Complete)
Tanzania-native payment integration via AzamPay. No Stripe.

**Payment Flow:**
1. Guest selects dates → fills details → clicks "Book & Pay"
2. Booking created with `pending` status
3. Choose payment method: **Mobile Money** or **Bank**
4. **Mobile Money (MNO):** Select provider (M-Pesa/Tigo Pesa/Airtel/Halopesa) → enter phone → USSD push sent → enter PIN on phone
5. **Bank:** Select bank (CRDB/NMB) → enter account + OTP → payment processes
6. Status tracker polls every 5 seconds for confirmation
7. AzamPay webhook confirms payment → booking auto-confirmed
8. Redirect to confirmation page with green "Paid" badge

**AzamPay Server Integration:**
- `lib/azampay/config.ts` — URLs, credentials, provider lists, sandbox/live toggle
- `lib/azampay/client.ts` — Token auth (cached), MNO checkout, bank checkout, transaction status
- `actions/payment.ts` — initiateMobilePayment, initiateBankPayment, checkPaymentStatus

**Payment Components:**
- `components/payment/PaymentMethodSelector.tsx` — Mobile Money vs Bank radio cards
- `components/payment/MobilePaymentForm.tsx` — Provider grid + phone input + pay button
- `components/payment/BankPaymentForm.tsx` — Bank selector + account + OTP inputs
- `components/payment/PaymentStatusTracker.tsx` — Animated polling UI with dots, success/fail states

**Webhook:**
- `app/api/payments/callback/route.ts` — POST endpoint for AzamPay callbacks
- Uses Supabase service role key (bypasses RLS) to update payment + booking status

**Database (Phase 3):**
- `payments` table: provider, payment_method, account_number, amount, currency, external_id, transaction_id, status
- `bookings` table updated: payment_id, paid_at columns added
- Migrations: `004_payments.sql`, `005_update_prices_tzs.sql`

**Environment Variables (`.env.local`):**
```
SUPABASE_SERVICE_ROLE_KEY=       # For webhook (Settings → API → service_role)
AZAMPAY_ENV=SANDBOX              # SANDBOX or LIVE
AZAMPAY_CLIENT_ID=               # From developers.azampay.co.tz
AZAMPAY_CLIENT_SECRET=           # From developers.azampay.co.tz
AZAMPAY_APP_NAME=VanveiVillas
AZAMPAY_API_KEY=                 # From AzamPay settings page
AZAMPAY_MERCHANT_PHONE=          # Your merchant phone
AZAMPAY_MERCHANT_ACCOUNT=        # Your merchant account
NEXT_PUBLIC_APP_URL=             # For callback URL
```

**Setup Steps (before payments work):**
1. Run `004_payments.sql` in Supabase SQL editor
2. Run `005_update_prices_tzs.sql` in Supabase SQL editor
3. Register at https://developers.azampay.co.tz/sandbox/registerapp
4. Add AzamPay credentials + Supabase service role key to `.env.local`

---

## 9. File Structure

```
website/
├── .env.local                              # All credentials
├── middleware.ts                            # Auth session refresh
├── app/
│   ├── layout.tsx                          # AuthProvider + ToastProvider wrappers
│   ├── page.tsx                            # Homepage
│   ├── apartments/[slug]/
│   │   ├── page.tsx                        # Server component (static params)
│   │   ├── ApartmentDetail.tsx             # Layout: hero, amenities, facts
│   │   └── BookingWidget.tsx               # Full booking + payment flow
│   ├── booking/[bookingId]/
│   │   ├── page.tsx                        # Server component (fetch booking + payment)
│   │   └── BookingConfirmation.tsx         # Confirmation with payment status
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── callback/route.ts
│   └── api/payments/callback/route.ts      # AzamPay webhook
├── components/
│   ├── auth/         (AuthProvider, AuthModal, UserMenu)
│   ├── booking/      (DateRangePicker, CalendarGrid, CalendarDay, GuestSelector, BookingSummary, BookingStatusBadge)
│   ├── payment/      (PaymentMethodSelector, MobilePaymentForm, BankPaymentForm, PaymentStatusTracker)
│   └── ui/           (Modal, LoadingSpinner, Toast)
├── actions/          (auth.ts, booking.ts, availability.ts, payment.ts)
├── lib/
│   ├── azampay/      (config.ts, client.ts)
│   ├── supabase/     (client.ts, server.ts)
│   ├── types/        (database.ts)
│   ├── constants/    (apartments.ts)
│   └── utils/        (dates.ts, availability.ts, booking.ts)
├── hooks/            (useAuth.ts, animationConfig.ts)
└── supabase/migrations/
    ├── 001_initial_schema.sql
    ├── 002_seed_apartments.sql
    ├── 003_rls_policies.sql
    ├── 004_payments.sql
    └── 005_update_prices_tzs.sql
```

---

## 10. Next Up — Phase 4: Admin Dashboard

**Planned Features:**
- Admin login (role-based: `admin` in profiles table)
- Bookings overview (table with filters: pending/confirmed/cancelled)
- Confirm / cancel bookings manually
- Revenue overview (total, monthly, per apartment)
- Availability management (block/unblock dates)
- Guest list view
