/**
 * Application configuration
 * Centralized configuration for the application
 */

import { APP_CONSTANTS, ROUTES, PAGINATION, PRODUCT, CART, CHECKOUT, AUTH, ADMIN, SEO, BREAKPOINTS, ANIMATION, STORAGE_KEYS, CURRENCY, DATE_FORMATS, VALIDATION, HTTP_STATUS, ERROR_CODES } from "@/constants";

export const config = {
  app: APP_CONSTANTS,
  routes: ROUTES,
  pagination: PAGINATION,
  product: PRODUCT,
  cart: CART,
  checkout: CHECKOUT,
  auth: AUTH,
  admin: ADMIN,
  seo: SEO,
  breakpoints: BREAKPOINTS,
  animation: ANIMATION,
  storageKeys: STORAGE_KEYS,
  currency: CURRENCY,
  dateFormats: DATE_FORMATS,
  validation: VALIDATION,
  httpStatus: HTTP_STATUS,
  errorCodes: ERROR_CODES,
} as const;

export type Config = typeof config;

export default config;