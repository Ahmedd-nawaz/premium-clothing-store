/**
 * Application constants
 * Centralized configuration values used throughout the application
 */

export const APP_CONSTANTS = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "Premium Clothing Brand",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  description:
    "Discover premium clothing from our curated collections. Quality fabrics, timeless designs, sustainable fashion.",
  keywords: [
    "clothing",
    "fashion",
    "premium",
    "ecommerce",
    "online shopping",
    "apparel",
    "designer",
  ],
  author: "Premium Clothing Brand",
  themeColor: "#111111",
  backgroundColor: "#FAFAFA",
} as const;

export const ROUTES = {
  home: "/",
  shop: "/shop",
  product: (slug: string) => `/shop/${slug}`,
  cart: "/cart",
  checkout: "/checkout",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
  dashboard: "/dashboard",
  profile: "/dashboard/profile",
  orders: "/dashboard/orders",
  orderDetail: (id: string) => `/dashboard/orders/${id}`,
  wishlist: "/dashboard/wishlist",
  addresses: "/dashboard/addresses",
  settings: "/dashboard/settings",
  support: "/dashboard/support",
  admin: "/admin",
  adminLogin: "/admin/login",
  adminDashboard: "/admin/dashboard",
  adminProducts: "/admin/products",
  adminCategories: "/admin/categories",
  adminOrders: "/admin/orders",
  adminCustomers: "/admin/customers",
  adminCoupons: "/admin/coupons",
  adminReviews: "/admin/reviews",
  adminSettings: "/admin/settings",
  adminAnalytics: "/admin/analytics",
  api: {
    auth: "/api/auth",
    products: "/api/products",
    categories: "/api/categories",
    cart: "/api/cart",
    checkout: "/api/checkout",
    orders: "/api/orders",
    users: "/api/users",
    upload: "/api/upload",
    webhooks: "/api/webhooks",
  },
} as const;

export const PAGINATION = {
  defaultPage: 1,
  defaultLimit: 12,
  maxLimit: 100,
  shopLimit: 12,
  adminLimit: 25,
} as const;

export const PRODUCT = {
  maxImages: 10,
  maxVariants: 50,
  maxTags: 20,
  maxCollections: 10,
  lowStockThreshold: 10,
  outOfStockThreshold: 0,
  featuredLimit: 8,
  newArrivalsLimit: 8,
  bestSellersLimit: 8,
  relatedProductsLimit: 4,
  recentlyViewedLimit: 10,
  compareLimit: 4,
} as const;

export const CART = {
  maxQuantity: 99,
  minQuantity: 1,
  storageKey: "cart",
  sessionExpiryDays: 30,
} as const;

export const CHECKOUT = {
  steps: [
    { key: "information", label: "Information", href: "/checkout" },
    { key: "shipping", label: "Shipping", href: "/checkout/shipping" },
    { key: "payment", label: "Payment", href: "/checkout/payment" },
    { key: "review", label: "Review", href: "/checkout/review" },
  ],
  shippingMethods: [
    { id: "standard", name: "Standard Shipping", price: 0, days: "5-7 business days" },
    { id: "express", name: "Express Shipping", price: 15, days: "2-3 business days" },
    { id: "overnight", name: "Overnight Shipping", price: 30, days: "1 business day" },
  ],
  paymentMethods: [
    { id: "cod", name: "Cash on Delivery", description: "Pay when you receive your order" },
    { id: "bank_transfer", name: "Bank Transfer", description: "Transfer to our bank account" },
    { id: "jazzcash", name: "JazzCash", description: "Pay via JazzCash mobile wallet" },
    { id: "easypaisa", name: "EasyPaisa", description: "Pay via EasyPaisa mobile wallet" },
  ],
} as const;

export const AUTH = {
  passwordMinLength: 8,
  passwordMaxLength: 128,
  sessionExpiryDays: 30,
  rememberMeExpiryDays: 90,
  emailVerificationExpiryHours: 24,
  passwordResetExpiryHours: 1,
  maxLoginAttempts: 5,
  lockoutDurationMinutes: 15,
} as const;

export const ADMIN = {
  roles: ["super_admin", "admin", "manager", "staff"] as const,
  permissions: {
    products: ["create", "read", "update", "delete", "bulk_upload", "bulk_delete"],
    categories: ["create", "read", "update", "delete"],
    orders: ["read", "update", "cancel", "refund", "ship"],
    customers: ["read", "update", "delete"],
    coupons: ["create", "read", "update", "delete"],
    reviews: ["read", "update", "delete", "moderate"],
    settings: ["read", "update"],
    analytics: ["read"],
    admins: ["create", "read", "update", "delete"],
    inventory: ["read", "update", "adjust"],
  },
} as const;

export const SEO = {
  defaultTitle: APP_CONSTANTS.name,
  titleTemplate: "%s | " + APP_CONSTANTS.name,
  defaultDescription: APP_CONSTANTS.description,
  keywords: APP_CONSTANTS.keywords,
  author: APP_CONSTANTS.author,
  defaultImage: "/images/og-default.jpg",
  twitterHandle: "@premiumclothing",
  siteName: APP_CONSTANTS.name,
  locale: "en_US",
  type: "website",
} as const;

export const BREAKPOINTS = {
  sm: 320,
  md: 375,
  lg: 768,
  xl: 1024,
  xxl: 1440,
  xxxl: 1920,
} as const;

export const ANIMATION = {
  durations: {
    fast: 150,
    normal: 250,
    slow: 350,
  },
  easings: {
    easeOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
} as const;

export const STORAGE_KEYS = {
  cart: "ecommerce_cart",
  wishlist: "ecommerce_wishlist",
  recentlyViewed: "ecommerce_recently_viewed",
  comparedProducts: "ecommerce_compared_products",
  searchHistory: "ecommerce_search_history",
  userPreferences: "ecommerce_user_preferences",
  theme: "ecommerce_theme",
  language: "ecommerce_language",
  currency: "ecommerce_currency",
} as const;

export const CURRENCY = {
  code: "PKR",
  symbol: "Rs",
  locale: "en-PK",
  decimals: 0,
} as const;

export const DATE_FORMATS = {
  short: "MMM d, yyyy",
  long: "MMMM d, yyyy",
  time: "h:mm a",
  dateTime: "MMM d, yyyy h:mm a",
  iso: "yyyy-MM-dd",
  isoTime: "yyyy-MM-dd'T'HH:mm:ss",
} as const;

export const VALIDATION = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[1-9]\d{1,14}$/,
  url: /^https?:\/\/.+/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  sku: /^[A-Z0-9]{3,20}$/,
  barcode: /^[0-9]{8,14}$/,
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  AUTHENTICATION_REQUIRED: "AUTHENTICATION_REQUIRED",
  AUTHORIZATION_FAILED: "AUTHORIZATION_FAILED",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  RATE_LIMITED: "RATE_LIMITED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  ORDER_FAILED: "ORDER_FAILED",
  INVENTORY_ERROR: "INVENTORY_ERROR",
} as const;