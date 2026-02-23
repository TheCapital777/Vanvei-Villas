# Vanvei Villas — Luxury Apartment Booking Platform

Premium short-stay villa rentals in Dar es Salaam, Tanzania.

---

## 🔗 Live URL
**https://vanvei-villas.netlify.app**

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19 + TailwindCSS v4 |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth (email/password) |
| Payments | AzamPay (M-Pesa, Tigo, Airtel, Halopesa, CRDB, NMB) |
| Hosting | Netlify (GitHub auto-deploy from main branch) |
| Language | TypeScript |

---

## 🏠 Apartments

| Name | Price/night | Beds | Max Guests |
|------|------------|------|------------|
| Pearl Suite | TZS 300,000 | 1 | 2 |
| Coral Residence | TZS 450,000 | 2 | 4 |
| Gold Penthouse | TZS 700,000 | 3 | 6 |

---

## 📁 Project Structure

```
website/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Homepage
│   ├── apartments/[slug]/        # Apartment detail + booking widget
│   ├── booking/[bookingId]/      # Booking confirmation page
│   ├── auth/                     # Login + signup pages
│   └── api/payments/callback/    # AzamPay webhook endpoint
├── actions/                      # Server actions (no API routes needed)
│   ├── booking.ts                # createBooking, cancelBooking
│   ├── payment.ts                # initiateMobilePayment, initiateBankPayment, checkPaymentStatus
│   └── availability.ts           # checkAvailability, getMonthAvailability
├── lib/
│   ├── azampay.ts                # Public payment module (getAccessToken, createPaymentRequest, verifyTransaction)
│   ├── azampay/
│   │   ├── client.ts             # Low-level AzamPay API calls
│   │   └── config.ts             # Sandbox/live URLs + env vars
│   ├── supabase/
│   │   ├── client.ts             # Browser-side Supabase client
│   │   └── server.ts             # Server-side Supabase client (cookie-aware)
│   ├── types/database.ts         # TypeScript types for all DB tables
│   ├── constants/apartments.ts   # Apartment data (slug, price, amenities)
│   └── utils/                    # dates.ts, booking.ts, availability.ts
├── components/                   # Shared UI components
│   └── payment/                  # PaymentMethodSelector, MobilePaymentForm, BankPaymentForm, PaymentStatusTracker
└── supabase/migrations/          # Ordered SQL migration files
```

---

## 🔄 Booking & Payment Flow

1. Guest selects dates on apartment page → BookingWidget validates availability
2. Guest fills in contact details → `createBooking()` creates booking with `status: pending`
3. Guest selects payment method (MNO or Bank)
4. `initiateMobilePayment()` / `initiateBankPayment()` calls AzamPay → stamps `payment_reference` on booking
5. AzamPay sends USSD push to guest's phone — guest confirms with PIN
6. AzamPay calls `POST /api/payments/callback` webhook
7. Webhook verifies transaction with AzamPay API (sandbox: trusts callback) → sets booking `status: confirmed`, `payment_status: paid`
8. Frontend polls `checkPaymentStatus()` → redirects to `/booking/[id]` confirmation page

---

## 🗄️ Database Migrations

Run these in order in Supabase SQL Editor:
**https://supabase.com/dashboard/project/azyjbkvapxhvskexhgii/sql**

| File | Description |
|------|-------------|
| `001_*.sql` | Initial schema (apartments, bookings, profiles) |
| `002_*.sql` | Payments table |
| `003_*.sql` | RLS policies |
| `004_*.sql` | Blocked dates |
| `005_*.sql` | is_available() RPC function |
| `006_booking_payment_columns.sql` | Add payment_reference, payment_status, payment_method to bookings |
| `007_update_is_available.sql` | Expire pending+unpaid bookings after 30 min in is_available() |

> ⚠️ **Migrations 006 and 007 must still be run manually in Supabase SQL Editor** — they are not auto-applied.

---

## ⚙️ Environment Variables

