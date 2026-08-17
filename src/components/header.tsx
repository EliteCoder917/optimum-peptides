"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import Logo from "@/components/logo";

const NAV_LINKS = [
  { label: "Browse", href: "/shop" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto grid h-20 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-5">
        {/* Logo */}
        <Logo className="justify-self-start" />

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

        {/* Search + Cart */}
        <div className="hidden items-center justify-self-end gap-3 md:flex">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="text"
              placeholder="Search peptides…"
              aria-label="Search peptides"
              className="h-10 w-56 rounded-full border border-border bg-secondary/60 pl-9 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full border border-border bg-secondary/60 transition-colors hover:bg-secondary"
            aria-label="Cart"
          >
            <ShoppingCart className="size-4" />
          </button>
        </div>

        {/* Mobile Menu */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="ml-auto rounded-full border border-border p-2 text-foreground md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <div className="border-t border-border bg-background px-5 py-4 md:hidden">
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="text"
              placeholder="Search peptides…"
              aria-label="Search peptides"
              className="h-10 w-full rounded-full border border-border bg-secondary/60 pl-9 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

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
