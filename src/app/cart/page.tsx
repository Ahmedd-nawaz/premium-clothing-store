import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { CartPageContent } from "@/components/cart/cart-page-content";
import { getCart } from "@/services/cart-service";

export default async function CartPage() {
  const cart = await getCart();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 lg:pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
          <h1 className="text-3xl font-display font-semibold tracking-tight mt-4 mb-8">Shopping Cart</h1>
          <CartPageContent cart={cart} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
