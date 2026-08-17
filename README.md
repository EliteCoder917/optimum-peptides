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
- `orders` / `order_items` — order_items snapshot the product name and price
  at purchase time, so historical orders stay accurate if the catalog changes.

Row Level Security is on for every table. `products`/`product_variants` allow
public read of active rows; `orders`/`order_items` have no public policies —
they're only reachable through server-side code using the service role key.

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
