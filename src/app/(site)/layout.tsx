import Header from "@/components/header";
import Footer from "@/components/footer";
import { CartProvider } from "@/components/cart-provider";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </CartProvider>
  );
}
