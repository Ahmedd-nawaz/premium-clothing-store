import { prisma } from "@/lib/prisma";

export async function getUserAddresses(userId: string) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
}

export interface OrderDetailData {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  createdAt: Date;
  address: {
    firstName: string;
    lastName: string;
    address1: string;
    address2: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string | null;
  };
  items: {
    id: string;
    productName: string;
    colorName: string;
    sizeName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    productImage: string | null;
  }[];
}

// userId is required here (not optional) so this can only ever return an
// order that belongs to the person asking — callers must check the
// session first and pass its id in, rather than trusting an order number
// alone (anyone could guess/enumerate those).
export async function getOrderByNumber(orderNumber: string, userId: string): Promise<OrderDetailData | null> {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { address: true, items: true },
  });

  if (!order || order.userId !== userId) return null;

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    subtotal: Number(order.subtotal),
    shippingCost: Number(order.shippingCost),
    total: Number(order.total),
    createdAt: order.createdAt,
    address: order.address,
    items: order.items.map((item) => ({
      id: item.id,
      productName: item.productName,
      colorName: item.colorName,
      sizeName: item.sizeName,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      totalPrice: Number(item.totalPrice),
      productImage: item.productImage,
    })),
  };
}

export function generateOrderNumber(): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `ORD-${datePart}-${randomPart}`;
}

export interface OrderSummary {
  orderNumber: string;
  status: string;
  total: number;
  itemCount: number;
  createdAt: Date;
}

export async function getUserOrders(userId: string): Promise<OrderSummary[]> {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { items: { select: { quantity: true } } },
  });

  return orders.map((order) => ({
    orderNumber: order.orderNumber,
    status: order.status,
    total: Number(order.total),
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    createdAt: order.createdAt,
  }));
}