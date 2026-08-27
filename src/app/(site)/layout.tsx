import Header from "@/components/header";
import Footer from "@/components/footer";
import { CartProvider } from "@/components/cart-provider";
import ResearchBanner from "@/components/research-banner";
import AgeGate from "@/components/age-gate";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <AgeGate />
      <ResearchBanner />
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </CartProvider>
  );
}
