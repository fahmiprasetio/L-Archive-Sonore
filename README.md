# 🎵 L'Archive Sonore

> A production-minded, full-stack e-commerce platform for premium musical instruments — curated guitars, pianos, drums, synthesizers, violins, and more.

L'Archive Sonore is a portfolio project built to demonstrate a **secure, scalable** online store: server-authoritative pricing, atomic stock handling, signature-verified payment webhooks, distributed rate limiting, and a hardened HTTP layer (CSP + security headers + request body limits).

<p align="left">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs" />
  <img alt="React" src="https://img.shields.io/badge/React-19-149eca?logo=react" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss" />
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-Postgres-3ecf8e?logo=supabase" />
  <img alt="Midtrans" src="https://img.shields.io/badge/Payments-Midtrans-0d4ea0" />
  <img alt="Vercel" src="https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel" />
</p>

---

## 🔗 Live Demo

- **Live site:** _add your Vercel URL here_
- **Demo admin / test cards:** use [Midtrans Sandbox test cards](https://docs.midtrans.com/docs/testing-payment-on-sandbox) (e.g. card `4811 1111 1111 1114`).

> 📸 _Add screenshots/GIFs of the storefront, cart, Midtrans Snap checkout, and admin dashboard in a `docs/` folder and embed them here._
>
> ```md
> ![Storefront](docs/storefront.png)
> ![Checkout](docs/checkout.png)
> ![Admin dashboard](docs/admin.png)
> ```

---

## ✨ Features

### Storefront
- Product catalog with categories and product detail pages.
- Cart with client state managed by **Zustand**.
- Guest checkout **and** authenticated checkout (orders linked to the user when signed in).
- Midtrans **Snap** payment flow (QRIS, virtual account, e-wallet, cards).

### Admin
- Admin-only product management (create / update / delete).
- Order management with status transitions (`pending → paid → processing → shipped → delivered`, plus `cancelled` / `failed`).
- Access restricted via an email allowlist (`NEXT_PUBLIC_ADMIN_EMAILS`) enforced **server-side**.

### Payments & orders
- Snap transaction creation with server-computed totals (subtotal + shipping + tax).
- Payment webhook with **sha512 signature verification**.
- **Idempotent** order → `paid` transition so stock is decremented exactly once even on repeated webhooks.

---

## 🧱 Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | **Next.js 16** (App Router, Route Handlers), **React 19** |
| Language | **TypeScript** |
| Styling | **Tailwind CSS v4** |
| State | **Zustand** |
| Database & Auth | **Supabase** (PostgreSQL + Auth + Row Level Security) |
| Payments | **Midtrans** Snap |
| Rate limiting | **Upstash Redis** (`@upstash/ratelimit`, sliding window) with in-memory fallback |
| Hosting | **Vercel** (serverless) |
| Icons | **lucide-react** |

---

## 🏛️ Architecture

```
Browser (Next.js App Router UI, Zustand cart)
  │
  ├─ POST /api/payment ............ validate cart → fetch authoritative price/stock
  │                                from DB → create Midtrans Snap transaction
  │                                → insert order (status: pending)
  │
  ├─ Midtrans Snap (hosted payment UI)
  │     └─ POST /api/payment/notification (webhook)
  │           → verify sha512 signature
  │           → conditional update order → paid (idempotent)
  │           → RPC decrement_product_stock() (atomic)
  │
  └─ Admin APIs (allowlist-gated)
        ├─ /api/admin/products  (POST / PUT / DELETE)
        └─ /api/admin/orders    (GET / PUT)

Supabase Postgres
  │  RLS on products / orders / wishlists / reviews
  └  decrement_product_stock(jsonb) — atomic, race-safe stock decrement

Upstash Redis — distributed rate limiting across serverless instances
```

All cross-cutting protection (CSP, HSTS, anti-clickjacking, etc.) is applied in `next.config.ts` via `headers()`.

---

## 🔒 Security Highlights

This project treats security as a first-class concern:

- **Server-authoritative pricing** — totals are computed from prices stored in the database, never from values sent by the browser. This blocks price-tampering (e.g. editing `price: 1` in the client).
- **Webhook signature verification** — Midtrans notifications are verified with `sha512(order_id + status_code + gross_amount + serverKey)` before any state change.
- **Idempotent + atomic stock** — the `paid` transition is conditional, and stock is decremented via an atomic Postgres function (`decrement_product_stock`) to prevent overselling under concurrency.
- **Row Level Security** — enabled on `products`, `orders`, `wishlists`, `reviews`.
- **Distributed rate limiting** — Upstash Redis sliding window on checkout, webhook, and admin endpoints (consistent across serverless instances), with an in-memory fallback for local dev.
- **Request body size limits** — every JSON API route reads the body through `readJsonLimited()` (`src/lib/body-limit.ts`), rejecting oversized payloads (HTTP 413) to mitigate payload-abuse / memory DoS.
- **Security headers + CSP** — `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` + `frame-ancestors 'none'`, `Referrer-Policy`, `Permissions-Policy`.
- **Admin allowlist** — admin routes verify the caller against `NEXT_PUBLIC_ADMIN_EMAILS` server-side; the Supabase service-role key is used only on the server.
- **Input validation** — lightweight, dependency-free validators in `src/lib/validation.ts`.

---

## 📈 Scalability

- Stateless serverless API routes on Vercel.
- Distributed rate limiting (no per-instance state).
- Atomic DB operations for stock to stay correct under high concurrency.
- Database indexes on frequently filtered columns.
- Ready for product caching/ISR and image optimization (Supabase Storage + `next/image`).

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- A Supabase project
- A Midtrans (Sandbox) account
- (Optional, recommended for prod) an Upstash Redis database

### 1. Install

```bash
npm install
```

### 2. Configure environment

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Project URL, e.g. `https://xxxx.supabase.co` (no trailing slash, no `/rest/v1/`). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase publishable / anon key. |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | **Server only.** Bypasses RLS — keep secret. |
| `NEXT_PUBLIC_ADMIN_EMAILS` | ✅ | Comma-separated admin emails. |
| `MIDTRANS_MERCHANT_ID` | ✅ | From the Midtrans dashboard. |
| `MIDTRANS_SERVER_KEY` | ✅ | **Server only.** Used for Snap + signature verification. |
| `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` | ✅ | Public Snap client key. |
| `UPSTASH_REDIS_REST_URL` | ⚠️ prod | Distributed rate limiting. Falls back to in-memory if unset. |
| `UPSTASH_REDIS_REST_TOKEN` | ⚠️ prod | Upstash REST token. **Server only.** |
| `DATABASE_URL` / `DIRECT_URL` | optional | Pooled / direct Postgres connection strings. |
| `NEXT_PUBLIC_SITE_URL` | optional | Canonical site URL for metadata. |

### 3. Set up the database

Run the schema and required migration(s) in the Supabase SQL Editor:

```sql
-- 1. Base schema (tables + RLS)
--    supabase/schema.sql

-- 2. Atomic stock decrement function (required for the webhook)
--    supabase/migrations/0001_decrement_product_stock.sql
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Configure the Midtrans webhook

In the Midtrans dashboard, set the **Payment Notification URL** to:

```
https://<your-domain>/api/payment/notification
```

---

## 📜 Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Production build. |
| `npm run start` | Run the production build. |
| `npm run lint` | Lint with ESLint. |

---

## 📁 Project Structure

```
src/
├─ app/
│  ├─ api/
│  │  ├─ payment/route.ts ................ checkout → Midtrans Snap
│  │  ├─ payment/notification/route.ts ... webhook (signature + atomic stock)
│  │  └─ admin/
│  │     ├─ products/route.ts ............ admin product CRUD
│  │     └─ orders/route.ts ............. admin order list + status update
│  └─ (storefront pages)
├─ components/ ......................... UI components
├─ lib/
│  ├─ body-limit.ts ................... request body size guard (readJsonLimited)
│  ├─ rate-limit.ts .................. Upstash + in-memory rate limiter
│  ├─ validation.ts ................. input validators
│  ├─ pricing.ts ................... shipping & tax calculation
│  ├─ midtrans.ts / supabase*.ts ... clients
│  └─ server-auth.ts ............... auth + admin allowlist
├─ store/ ............................. Zustand stores
└─ types/
supabase/
├─ schema.sql
└─ migrations/
   └─ 0001_decrement_product_stock.sql
next.config.ts ........................ security headers + CSP
```

---

## ☁️ Deployment (Vercel)

1. Import the repository into Vercel.
2. Add **all** environment variables (mark secrets — service role, Midtrans server key, Upstash token — as _Sensitive_; leave `NEXT_PUBLIC_*` non-sensitive).
3. Scope variables to Production + Preview + Development, then **redeploy** after any change.
4. Set the Midtrans Payment Notification URL to your deployed `/api/payment/notification`.
5. For production auth emails, configure custom SMTP in Supabase and re-enable “Confirm email”.

---

## 🗺️ Roadmap

- [ ] Error monitoring (Sentry)
- [ ] Automated tests (Vitest / Playwright) + GitHub Actions CI
- [ ] Order tracking page + payment confirmation emails
- [ ] Move product images to Supabase Storage + `next/image`
- [ ] Search, category filters, and price sorting
- [ ] Coupons / discounts

---

## 👤 Author

**Naufal Fahmi Prasetio**

Built as a full-stack portfolio project. Feedback and contributions are welcome — open an issue or PR.
