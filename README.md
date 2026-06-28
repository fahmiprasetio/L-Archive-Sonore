# 🎵 L'Archive Sonore

> A full-stack e-commerce concept for premium musical instruments — guitars, pianos, drums, synthesizers, violins, and more.

L'Archive Sonore is a portfolio project focused on building a **secure, production-minded** online store: server-authoritative pricing, atomic stock handling, signature-verified payment webhooks, and a hardened HTTP layer.

<p align="left">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-black?logo=nextdotjs" />
  <img alt="React" src="https://img.shields.io/badge/React-149eca?logo=react" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178c6?logo=typescript" />
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-3ecf8e?logo=supabase" />
  <img alt="Midtrans" src="https://img.shields.io/badge/Payments-Midtrans-0d4ea0" />
  <img alt="Vercel" src="https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel" />
</p>

---

## 🔗 Live Demo

- **Live site:** <https://l-archive-sonore.vercel.app/>
- **Payments:** test with [Midtrans Sandbox cards](https://docs.midtrans.com/docs/testing-payment-on-sandbox) (e.g. `4811 1111 1111 1114`).

> 📸 _Add a few screenshots/GIFs (storefront, checkout, admin) here._

---

## ✨ Features

- **Storefront** — product catalog with categories and detail pages, plus a shopping cart.
- **Checkout** — guest and authenticated checkout via the Midtrans **Snap** flow (QRIS, virtual account, e-wallet, cards), with totals computed on the server.
- **Orders** — status lifecycle from `pending` through `paid` to `delivered`, updated automatically from the payment webhook.
- **Admin area** — access-restricted product and order management.

---

## 🧱 Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | **Next.js** (App Router) · **React** · **TypeScript** · **Tailwind CSS** |
| Backend & Data | **Supabase** (PostgreSQL + Auth) |
| Payments | **Midtrans** |
| Hosting | **Vercel** |

---

## 🏛️ How It Works

The storefront runs on Next.js. At checkout, the server recomputes the order total from prices stored in the database and creates a Midtrans Snap transaction. When payment completes, Midtrans calls a webhook that verifies the request signature and then updates the order and product stock in a single, safe operation. A separate, access-restricted admin area manages products and orders. Security headers and a Content-Security-Policy are applied globally to every response.

---

## 🔒 Security Highlights

Security is treated as a first-class concern:

- **Server-authoritative pricing** — totals are computed from database prices, never from values sent by the browser, which blocks price tampering.
- **Verified payment webhooks** — incoming Midtrans notifications are validated with an `sha512` signature check before any change is made.
- **Safe stock updates** — the paid transition is idempotent and stock is decremented atomically, preventing double-counting and overselling under concurrency.
- **Row Level Security** — enabled on the core tables in Supabase.
- **Rate limiting** — applied to sensitive endpoints (checkout, webhook, admin), consistent across serverless instances.
- **Hardened HTTP layer** — CSP, HSTS, anti-clickjacking, `nosniff`, and request body size limits.
- **Error monitoring** — runtime errors are reported to Sentry.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- A Supabase project
- A Midtrans (Sandbox) account

### 1. Install

```bash
npm install
```

### 2. Configure environment

Copy the example file and fill in your own values:

```bash
cp .env.example .env.local
```

The required keys (Supabase, Midtrans, admin allowlist, and optional rate-limiting / monitoring credentials) are documented inline in `.env.example`.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Configure the Midtrans webhook

In the Midtrans dashboard, set the **Payment Notification URL** to:

```
https://<your-domain>/api/payment/notification
```

---

## 📜 Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Production build. |
| `npm run start` | Run the production build. |
| `npm run lint` | Lint with ESLint. |
