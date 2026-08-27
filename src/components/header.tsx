"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import Logo from "@/components/logo";
import { useCart } from "@/components/cart-provider";

const NAV_LINKS = [
  { label: "Browse", href: "/shop" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      {/* Three flex tracks rather than a grid: the nav and desktop search are
          display:none on small screens, and a grid would silently reflow the
          remaining items into the wrong columns. Equal flex-1 sides keep the
          nav optically centred on desktop. */}
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-3 px-5">
        <div className="flex min-w-0 flex-1 items-center">
          <Logo />
        </div>

        {/* Navigation */}
        <nav className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search + Cart + Menu */}
        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
          <div className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="text"
              placeholder="Search peptides…"
              aria-label="Search peptides"
              className="h-10 w-44 rounded-full border border-border bg-secondary/60 pl-9 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary lg:w-56"
            />
          </div>

          <Link
            href="/cart"
            className="relative flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-secondary/60 transition-colors hover:bg-secondary"
            aria-label={`Cart${itemCount > 0 ? `, ${itemCount} item${itemCount === 1 ? "" : "s"}` : ""}`}
          >
            <ShoppingCart className="size-4" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border text-foreground lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <div className="border-t border-border bg-background px-5 py-4 lg:hidden">
          <div className="relative mb-4 md:hidden">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="text"
              placeholder="Search peptides…"
              aria-label="Search peptides"
              className="h-10 w-full rounded-full border border-border bg-secondary/60 pl-9 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          {/* Cart lives in the header bar itself, not in here. */}
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
