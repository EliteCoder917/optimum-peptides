import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";

type OrderItemRow = {
  id: string;
  product_name: string;
  variant_name: string;
  unit_price_cents: number;
  quantity: number;
};

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .maybeSingle();

  if (!order) notFound();

  const address = order.shipping_address as {
    fullName: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  } | null;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-5 py-14">
        <p className="text-[11px] uppercase tracking-[0.2em] text-primary">
          Order Placed
        </p>
        <h1 className="mt-2 text-4xl font-bold">Thanks, we&apos;ve got it.</h1>
        <p className="mt-3 text-muted-foreground">
          Order <span className="text-foreground">#{order.id.slice(0, 8)}</span>{" "}
          has been received. We&apos;ll reach out at{" "}
          <span className="text-foreground">{order.customer_email}</span> to
          confirm payment and shipping.
        </p>

        <div className="panel mt-8 rounded-2xl p-6">
          <h2 className="font-semibold">Items</h2>
          <div className="mt-4 space-y-3">
            {(order.order_items as OrderItemRow[]).map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.product_name} ({item.variant_name}) ×{" "}
                  {item.quantity}
                </span>
                <span>
                  {formatPrice(item.unit_price_cents * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-border pt-4 font-semibold">
            <span>Total</span>
            <span>{formatPrice(order.total_cents)}</span>
          </div>
        </div>

        {address && (
          <div className="panel mt-5 rounded-2xl p-6">
            <h2 className="font-semibold">Shipping to</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {address.fullName}
              <br />
              {address.line1}
              {address.line2 ? <> {address.line2}</> : null}
              <br />
              {address.city}, {address.state} {address.postalCode}
              <br />
              {address.country}
            </p>
          </div>
        )}

        <Link
          href="/shop"
          className="mt-8 inline-flex rounded-full border border-border px-6 py-3 text-sm font-medium uppercase tracking-[0.16em] transition-colors hover:bg-white/5"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
