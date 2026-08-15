"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";
import { getCurrentCartId } from "@/services/cart-service";
import { generateOrderNumber } from "@/services/checkout-service";
import { calculateShipping } from "@/constants/shipping";
import { addressSchema, type AvailablePaymentMethod } from "@/features/checkout/schemas";

type AddAddressResult = { success: true; addressId: string } | { success: false; error: string };

export async function addAddress(formData: FormData): Promise<AddAddressResult> {
  const session = await getServerSession();
  if (!session) return { success: false, error: "You must be signed in." };

  const parsed = addressSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    company: formData.get("company"),
    address1: formData.get("address1"),
    address2: formData.get("address2"),
    city: formData.get("city"),
    state: formData.get("state"),
    postalCode: formData.get("postalCode"),
    country: formData.get("country") || "Pakistan",
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid address." };
  }

  const existingCount = await prisma.address.count({ where: { userId: session.user.id } });

  const address = await prisma.address.create({
    data: {
      ...parsed.data,
      userId: session.user.id,
      isDefault: existingCount === 0, // first address a user adds becomes their default
    },
  });

  return { success: true, addressId: address.id };
}

type PlaceOrderResult = { success: true; orderNumber: string } | { success: false; error: string };

export async function placeOrder(addressId: string, paymentMethod: AvailablePaymentMethod): Promise<PlaceOrderResult> {
  const session = await getServerSession();
  if (!session) return { success: false, error: "You must be signed in to place an order." };

  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address || address.userId !== session.user.id) {
    return { success: false, error: "Please select a valid shipping address." };
  }

  const cartId = await getCurrentCartId();
  if (!cartId) return { success: false, error: "Your cart is empty." };

  const cartItems = await prisma.cartItem.findMany({
    where: { cartId },
    include: {
      product: { include: { images: { where: { isPrimary: true }, take: 1 } } },
      variant: true,
    },
  });

  if (cartItems.length === 0) return { success: false, error: "Your cart is empty." };

  // Re-check stock right now, at the moment of purchase — what was shown
  // in the cart a few minutes ago may no longer be accurate.
  for (const item of cartItems) {
    if (!item.variant.isActive || item.variant.stock < item.quantity) {
      return {
        success: false,
        error: `${item.product.name} (${item.variant.colorName}, ${item.variant.sizeLabel}) no longer has enough stock. Please update your cart.`,
      };
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.variant.price) * item.quantity, 0);
  const shippingCost = calculateShipping(subtotal);
  const total = subtotal + shippingCost;
  const orderNumber = generateOrderNumber();

  try {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: session.user.id,
          addressId: address.id,
          status: "PENDING",
          paymentStatus: "PENDING",
          paymentMethod,
          shippingStatus: "PENDING",
          subtotal,
          discount: 0,
          tax: 0,
          shippingCost,
          total,
          currency: "PKR",
        },
      });

      for (const item of cartItems) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            variantId: item.variantId,
            productName: item.product.name,
            variantSku: item.variant.sku,
            colorName: item.variant.colorName,
            sizeName: item.variant.sizeLabel,
            quantity: item.quantity,
            unitPrice: Number(item.variant.price),
            totalPrice: Number(item.variant.price) * item.quantity,
            discount: 0,
            tax: 0,
            productImage: item.product.images[0]?.url ?? null,
          },
        });

        // Guard against a race between the stock check above and this
        // write — decrement conditionally, and fail the whole transaction
        // (which rolls everything back) if someone else beat us to it.
        const updated = await tx.productVariant.updateMany({
          where: { id: item.variantId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (updated.count === 0) {
          throw new Error(`STOCK_CONFLICT:${item.product.name}`);
        }

        await tx.inventoryMovement.create({
          data: {
            variantId: item.variantId,
            type: "SALE",
            quantity: -item.quantity,
            reference: orderNumber,
          },
        });
      }

      await tx.payment.create({
        data: {
          orderId: order.id,
          gateway: paymentMethod.toLowerCase(),
          status: "PENDING",
          amount: total,
          currency: "PKR",
        },
      });

      await tx.orderTimeline.create({
        data: {
          orderId: order.id,
          status: "PENDING",
          title: "Order placed",
          description: `Order placed via ${paymentMethod === "COD" ? "Cash on Delivery" : "Bank Transfer"}.`,
        },
      });

      await tx.cartItem.deleteMany({ where: { cartId } });
    });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("STOCK_CONFLICT:")) {
      const productName = error.message.split(":")[1];
      return { success: false, error: `${productName} sold out while you were checking out. Please update your cart.` };
    }
    console.error("[placeOrder] transaction failed:", error);
    return { success: false, error: "Something went wrong placing your order. Please try again." };
  }

  return { success: true, orderNumber };
}