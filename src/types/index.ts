/**
 * Core type definitions for the application
 */

/**
 * User roles in the system
 */
export type UserRole = "super_admin" | "admin" | "manager" | "staff" | "customer";

/**
 * User status
 */
export type UserStatus = "active" | "inactive" | "suspended" | "pending_verification";

/**
 * Custom User profile
 */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
  emailVerified: boolean;
  image?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  marketingConsent: boolean;
  lastLoginAt?: Date;
  isActive: boolean;
}

/**
 * Custom Auth Session
 */
export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt: Date;
}

/**
 * Order status
 */
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"
  | "partially_refunded";

/**
 * Payment status
 */
export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "refunded"
  | "partially_refunded"
  | "cancelled";

/**
 * Payment method
 */
export type PaymentMethod = "cod" | "bank_transfer" | "jazzcash" | "easypaisa" | "card";

/**
 * Shipping status
 */
export type ShippingStatus =
  | "pending"
  | "label_created"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "failed"
  | "returned";

/**
 * Product status
 */
export type ProductStatus = "draft" | "active" | "archived" | "out_of_stock";

/**
 * Product visibility
 */
export type ProductVisibility = "visible" | "hidden" | "featured";

/**
 * Review status
 */
export type ReviewStatus = "pending" | "approved" | "rejected" | "spam";

/**
 * Coupon type
 */
export type CouponType = "percentage" | "fixed_amount" | "free_shipping" | "buy_x_get_y";

/**
 * Coupon status
 */
export type CouponStatus = "active" | "inactive" | "expired" | "exhausted";

/**
 * Notification type
 */
export type NotificationType =
  | "order_placed"
  | "order_confirmed"
  | "order_shipped"
  | "order_delivered"
  | "order_cancelled"
  | "order_refunded"
  | "payment_received"
  | "payment_failed"
  | "review_request"
  | "review_approved"
  | "review_rejected"
  | "coupon_expiring"
  | "back_in_stock"
  | "price_drop"
  | "welcome"
  | "password_reset"
  | "email_verification"
  | "account_update"
  | "promotional"
  | "system";

/**
 * Notification channel
 */
export type NotificationChannel = "email" | "sms" | "push" | "in_app";

/**
 * Inventory movement type
 */
export type InventoryMovementType =
  | "purchase"
  | "sale"
  | "return"
  | "adjustment"
  | "damage"
  | "lost"
  | "transfer_in"
  | "transfer_out"
  | "initial_stock";

/**
 * Address type
 */
export type AddressType = "billing" | "shipping" | "both";

/**
 * Size availability
 */
export type SizeAvailability = "in_stock" | "low_stock" | "out_of_stock" | "coming_soon";

/**
 * Color representation
 */
export interface ColorOption {
  name: string;
  hex: string;
  images: string[];
  sku?: string;
}

/**
 * Size option
 */
export interface SizeOption {
  name: string;
  label: string;
  sortOrder: number;
  available: SizeAvailability;
  stock?: number;
}

/**
 * Product variant
 */
export interface ProductVariant {
  id: string;
  sku: string;
  barcode?: string;
  color: ColorOption;
  size: SizeOption;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  stock: number;
  lowStockThreshold: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  isActive: boolean;
}

/**
 * Product image
 */
export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  position: number;
  isPrimary: boolean;
  variantIds?: string[];
  width?: number;
  height?: number;
}

/**
 * SEO fields
 */
export interface SEOFields {
  title?: string;
  description?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  noFollow?: boolean;
}

/**
 * Pagination params
 */
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    timestamp: string;
    requestId: string;
  };
}

/**
 * Filter options for products
 */
export interface ProductFilters {
  categories?: string[];
  brands?: string[];
  priceRange?: { min: number; max: number };
  sizes?: string[];
  colors?: string[];
  inStock?: boolean;
  onSale?: boolean;
  featured?: boolean;
  newArrivals?: boolean;
  bestSellers?: boolean;
  tags?: string[];
  collections?: string[];
  search?: string;
}

/**
 * Sort options for products
 */
export type ProductSortOption =
  | "newest"
  | "oldest"
  | "price_asc"
  | "price_desc"
  | "popularity"
  | "rating"
  | "name_asc"
  | "name_desc"
  | "best_selling";

/**
 * Cart item
 */
export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    slug: string;
    images: ProductImage[];
  };
  variant: ProductVariant;
}

/**
 * Shipping address
 */
export interface ShippingAddress {
  id?: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  email?: string;
  type?: AddressType;
  isDefault?: boolean;
}

/**
 * Order item
 */
export interface OrderItem {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  variantSku: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount?: number;
  tax?: number;
  productImage?: string;
}

/**
 * Order summary
 */
export interface OrderSummary {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
}

/**
 * Coupon
 */
export interface Coupon {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: CouponType;
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usageCount: number;
  userUsageLimit?: number;
  startsAt: Date;
  expiresAt?: Date;
  status: CouponStatus;
  applicableProducts?: string[];
  applicableCategories?: string[];
  excludedProducts?: string[];
  excludedCategories?: string[];
  firstOrderOnly?: boolean;
}

/**
 * Review
 */
export interface Review {
  id: string;
  productId: string;
  userId: string;
  orderId?: string;
  rating: number;
  title?: string;
  content: string;
  images?: string[];
  status: ReviewStatus;
  helpfulCount: number;
  verifiedPurchase: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    firstName?: string;
    lastName?: string;
    image?: string;
  };
}

/**
 * Wishlist item
 */
export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  variantId?: string;
  createdAt: Date;
  product?: {
    id: string;
    name: string;
    slug: string;
    images: ProductImage[];
    price: number;
    compareAtPrice?: number;
  };
  variant?: ProductVariant;
}

/**
 * Recently viewed product
 */
export interface RecentlyViewedProduct {
  productId: string;
  variantId?: string;
  viewedAt: Date;
  product?: {
    id: string;
    name: string;
    slug: string;
    images: ProductImage[];
    price: number;
    compareAtPrice?: number;
  };
}

/**
 * Compared product
 */
export interface ComparedProduct {
  productId: string;
  variantId?: string;
  addedAt: Date;
}

/**
 * Analytics event
 */
export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, unknown>;
  userId?: string;
  sessionId?: string;
  timestamp: Date;
}

/**
 * Search suggestion
 */
export interface SearchSuggestion {
  query: string;
  type: "product" | "category" | "brand" | "tag";
  count?: number;
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

/**
 * Navigation item
 */
export interface NavigationItem {
  label: string;
  href?: string;
  children?: NavigationItem[];
  icon?: string;
  badge?: string | number;
  isExternal?: boolean;
}

/**
 * Footer link group
 */
export interface FooterLinkGroup {
  title: string;
  links: Array<{
    label: string;
    href: string;
    isExternal?: boolean;
  }>;
}

/**
 * Social link
 */
export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

/**
 * Site configuration
 */
export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  twitterHandle: string;
  keywords: string[];
  author: string;
  themeColor: string;
  backgroundColor: string;
}