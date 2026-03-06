# SPRTD Website — Project Overview

A Next.js 16 e-commerce and brand site for SPRTD. Uses Supabase for auth/database/storage, Stripe for payments, and Tailwind CSS for styling. All pages share a dark (#111) background with cream/gold typography using Helvetica system fonts.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 16 (App Router) | Framework |
| Supabase | Auth, Postgres database, file storage |
| Stripe | Payments & webhooks |
| Tailwind CSS v4 | Styling |
| GSAP + Lenis | Scroll animations & smooth scroll |

---

## Folder Structure

```
app/
├── layout.tsx               # Root layout — wraps all pages with AuthProvider + CartProvider
├── globals.css              # Global styles, CSS variables (colors, fonts), keyframe animations
├── page.tsx                 # Home page — hero video cycling, mission section
│
├── shop/
│   ├── page.tsx             # Shop listing — fetches products from Supabase DB, renders ProductCards
│   └── [slug]/page.tsx      # Product detail — colorway selector, image gallery, add to cart
│
├── solutions/page.tsx       # Solutions/B2B landing page — SaaS-style layout, partnership tiers
├── account/page.tsx         # User account — order history, sign out (requires login)
├── order-confirmed/page.tsx # Post-checkout confirmation page — clears cart
├── login/page.tsx           # Redirects to home (login handled via modal)
├── cart/page.tsx            # Redirects to home (cart handled via drawer)
│
├── api/
│   ├── hero-vids/route.ts        # GET — lists video URLs from Supabase "HERO VIDS" storage bucket
│   ├── product-images/route.ts   # GET ?product=&colorway= — lists image URLs from Supabase "PRODUCTS" bucket
│   ├── checkout/route.ts         # POST — creates Stripe checkout session
│   └── webhooks/stripe/route.ts  # POST — handles Stripe webhook events (order fulfillment)
│
├── components/
│   ├── Navbar.tsx           # Top navigation — logo, page links, auth state, cart icon, mobile menu
│   ├── Footer.tsx           # Shared footer — nav links, social icons, copyright (on every page)
│   ├── CartDrawer.tsx       # Slide-in cart — item list, quantities, checkout button
│   └── LoginModal.tsx       # Modal overlay — email/password auth via Supabase
│
├── context/
│   ├── AuthContext.tsx      # React context — current user, signIn, signOut, session state
│   └── CartContext.tsx      # React context — cart items, addItem, removeItem, clearCart, Supabase sync
│
└── lib/
    ├── supabase.ts          # Supabase client (anon key, for client-side use)
    └── products.ts          # Shared types (Product, Colorway), constants (COLORWAYS), formatPrice()

public/
└── logoWeb.svg              # SPRTD logo — used in navbar, favicon, loading overlay

supabase/
├── config.toml              # Supabase CLI project config
└── migrations/              # SQL migration files for DB schema setup
    ├── 20260301000000_initial.sql       # Initial schema (products, cart_items tables)
    ├── 20260301000001_image_urls.sql    # Image URL column additions
    └── 20260301000002_orders_stripe.sql # Orders table + Stripe fields
```

---

## Key Files Explained

### `app/layout.tsx`
Root layout applied to every page. Wraps the app in `AuthProvider` (manages login state) and `CartProvider` (manages cart state). Sets page metadata (title, favicon).

### `app/globals.css`
Defines CSS variables: `--background` (#111), `--foreground` (#f5f0e8), `--gold` (#fff3af), `--gold-light` (#fffeca). Includes keyframe animations (`fadeIn`, `fadeInUp`, `slideUpReveal`, `slideInRight`) used across pages.

### `app/page.tsx` (Home)
Fetches hero video URLs from `/api/hero-vids` and cycles through them using a single `<video>` ref with a hidden preload element for seamless playback. Shows a logo intro overlay on first load.

### `app/shop/page.tsx`
Fetches all products from Supabase `products` table. Each `ProductCard` independently fetches its images from `/api/product-images`. First 4 cards get `priority` loading. Uses GSAP + Lenis for scroll animations.

### `app/shop/[slug]/page.tsx`
Dynamic product page. Loads product by slug, shows a stacked image gallery (all images for selected colorway), colorway swatches, size selector, and add-to-cart. Images re-fetch when colorway changes.

### `app/context/CartContext.tsx`
Central cart state. For logged-in users, syncs with Supabase `cart_items` table (DB is source of truth on login). For guests, persists to `localStorage`. `addItem` upserts to both local state and DB.

### `app/context/AuthContext.tsx`
Wraps Supabase auth. Exposes `user`, `signIn(email, password)`, `signOut()`. Listens to `onAuthStateChange` to keep session in sync.

### `app/api/hero-vids/route.ts`
Server-side route using the Supabase **service role key** (bypasses RLS) to list video files from the `HERO VIDS` storage bucket. Returns public URLs. Cached for 1 hour.

### `app/api/product-images/route.ts`
Server-side route using the Supabase **service role key** to list images from the `PRODUCTS` bucket at path `[PRODUCT_NAME]/[COLORWAY]/`. Returns public URLs. Cached for 5 minutes.

### `app/api/checkout/route.ts`
Creates a Stripe checkout session from the cart items passed in the request body. Returns the session URL for redirect.

### `app/api/webhooks/stripe/route.ts`
Receives Stripe webhook events. On `checkout.session.completed`, records the order in the Supabase `orders` table.

### `app/components/Navbar.tsx`
Responsive navbar with desktop split-link layout (logo centered, links on each side) and mobile hamburger menu. Shows cart item count badge. Opens `LoginModal` or `CartDrawer` on click.

### `app/components/Footer.tsx`
Shared footer with Contact/Policies links, social media icons (Instagram, TikTok, YouTube, Discord), and copyright. Imported and rendered on every page.

---

## Database Tables (Supabase)

| Table | Purpose |
|-------|---------|
| `products` | Product catalog — name, slug, price_cents, sizes[], description |
| `cart_items` | Per-user cart — user_id, product_id, size, quantity |
| `orders` | Completed orders — user_id, total_cents, status, stripe_session_id |

## Storage Buckets (Supabase)

| Bucket | Contents |
|--------|---------|
| `HERO VIDS` | MP4/MOV/WEBM videos that cycle on the home page hero |
| `PRODUCTS` | Product images organized as `[PRODUCT]/[COLORWAY]/1.jpg`, etc. |

---

## Environment Variables (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL        # Supabase project URL (public)
NEXT_PUBLIC_SUPABASE_ANON_KEY   # Supabase anon key (public, client-side)
SUPABASE_SERVICE_ROLE_KEY       # Supabase service role key (private, server-side only)
STRIPE_SECRET_KEY               # Stripe secret key (private)
STRIPE_WEBHOOK_SECRET           # Stripe webhook signing secret (private)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  # Stripe publishable key (public)
```
