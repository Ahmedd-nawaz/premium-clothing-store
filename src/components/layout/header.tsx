"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Menu, X, Search, ShoppingBag, Heart, User } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { updateCartItemQuantity, removeCartItem } from "@/actions/cart";
import { useWishlist } from "@/contexts/wishlist-context";
import type { CartData } from "@/services/cart-service";

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "New Arrivals", href: "/shop?filter=new" },
  { label: "Best Sellers", href: "/shop?filter=bestseller" },
  { label: "Sale", href: "/shop?filter=sale" },
];

const EMPTY_CART: CartData = { items: [], subtotal: 0, itemCount: 0 };

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartData>(EMPTY_CART);
  const [cartLoading, setCartLoading] = useState(false);
  const { data: session } = useSession();
  const { wishlistIds } = useWishlist();

  const refetchCart = useCallback(async () => {
    try {
      const res = await fetch("/api/cart");
      if (res.ok) setCart(await res.json());
    } catch {
      // Cart badge just stays at its last known value if this fails —
      // not worth surfacing an error for a background count refresh.
    }
  }, []);

  useEffect(() => {
    refetchCart();
    // Any add-to-cart elsewhere on the site fires this so the badge and
    // (if open) the drawer content stay in sync without a full reload.
    window.addEventListener("cart:updated", refetchCart);
    return () => window.removeEventListener("cart:updated", refetchCart);
  }, [refetchCart]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return handleRemoveItem(itemId);
    setCartLoading(true);
    await updateCartItemQuantity(itemId, quantity);
    await refetchCart();
    setCartLoading(false);
  };

  const handleRemoveItem = async (itemId: string) => {
    setCartLoading(true);
    await removeCartItem(itemId);
    await refetchCart();
    setCartLoading(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center z-10" aria-label="Go to homepage">
            <span className="font-display text-2xl lg:text-3xl font-semibold tracking-tight text-primary">
              AURA & CO.
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-foreground hover:text-accent transition-colors duration-200 uppercase tracking-wider"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-full hover:bg-muted transition-colors lg:hidden"
              aria-label="Open search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/dashboard/wishlist"
              className="relative p-2 rounded-full hover:bg-muted transition-colors"
              aria-label={`Wishlist, ${wishlistIds.size} items`}
            >
              <Heart className="w-5 h-5" />
              {wishlistIds.size > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground text-[10px] font-medium">
                  {wishlistIds.size > 99 ? "99+" : wishlistIds.size}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-full hover:bg-muted transition-colors"
              aria-label={`Shopping cart, ${cart.itemCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground text-[10px] font-medium">
                  {cart.itemCount > 99 ? "99+" : cart.itemCount}
                </span>
              )}
            </button>

            {/* Auth / User Menu */}
            {session ? (
              <div className="relative">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 p-2 rounded-full hover:bg-muted transition-colors"
                  aria-label="My account"
                >
                  <User className="w-5 h-5" />
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-muted transition-colors text-sm font-medium"
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in lg:hidden" onClick={() => setSearchOpen(false)}>
          <div className="container mx-auto px-4 pt-24 pb-8" onClick={(e) => e.stopPropagation()}>
            <form className="relative max-w-md mx-auto" action="/shop" method="GET">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="search"
                name="q"
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-3 rounded-full bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                autoFocus
              />
            </form>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setMobileMenuOpen(false)} />
          <aside className="fixed top-0 right-0 h-full w-full max-w-sm bg-background border-l border-border animate-slide-in">
            <div className="flex flex-col h-full p-6">
              <div className="flex justify-between items-center mb-8">
                <span className="font-display text-xl font-semibold">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-muted transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-1 space-y-1" aria-label="Mobile navigation">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 px-2 text-base font-medium text-foreground hover:text-accent transition-colors uppercase tracking-wider"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="space-y-3 pt-6 border-t border-border">
                {session ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-3 rounded-full border border-border hover:bg-muted transition-colors font-medium"
                  >
                    My Account
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-3 rounded-full border border-border hover:bg-muted transition-colors font-medium"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart.items}
        subtotal={cart.subtotal}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        isLoading={cartLoading}
      />
    </header>
  );
}
