import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getServerSession } from "@/lib/session";
import { getOrderByNumber } from "@/services/checkout-service";
import { formatCurrency } from "@/utils";

interface OrderDetailPageProps {
  params: Promise<{ orderNumber: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await getServerSession();
  if (!session) redirect("/login");

  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber, session.user.id);

  if (!order) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
          <CheckCircle2 className="h-5 w-5 text-success" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Order placed</h1>
          <p className="text-sm text-muted-foreground">Order #{order.orderNumber}</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Order Status</CardTitle>
          <Badge variant="outline">{order.status}</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Placed On</p>
              <p className="font-medium mt-1">
                {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Payment Method</p>
              <p className="font-medium mt-1">{order.paymentMethod === "COD" ? "Cash on Delivery" : "Bank Transfer"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Payment Status</p>
              <p className="font-medium mt-1">{order.paymentStatus}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
              {item.productImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.productImage} alt={item.productName} className="h-16 w-16 rounded-md object-cover flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{item.productName}</p>
                <p className="text-xs text-muted-foreground">
                  {item.colorName} · {item.sizeName} · Qty {item.quantity}
                </p>
              </div>
              <span className="text-sm font-medium">{formatCurrency(item.totalPrice)}</span>
            </div>
          ))}

          <div className="pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium">{order.shippingCost === 0 ? "Free" : formatCurrency(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold pt-2 border-t border-border">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shipping Address</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p className="text-foreground font-medium">
            {order.address.firstName} {order.address.lastName}
          </p>
          <p>
            {order.address.address1}
            {order.address.address2 ? `, ${order.address.address2}` : ""}, {order.address.city}, {order.address.state}{" "}
            {order.address.postalCode}, {order.address.country}
          </p>
          {order.address.phone && <p>{order.address.phone}</p>}
        </CardContent>
      </Card>

      <Link href="/dashboard/orders">
        <Button variant="outline">Back to Order History</Button>
      </Link>
    </div>
  );
}
