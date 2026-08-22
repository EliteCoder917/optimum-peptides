import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { ShippingAddress } from "@/types";

type CheckoutPayload = {
  items: { variantId: string; quantity: number }[];
  customerEmail: string;
  shippingAddress: ShippingAddress;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as CheckoutPayload | null;

  if (!body || !Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  if (!body.customerEmail?.trim()) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const { fullName, line1, city, state, postalCode, country } =
    body.shippingAddress ?? {};

  if (!fullName || !line1 || !city || !state || !postalCode || !country) {
    return NextResponse.json(
      { error: "Shipping address is incomplete." },
      { status: 400 },
    );
  }

  // Never trust client-sent prices — look up each variant server-side.
  const orderItems: {
    product_variant_id: string;
    product_name: string;
    variant_name: string;
    unit_price_cents: number;
    quantity: number;
  }[] = [];

  for (const item of body.items) {
    if (!item.variantId || !Number.isInteger(item.quantity) || item.quantity < 1) {
      return NextResponse.json({ error: "Invalid cart item." }, { status: 400 });
    }

    const { data: variant, error: variantError } = await supabaseAdmin
      .from("product_variants")
      .select("id, name, price_cents, stock_quantity, is_active, products(name, is_active)")
      .eq("id", item.variantId)
      .maybeSingle();

    if (variantError || !variant) {
      return NextResponse.json(
        { error: "One of the items in your cart is no longer available." },
        { status: 400 },
      );
    }

    const product = Array.isArray(variant.products)
      ? variant.products[0]
      : variant.products;

    if (!variant.is_active || !product?.is_active) {
      return NextResponse.json(
        { error: `"${product?.name ?? variant.name}" is no longer available.` },
        { status: 400 },
      );
    }

    if (item.quantity > variant.stock_quantity) {
      return NextResponse.json(
        { error: `Not enough stock for "${product.name} (${variant.name})".` },
        { status: 400 },
      );
    }

    orderItems.push({
      product_variant_id: variant.id,
      product_name: product.name,
      variant_name: variant.name,
      unit_price_cents: variant.price_cents,
      quantity: item.quantity,
    });
  }

  const subtotalCents = orderItems.reduce(
    (sum, item) => sum + item.unit_price_cents * item.quantity,
    0,
  );

  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .insert({
      status: "pending",
      customer_email: body.customerEmail.trim(),
      customer_name: fullName,
      shipping_address: body.shippingAddress,
      subtotal_cents: subtotalCents,
      total_cents: subtotalCents,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { error: "Could not place order. Please try again." },
      { status: 500 },
    );
  }

  const { error: itemsError } = await supabaseAdmin
    .from("order_items")
    .insert(orderItems.map((item) => ({ ...item, order_id: order.id })));

  if (itemsError) {
    return NextResponse.json(
      { error: "Could not place order. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ orderId: order.id });
}
