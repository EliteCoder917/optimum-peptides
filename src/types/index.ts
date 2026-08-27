export type VariantForm = "vial" | "pen";

export type ProductVariant = {
  id: string;
  productId: string;
  name: string;
  sku: string;
  priceCents: number;
  stockQuantity: number;
  isActive: boolean;
  form: VariantForm | null;
};

// 'pom' = a licensed prescription-only medicine. These can never be listed
// or sold publicly (Human Medicines Regulations 2012, regs 7 and 214) — a
// research-use label is not a defence. Public queries filter them out.
export type RegulatoryClass = "ruo" | "pom";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrls: string[];
  categories: string[];
  isActive: boolean;
  regulatoryClass: RegulatoryClass;
  variants: ProductVariant[];
};

// Denormalized snapshot so the cart can render without refetching product
// data, and stays stable even if the catalog changes while it's in a cart.
export type CartItem = {
  variantId: string;
  productId: string;
  productName: string;
  productSlug: string;
  variantName: string;
  form: VariantForm | null;
  priceCents: number;
  imageUrl: string | null;
  quantity: number;
};

export type ShippingAddress = {
  fullName: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
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
