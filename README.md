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
they're only reachable through server-side code using the service role key
(`src/lib/supabase/server.ts`). The anon key client (`src/lib/supabase/client.ts`)
is safe to use in client components.

To point the app at a Supabase project, copy `.env.example` to `.env.local`
and fill in the values from your project's API settings.

### Admin access

Admin login uses Supabase Auth (`auth.users`) — no custom password table.
`admin_users` just marks which authenticated users are allowed into the
admin panel; an `is_admin()` helper function gates the write/read policies
on products, variants, and orders.

There's no self-signup. To create the first admin:

1. In the Supabase dashboard, go to Authentication → Users and invite/create
   the person's account.
2. Copy their user id and insert it into `admin_users` via the SQL editor:
   `insert into admin_users (user_id) values ('<their-auth-user-id>');`

The actual `/admin` pages, login form, and route protection (checking the
session + `admin_users` membership) still need to be built — this migration
only sets up the data model.

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
