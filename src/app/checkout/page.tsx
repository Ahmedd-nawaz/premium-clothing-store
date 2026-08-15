import { redirect } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getServerSession } from "@/lib/session";
import { getCart } from "@/services/cart-service";
import { getUserAddresses } from "@/services/checkout-service";
import { calculateShipping } from "@/constants/shipping";
import { formatCurrency } from "@/utils";
import { Button } from "@/components/ui/button";

export default async function CheckoutPage() {
  const session = await getServerSession();
  if (!session) redirect("/login?callbackUrl=/checkout");

  const [cart, addresses] = await Promise.all([getCart(), getUserAddresses(session.user.id)]);

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16 lg:pt-20">
          <div className="mx-auto max-w-2xl px-4 py-24 text-center">
            <h1 className="text-2xl font-semibold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground text-sm mb-6">Add something to your cart before checking out.</p>
            <Link href="/shop">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const shippingCost = calculateShipping(cart.subtotal);
  const total = cart.subtotal + shippingCost;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 lg:pt-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
          <h1 className="text-3xl font-display font-semibold tracking-tight mt-4 mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <CheckoutForm addresses={addresses} />
            </div>

            <div className="lg:col-span-1">
              <div className="rounded-xl border border-border p-6 space-y-4 sticky top-24">
                <h2 className="font-display text-lg font-semibold">Order Summary</h2>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-3 text-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image} alt={item.name} className="h-14 w-14 rounded-md object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {item.color} · {item.size} · Qty {item.quantity}
                        </p>
                      </div>
                      <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 text-sm border-t border-border pt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatCurrency(cart.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">{shippingCost === 0 ? "Free" : formatCurrency(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold pt-2 border-t border-border">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
