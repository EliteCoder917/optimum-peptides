import Link from "next/link";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { getProductBySlug } from "@/lib/products";
import { getApprovedReviews } from "@/lib/reviews";
import ProductGallery from "@/components/product-gallery";
import ProductPurchasePanel from "@/components/product-purchase-panel";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const reviews = await getApprovedReviews(product.id);
  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-5 py-10">
        <Link
          href="/shop"
          className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary"
        >
          ← Back to Collection
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <ProductGallery images={product.imageUrls} name={product.name} />

          <div>
            {product.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.categories.map((category) => (
                  <span
                    key={category}
                    className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-muted-foreground"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}

            <h1 className="mt-4 text-4xl font-bold">{product.name}</h1>

            {averageRating !== null && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={`size-4 ${
                        index < Math.round(averageRating)
                          ? "fill-primary text-primary"
                          : "fill-secondary text-secondary"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {averageRating.toFixed(1)} ({reviews.length} review
                  {reviews.length === 1 ? "" : "s"})
                </span>
              </div>
            )}

            {product.description && (
              <p className="mt-5 leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            )}

            <div className="mt-7">
              <ProductPurchasePanel product={product} />
            </div>
          </div>
        </div>

        {/* REVIEWS */}
        <section className="mt-16 border-t border-border pt-10">
          <h2 className="text-2xl font-semibold">
            Reviews
            {reviews.length > 0 ? ` (${reviews.length})` : ""}
          </h2>

          {reviews.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No reviews yet for this product.
            </p>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="panel rounded-2xl p-5"
                >
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`size-3.5 ${
                          index < review.rating
                            ? "fill-primary text-primary"
                            : "fill-secondary text-secondary"
                        }`}
                      />
                    ))}
                  </div>

                  <h3 className="mt-2 font-semibold">{review.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {review.description}
                  </p>

                  {review.imageUrls.length > 0 && (
                    <div className="mt-3 flex gap-2">
                      {review.imageUrls.map((url) => (
                        <img
                          key={url}
                          src={url}
                          alt=""
                          className="size-16 rounded-lg object-cover"
                        />
                      ))}
                    </div>
                  )}

                  <p className="mt-3 text-xs text-muted-foreground">
                    {review.reviewerName}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
