import { z } from "zod";

export const addressSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  company: z.string().optional().or(z.literal("")),
  address1: z.string().min(5, "Street address is required"),
  address2: z.string().optional().or(z.literal("")),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State/Province is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  country: z.string().min(2, "Country is required").default("Pakistan"),
  phone: z
    .string()
    .trim()
    .regex(/^[+]?[\d\s-()]{7,20}$/, "Enter a valid phone number"),
});

export type AddressInput = z.infer<typeof addressSchema>;

export const PAYMENT_METHODS = [
  { value: "COD", label: "Cash on Delivery", available: true },
  { value: "BANK_TRANSFER", label: "Bank Transfer", available: true },
  { value: "JAZZCASH", label: "JazzCash", available: false },
  { value: "EASYPAISA", label: "EasyPaisa", available: false },
] as const;

export type AvailablePaymentMethod = "COD" | "BANK_TRANSFER";