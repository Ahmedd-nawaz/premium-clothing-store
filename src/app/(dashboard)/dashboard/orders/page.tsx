import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getServerSession } from "@/lib/session";
import { getUserOrders } from "@/services/checkout-service";
import { formatCurrency } from "@/utils";

export default async function OrdersPage() {
  const session = await getServerSession();
  if (!session) redirect("/login");

  const orders = await getUserOrders(session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Order History</h1>
        <p className="text-muted-foreground text-sm mt-1">Track and review your past orders.</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground text-sm mb-4">You haven&apos;t placed any orders yet.</p>
            <Link href="/shop" className="text-primary font-medium hover:underline underline-offset-4">
              Start shopping
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link key={order.orderNumber} href={`/dashboard/orders/${order.orderNumber}`}>
              <Card className="hover:border-primary/50 transition-colors">
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium text-sm">#{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })} ·{" "}
                      {order.itemCount} item{order.itemCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-sm">{formatCurrency(order.total)}</span>
                    <Badge variant="outline">{order.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
