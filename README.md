# Optimum Peptides

Online store for Optimum Peptides, built with Next.js (App Router), TypeScript, and Tailwind CSS.

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Stack

- [Next.js](https://nextjs.org) — App Router
- TypeScript
- Tailwind CSS

## Project Structure & Ownership

| Path                                           | Owns                                                                         | Who edits                          |
| ---------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------- |
| `src/app/**/page.tsx`, `src/app/**/layout.tsx` | Page markup/JSX, composing components                                        | Frontend                           |
| `src/components/**`                            | Reusable UI (header, footer, product card, etc.)                             | Frontend                           |
| `src/app/globals.css`, Tailwind classes        | Styling                                                                      | Frontend                           |
| `src/app/api/**`                               | API route handlers                                                           | Backend                            |
| `src/lib/**`                                   | DB clients, business logic, third-party integrations (payments, email, etc.) | Backend                            |
| `src/types/**`                                 | Shared TypeScript types used by both sides                                   | Shared — coordinate before editing |

**Rule of thumb:** frontend files should never import directly from a database client or secret-holding module. They call functions exported from `src/lib` (e.g. `getProducts()`) or hit `src/app/api` routes. This keeps a clean seam between the two of you and means backend internals can change without breaking frontend code.

Run `npm run format` before committing to keep formatting consistent between editors/machines.

## Database (Supabase)

Schema lives in `supabase/migrations/`. No customer accounts yet — checkout is
guest-only, orders are tracked by email rather than a user id.

- `products` / `product_variants` — catalog. Variants hold price and stock
  (peptides are sold in multiple dosages, e.g. 5mg/10mg per product).
  `products.image_urls` holds up to 5 image URLs (enforced by a check
  constraint), first = cover image shown on cards. `products.categories` is
  an array too, not a single column — several peptides genuinely belong to
  more than one (BPC-157 is Recovery, Gut Health, _and_ Joint Pain), and the
  fixed category list lives in `PRODUCT_CATEGORIES`
  (`src/lib/product-helpers.ts`).
- `orders` / `order_items` — order_items snapshot the product name and price
  at purchase time, so historical orders stay accurate if the catalog changes.

Row Level Security is on for every table. `products`/`product_variants` allow
public read of active rows and full read/write for admins (`is_admin()`);
`orders`/`order_items` have no public policies — they're only reachable
through server-side code using the service role key.

Watch out for this one if you're adding a new admin-writable table: the
admin insert/update/delete policies on `products`/`product_variants` were
added without a matching admin _select_ policy, so admins could create
products but not see their own drafts (RLS silently fell back to the public
"active only" policy). Fixed in `20260818000003_admin_read_products.sql` —
worth double-checking new tables don't repeat this.

Three Supabase clients, each with a distinct purpose:

- `src/lib/supabase/client.ts` — anon key, subject to RLS, cookie-backed
  session. Safe to import in client components.
- `src/lib/supabase/server.ts` — anon key + the current request's session
  cookie, subject to RLS. Use in Server Components / Route Handlers when you
  need to know who's logged in.
- `src/lib/supabase/admin.ts` — service role key, bypasses RLS entirely.
  Server-only (guarded by the `server-only` package). Never expose to the
  client.

To point the app at a Supabase project, copy `.env.example` to `.env.local`
and fill in the values from your project's API settings.

### Admin access

Admin login uses Supabase Auth (`auth.users`) — no custom password table.
`admin_users` marks which authenticated users are allowed into the admin
panel; an `is_admin()` helper function gates the write/read policies on
products, variants, and orders.

There's no public sign-up. Access is invite-only, and the invite itself is
what grants admin rights — nothing extra to run by hand afterward:

1. First, make sure the redirect URL is allow-listed in the Supabase
   dashboard under **Authentication → URL Configuration → Redirect URLs**:
   add `http://localhost:3000/admin/accept-invite` for local dev and
   `<production-domain>/admin/accept-invite` once deployed. Both can sit in
   the list at the same time.
2. Send the invite with:
   ```bash
   npm run invite-admin -- someone@example.com
   # or, against production:
   npm run invite-admin -- someone@example.com https://optimum-peptides.com
   ```
   **Don't use the Dashboard's "Invite user" button** — it has no field for
   a custom redirect and always falls back to the Site URL, so the email
   link lands on the homepage instead of `/admin/accept-invite` no matter
   what's in the allow-list. `scripts/invite-admin.mjs` calls the Admin API
   directly with an explicit `redirectTo`, which is what actually works.
3. They receive an email, click the link, and land on `/admin/accept-invite`
   to set their password.
4. On submit, the page calls `/api/admin/complete-invite`, which checks
   they have a valid session (only possible if they were genuinely invited —
   there's no other way to get a Supabase session in this app) and inserts
   them into `admin_users`. They're redirected straight into `/admin`.

From then on they log in normally at `/admin/login`. `src/proxy.ts` (Next's
renamed `middleware.ts` convention as of v16) protects every `/admin/*`
route except `/admin/login` and `/admin/accept-invite` — it checks for a
valid session and `admin_users` membership, redirecting to login otherwise.

Supabase's built-in email sending has a low rate limit on the free tier —
if invites stop arriving, that's usually why.

### Reviews

`reviews` holds title, description, star rating (1–5), and an array of
image URLs, tied to a `product_id`. It goes public once an admin sets its
status to `approved` — still `pending` by default either way.

Reviews are verified-purchase only, no accounts needed. Every `order_items`
row has a `review_token` (unguessable uuid) and a `reviewed_at` timestamp.
The flow, once built:

1. When an order ships, the customer is emailed a link containing their
   order item's `review_token` (e.g. `/review/<token>`).
2. That page looks up the order item by token server-side and lets them
   fill out the review form.
3. Submission goes through an API route using the service role key, which
   checks the token is valid and `reviewed_at is null`, inserts the review
   (linked via `order_item_id`, unique — one review per purchased item),
   and sets `reviewed_at` so the link can't be reused.

There's no public insert policy on `reviews` — token validation is a
server-side check, not something RLS can enforce on its own, so all writes
go through that route rather than a direct client-side insert.

Still to build: the `/review/[token]` page, the submission API route, and
the email that sends the link (needs an email provider — Resend, SendGrid,
etc. — and a decision on when it fires, e.g. on order fulfillment).

### Admin onboarding tour

First-time admins get a "Welcome" notification in the bell icon (top right
of the admin panel) offering a guided tour of the Dashboard, Products,
Orders, and Reviews pages. Anyone can replay it anytime via the same bell
("Take the tour again").

Requires the `admin_users.has_seen_tour` column from
`20260817000001_admin_tour.sql` — **run that migration before this works**,
otherwise `/api/admin/dismiss-tour` will 500 (harmlessly; the tour itself
still runs, it just won't remember it's been seen).

Built with `react-joyride` v3. One thing worth knowing if this ever needs
touching: Joyride mishandles `stepIndex` and `run` changing to `true` in
the same render when resuming a tour after a page navigation — it fails to
find the target even though it exists. `TourProvider` works around this by
settling `stepIndex` on its own render first, then flipping `run` on a
separate one via a follow-up effect. Skipping that split reintroduces the
bug.

### Product images

Admins upload images from their device in the product form — no image URL
field. Each selected file goes through a crop step (`react-easy-crop`,
locked to a 1:1 square, matching the `aspect-square` frame product cards
use everywhere) before it's attached, so the admin controls exactly what's
visible rather than relying on CSS `object-cover` to crop it later. Up to
5 images per product; the first is the cover image shown on cards.

Uploads go through `/api/admin/product-images` (POST to upload, DELETE to
remove) using the service role key, rather than direct browser-to-Storage
calls. This route isn't covered by `src/proxy.ts` (that only matches
`/admin/*`, not `/api/*`), so it checks `admin_users` membership itself
before touching storage. Going through a server route sidesteps needing
RLS policies on `storage.objects` entirely — the alternative would've
required SQL access to `storage.objects` that isn't available here (same
limitation as every table migration).

The `product-images` storage bucket (public read) already exists on the
live project — created directly via the Storage API since bucket creation
doesn't need SQL access, unlike the `products.image_urls` column change in
`20260818000001_product_images.sql`, which still needs that migration run
before saving a product with images will work.
