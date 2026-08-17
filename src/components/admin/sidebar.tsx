"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Star } from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-gray-950 text-gray-300">
      <div className="px-6 py-6">
        <p className="text-lg font-semibold tracking-tight text-white">
          Optimum <span className="text-blue-400">Peptides</span>
        </p>
        <p className="mt-0.5 text-xs text-gray-500">Admin Console</p>
      </div>

      <nav className="flex-1 px-4">
        <p className="px-2 pb-2 text-[11px] font-medium uppercase tracking-wider text-gray-600">
          Menu
        </p>

        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                  }`}
                >
                  <item.icon className="size-4" />
                  <span className="flex-1">{item.label}</span>
                  {active && (
                    <span className="size-1.5 rounded-full bg-blue-400" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/10 px-4 py-4">
        {/* Static until admin auth is wired up */}
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex size-9 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
            A
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">Admin</p>
            <p className="truncate text-xs text-gray-500">
              admin@optimumpeptides.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
