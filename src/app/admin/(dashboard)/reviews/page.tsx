"use client";

import { useState } from "react";
import { Search, Star } from "lucide-react";
import AdminTopbar from "@/components/admin/topbar";
import FilterTabs from "@/components/admin/filter-tabs";
import StatusBadge from "@/components/admin/status-badge";
import StatCard from "@/components/admin/stat-card";
import EmptyState from "@/components/admin/empty-state";

type ReviewStatus = "Pending" | "Published" | "Rejected";

type ReviewRow = {
  id: string;
  reviewerName: string;
  productName: string;
  rating: number;
  date: string;
  title: string;
  description: string;
  status: ReviewStatus;
};

// Replace with a real query once the reviews table is wired up
const reviews: ReviewRow[] = [];

const FILTERS = ["All", "Pending", "Published", "Rejected"] as const;

export default function AdminReviews() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [query, setQuery] = useState("");

  const visible = reviews.filter(
    (review) =>
      (filter === "All" || review.status === filter) &&
      review.title.toLowerCase().includes(query.toLowerCase()),
  );

  const averageRating = reviews.length
    ? (
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      ).toFixed(1)
    : "—";

  return (
    <>
      <AdminTopbar
        title="Reviews"
        subtitle="Moderate customer feedback and ratings."
      />

      <div className="p-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Average Rating" value={averageRating} />
          <StatCard label="Total Reviews" value={String(reviews.length)} />
          <StatCard
            label="Pending"
            value={String(reviews.filter((r) => r.status === "Pending").length)}
          />
          <StatCard
            label="Published"
            value={String(
              reviews.filter((r) => r.status === "Published").length,
            )}
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <FilterTabs
            options={FILTERS.map((label) => ({
              label,
              count: reviews.filter(
                (r) => label === "All" || r.status === label,
              ).length,
            }))}
            active={filter}
            onChange={(label) => setFilter(label as (typeof FILTERS)[number])}
          />

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search reviews..."
              aria-label="Search reviews"
              className="h-10 w-64 rounded-lg border border-gray-200 bg-white pl-9 pr-4 text-sm outline-none placeholder:text-gray-400 focus:border-blue-400"
            />
          </div>
        </div>

        <div id="tour-reviews-queue" className="mt-6">
          {visible.length > 0 && (
            <div className="space-y-4">
              {visible.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-gray-900">
                      {review.reviewerName}
                    </p>
                    <span className="text-gray-300">·</span>
                    <p className="text-sm text-gray-500">
                      {review.productName}
                    </p>
                    <StatusBadge
                      tone={
                        review.status === "Published"
                          ? "green"
                          : review.status === "Pending"
                            ? "amber"
                            : "red"
                      }
                    >
                      {review.status}
                    </StatusBadge>
                  </div>

                  <div className="mt-1 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`size-3.5 ${
                          index < review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-xs text-gray-400">
                      {review.date}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-gray-600">
                    {review.description}
                  </p>

                  {review.status === "Pending" ? (
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="mt-4 text-xs font-medium text-gray-400 hover:text-gray-600"
                    >
                      Undo
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {visible.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white">
              <EmptyState
                title="No reviews yet"
                description="Customer reviews will show up here for moderation once your store starts shipping orders."
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
