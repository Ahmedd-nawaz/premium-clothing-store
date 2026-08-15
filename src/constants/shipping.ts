export const SHIPPING = {
  flatRate: 15,
  freeShippingThreshold: 200,
} as const;

export function calculateShipping(subtotal: number): number {
  return subtotal >= SHIPPING.freeShippingThreshold ? 0 : SHIPPING.flatRate;
}