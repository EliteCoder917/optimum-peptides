import { DollarSign, Package, ShoppingCart, Star } from "lucide-react";
import AdminTopbar from "@/components/admin/topbar";
import StatCard from "@/components/admin/stat-card";
import EmptyState from "@/components/admin/empty-state";

export default function AdminDashboard() {
  return (
    <>
      <AdminTopbar
        title="Dashboard"
        subtitle="Here's what's happening with your store today."
      />

      <div className="space-y-6 p-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Revenue"
            value="$0"
            icon={DollarSign}
            iconClassName="bg-blue-50 text-blue-600"
          />
          <StatCard
            label="Total Orders"
            value="0"
            icon={ShoppingCart}
            iconClassName="bg-green-50 text-green-600"
          />
          <StatCard
            label="Products in Stock"
            value="0"
            icon={Package}
            iconClassName="bg-amber-50 text-amber-600"
          />
          <StatCard
            label="Avg Rating"
            value="—"
            icon={Star}
            iconClassName="bg-pink-50 text-pink-600"
          />
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-base font-semibold text-gray-900">
              Revenue Overview
            </h2>
            <p className="text-sm text-gray-500">
              Monthly revenue and order volume
            </p>

            <div className="mt-6 flex h-64 items-center justify-center rounded-xl bg-gray-50">
              <p className="text-sm text-gray-400">
                Chart will appear once orders start coming in
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-base font-semibold text-gray-900">
              Sales by Category
            </h2>
            <p className="text-sm text-gray-500">Distribution of units sold</p>

            <div className="mt-6 flex h-64 items-center justify-center rounded-xl bg-gray-50">
              <p className="text-sm text-gray-400">No sales data yet</p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-base font-semibold text-gray-900">
              Recent Orders
            </h2>
            <p className="text-sm text-gray-500">Latest customer purchases</p>

            <EmptyState
              title="No orders yet"
              description="Orders will show up here as customers check out."
            />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-base font-semibold text-gray-900">
              Low Stock Alert
            </h2>
            <p className="text-sm text-gray-500">Restock soon</p>

            <EmptyState title="Nothing low on stock" />
          </div>
        </div>
      </div>
    </>
  );
}