Set in **Netlify dashboard → vanvei-villas → Site configuration → Environment variables**:
https://app.netlify.com/projects/vanvei-villas/configuration/env

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://azyjbkvapxhvskexhgii.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Supabase dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | From Supabase dashboard → Settings → API (keep secret!) |
| `NEXT_PUBLIC_APP_URL` | `https://vanvei-villas.netlify.app` |
| `AZAMPAY_ENV` | `SANDBOX` (change to `LIVE` when going live) |
| `AZAMPAY_CLIENT_ID` | From AzamPay developer portal |
| `AZAMPAY_CLIENT_SECRET` | From AzamPay developer portal |
| `AZAMPAY_APP_NAME` | `VanveiVillas` |
| `AZAMPAY_API_KEY` | From AzamPay developer portal |
| `AZAMPAY_MERCHANT_PHONE` | Your merchant phone number |
| `AZAMPAY_MERCHANT_ACCOUNT` | Your merchant account number |

---

## 🚀 Development

```bash
# Install dependencies
cd "clients/Vanvei Villas/website"
npm install

# Start dev server (Turbopack)
npm run dev
# → http://localhost:3000

# Production build (verify no errors before deploying)
npm run build
```

Deployment is **automatic** — push to `main` branch on GitHub triggers Netlify redeploy.

Manual deploy trigger via CLI:
```bash
netlify api createSiteBuild --data="{\"site_id\":\"b0dbc279-b4d8-4e22-94f1-a6d13a8857d4\"}"
```

---

## ✅ Build Status

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 1 | ✅ Complete | UI/Layout — dark luxury theme, animations, apartment pages |
| Phase 2 | ✅ Complete | Booking engine — calendar, availability, guest selection, auth |
| Phase 3 | ✅ Complete | AzamPay sandbox integration, payment request, callback, booking status update |
| Phase 4 | ⏳ Pending | Admin dashboard — booking management, blocked dates, revenue view |
| Phase 5 | ⏳ Pending | Polish — SEO, performance, production AzamPay keys, custom domain |

---

## 🧪 Phase 3 Testing Checklist

Before going to Phase 4, verify these manually:

- [ ] Run migrations 006 + 007 in Supabase SQL Editor
- [ ] Add real AzamPay sandbox credentials to Netlify env vars
- [ ] Create a booking → confirm `payment_reference` populates on booking row
- [ ] Simulate callback: `POST /api/payments/callback` with `{ externalId, transactionstatus: "success", transactionId }`
- [ ] Confirm booking updates to `status: confirmed`, `payment_status: paid`
- [ ] Simulate failed callback → confirm `payment_status: failed`, booking stays `pending`
- [ ] Test expired lock: create booking, set `created_at` to 31 min ago in DB → confirm dates free up on calendar
- [ ] Test duplicate callback: send same payload twice → second returns `already_completed`

---

## 🔐 Pre-Production Checklist (Phase 5)

- [ ] Switch `AZAMPAY_ENV=LIVE` in Netlify env vars
- [ ] Set real `AZAMPAY_CLIENT_ID`, `AZAMPAY_CLIENT_SECRET`, `AZAMPAY_API_KEY`
- [ ] Set real `SUPABASE_SERVICE_ROLE_KEY` (currently placeholder)
- [ ] Add HMAC signature verification in callback webhook (`x-callback-signature` header)
- [ ] Set up custom domain in Netlify
- [ ] Update `NEXT_PUBLIC_APP_URL` to custom domain

---

## 🏢 Project Info

| Key | Value |
|-----|-------|
| Developer | Bruno Aby (akingb.kb@gmail.com) |
| Netlify site | `vanvei-villas` (ID: `b0dbc279-b4d8-4e22-94f1-a6d13a8857d4`) |
| GitHub repo | `TheCapital777/Vanvei-Villas` |
| Supabase project | `azyjbkvapxhvskexhgii` |
| Live URL | https://vanvei-villas.netlify.app |
