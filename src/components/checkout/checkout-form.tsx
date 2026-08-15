"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addAddress, placeOrder } from "@/actions/checkout";
import { PAYMENT_METHODS, type AvailablePaymentMethod } from "@/features/checkout/schemas";
import { cn } from "@/utils";

interface AddressOption {
  id: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string | null;
  isDefault: boolean;
}

interface CheckoutFormProps {
  addresses: AddressOption[];
}

export function CheckoutForm({ addresses }: CheckoutFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [mode, setMode] = useState<"existing" | "new">(addresses.length > 0 ? "existing" : "new");
  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id ?? ""
  );
  const [paymentMethod, setPaymentMethod] = useState<AvailablePaymentMethod>("COD");

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      let addressId = selectedAddressId;

      if (mode === "new") {
        const result = await addAddress(formData);
        if (!result.success) {
          setError(result.error);
          return;
        }
        addressId = result.addressId;
      }

      if (!addressId) {
        setError("Please select or add a shipping address.");
        return;
      }

      const orderResult = await placeOrder(addressId, paymentMethod);
      if (!orderResult.success) {
        setError(orderResult.error);
        return;
      }

      window.dispatchEvent(new Event("cart:updated"));
      router.push(`/dashboard/orders/${orderResult.orderNumber}`);
    });
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm rounded-md bg-danger/10 text-danger border border-danger/20 font-medium">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Shipping Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {addresses.length > 0 && (
            <div className="space-y-2">
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                    mode === "existing" && selectedAddressId === addr.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <input
                    type="radio"
                    name="addressChoice"
                    checked={mode === "existing" && selectedAddressId === addr.id}
                    onChange={() => {
                      setMode("existing");
                      setSelectedAddressId(addr.id);
                    }}
                    className="mt-1"
                  />
                  <div className="text-sm">
                    <p className="font-medium">
                      {addr.firstName} {addr.lastName} {addr.isDefault && <span className="text-xs text-muted-foreground">(Default)</span>}
                    </p>
                    <p className="text-muted-foreground">
                      {addr.address1}{addr.address2 ? `, ${addr.address2}` : ""}, {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                    </p>
                    {addr.phone && <p className="text-muted-foreground">{addr.phone}</p>}
                  </div>
                </label>
              ))}

              <label className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-border cursor-pointer hover:border-primary/50 transition-colors">
                <input
                  type="radio"
                  name="addressChoice"
                  checked={mode === "new"}
                  onChange={() => setMode("new")}
                />
                <span className="text-sm font-medium">Use a new address</span>
              </label>
            </div>
          )}

          {mode === "new" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Input label="First Name" name="firstName" required minLength={2} />
              <Input label="Last Name" name="lastName" required minLength={2} />
              <Input label="Company (optional)" name="company" className="sm:col-span-2" />
              <Input label="Street Address" name="address1" required minLength={5} className="sm:col-span-2" />
              <Input label="Apartment, suite, etc. (optional)" name="address2" className="sm:col-span-2" />
              <Input label="City" name="city" required minLength={2} />
              <Input label="State / Province" name="state" required minLength={2} />
              <Input label="Postal Code" name="postalCode" required minLength={3} />
              <Input label="Country" name="country" defaultValue="Pakistan" required />
              <Input label="Phone Number" name="phone" type="tel" placeholder="+92 300 1234567" required className="sm:col-span-2" />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {PAYMENT_METHODS.map((method) => (
            <label
              key={method.value}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border transition-colors",
                !method.available && "opacity-50 cursor-not-allowed",
                method.available && "cursor-pointer",
                method.available && paymentMethod === method.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <span className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  disabled={!method.available}
                  checked={paymentMethod === method.value}
                  onChange={() => setPaymentMethod(method.value as AvailablePaymentMethod)}
                />
                <span className="text-sm font-medium">{method.label}</span>
              </span>
              {!method.available && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Coming soon</span>
              )}
            </label>
          ))}
        </CardContent>
      </Card>

      <Button type="submit" fullWidth size="lg" loading={isPending} loadingText="Placing order...">
        Place Order
      </Button>
    </form>
  );
}
