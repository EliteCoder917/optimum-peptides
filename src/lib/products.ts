import type { Product } from "@/types";

const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Sample Peptide",
    slug: "sample-peptide",
    priceCents: 4999,
    description: "Placeholder product until the real catalog is wired up.",
    imageUrl: "/placeholder.svg",
  },
];

export async function getProducts(): Promise<Product[]> {
  return MOCK_PRODUCTS;
}
