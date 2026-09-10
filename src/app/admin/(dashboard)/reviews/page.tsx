"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, Star } from "lucide-react";
import AdminTopbar from "@/components/admin/topbar";
import FilterTabs from "@/components/admin/filter-tabs";
import StatusBadge, { type StatusTone } from "@/components/admin/status-badge";
import StatCard from "@/components/admin/stat-card";
import EmptyState from "@/components/admin/empty-state";
import { formatDate } from "@/lib/format";
import {
  fetchReviews,
  updateReviewStatus,
  REVIEW_STATUS_LABELS,
  type AdminReview,
  type ReviewStatus,
} from "@/lib/admin-queries";

const STATUSES: ReviewStatus[] = ["pending", "approved", "rejected"];
const FILTERS = ["All", ...STATUSES] as const;

const STATUS_TONE: Record<ReviewStatus, StatusTone> = {
  pending: "amber",
  approved: "green",
  rejected: "red",
};

export default function AdminReviews() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setReviews(await fetchReviews());
      setError(null);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not load reviews.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function moderate(id: string, status: ReviewStatus) {
    setSavingId(id);
    const previous = reviews;

    setReviews((current) =>
      current.map((review) =>
        review.id === id ? { ...review, status } : review,
      ),
    );

    try {
      await updateReviewStatus(id, status);
      setError(null);
    } catch (cause) {
      setReviews(previous);
      setError(
        cause instanceof Error ? cause.message : "Could not update the review.",
      );
    } finally {
      setSavingId(null);
    }
  }

  const term = query.trim().toLowerCase();
  const visible = reviews.filter(
    (review) =>
      (filter === "All" || review.status === filter) &&
      (term === "" ||
        review.title.toLowerCase().includes(term) ||
        review.description.toLowerCase().includes(term) ||
        review.reviewerName.toLowerCase().includes(term) ||
        review.productName.toLowerCase().includes(term)),
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
            value={String(reviews.filter((r) => r.status === "pending").length)}
          />
          <StatCard
            label="Published"
            value={String(
              reviews.filter((r) => r.status === "approved").length,
            )}
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <FilterTabs
            options={FILTERS.map((value) => ({
              label:
                value === "All"
                  ? "All"
                  : REVIEW_STATUS_LABELS[value as ReviewStatus],
              count: reviews.filter(
                (r) => value === "All" || r.status === value,
              ).length,
            }))}
            active={
              filter === "All"
                ? "All"
                : REVIEW_STATUS_LABELS[filter as ReviewStatus]
            }
            onChange={(label) => {
              const match = STATUSES.find(
                (status) => REVIEW_STATUS_LABELS[status] === label,
              );
              setFilter(match ?? "All");
            }}
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

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

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
                    <StatusBadge tone={STATUS_TONE[review.status]}>
                      {REVIEW_STATUS_LABELS[review.status]}
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
                      {formatDate(review.createdAt)}
                    </span>
                  </div>

                  {review.title && (
                    <p className="mt-3 text-sm font-medium text-gray-900">
                      {review.title}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-gray-600">
                    {review.description}
                  </p>

                  {review.status === "pending" ? (
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        disabled={savingId === review.id}
                        onClick={() => moderate(review.id, "approved")}
                        className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        disabled={savingId === review.id}
                        onClick={() => moderate(review.id, "rejected")}
                        className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={savingId === review.id}
                      onClick={() => moderate(review.id, "pending")}
                      className="mt-4 text-xs font-medium text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      Undo
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {loading && (
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-8 text-center text-sm text-gray-400">
              Loading reviews…
            </div>
          )}

          {!loading && visible.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white">
              <EmptyState
                title={
                  reviews.length === 0
                    ? "No reviews yet"
                    : "No matching reviews"
                }
                description={
                  reviews.length === 0
                    ? "Customer reviews will show up here for moderation once your store starts shipping orders."
                    : "Try a different search or filter."
                }
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
