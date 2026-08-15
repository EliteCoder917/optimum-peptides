export type Product = {
  id: string;
  name: string;
  slug: string;
  priceCents: number;
  description: string;
  imageUrl: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type OrderItem = {
  productId: string;
  quantity: number;
  priceCents: number;
};

export type OrderStatus = "pending" | "paid" | "fulfilled" | "cancelled";

export type Order = {
  id: string;
  items: OrderItem[];
  totalCents: number;
  status: OrderStatus;
  customerEmail: string;
  createdAt: string;
};

export type ReviewStatus = "pending" | "approved" | "rejected";

export type Review = {
  id: string;
  productId: string;
  reviewerName: string;
  title: string;
  description: string;
  rating: number;
  imageUrls: string[];
  status: ReviewStatus;
  createdAt: string;
};
