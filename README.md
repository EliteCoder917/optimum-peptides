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
