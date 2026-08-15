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
