/**
 * Product Service
 * Fetches products from the database and maps them into the plain,
 * serializable shape the homepage's (client) UI components expect.
 *
 * Two things matter here that are easy to get wrong:
 * 1. Prisma returns Decimal fields (price, compareAtPrice) as Decimal
 *    objects, not plain numbers. Those can't cross the Server->Client
 *    Component boundary as-is, so every one is converted with Number().
 * 2. We never fabricate rating/reviewCount — there's no seeded review
 *    data yet, so those fields are simply omitted rather than faked.
 */

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  images: { url: string; alt: string }[];
  badges?: ("new" | "sale" | "bestseller" | "low-stock")[];
  inStock: boolean;
  defaultVariantId: string;
}

type ProductWithRelations = Awaited<ReturnType<typeof fetchProducts>>[number];

async function fetchProducts(where: Prisma.ProductWhereInput, take: number) {
  return prisma.product.findMany({
    where,
    take,
    orderBy: { createdAt: "desc" },
    include: {
      images: { orderBy: { position: "asc" }, take: 2 },
      variants: { where: { isActive: true } },
    },
  });
}

function toCardData(product: ProductWithRelations): ProductCardData | null {
  const activeVariants = product.variants;
  if (activeVariants.length === 0) return null; // don't show unpurchasable products

  const cheapest = activeVariants.reduce((min, v) => (Number(v.price) < Number(min.price) ? v : min));
  const compareAtPrice = cheapest.compareAtPrice ? Number(cheapest.compareAtPrice) : undefined;
  const totalStock = activeVariants.reduce((sum, v) => sum + v.stock, 0);

  const badges: ProductCardData["badges"] = [];
  if (product.isNewArrival) badges.push("new");
  if (product.isBestSeller) badges.push("bestseller");
  if (compareAtPrice && compareAtPrice > Number(cheapest.price)) badges.push("sale");
  if (totalStock > 0 && totalStock <= 5) badges.push("low-stock");

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: Number(cheapest.price),
    compareAtPrice,
    images: product.images.map((img) => ({ url: img.url, alt: img.alt ?? product.name })),
    badges,
    inStock: totalStock > 0,
    defaultVariantId: cheapest.id,
  };
}

export async function getNewArrivals(limit = 4): Promise<ProductCardData[]> {
  const products = await fetchProducts({ status: "ACTIVE", isNewArrival: true }, limit);
  return products.map(toCardData).filter((p): p is ProductCardData => p !== null);
}

export async function getBestSellers(limit = 4): Promise<ProductCardData[]> {
  const products = await fetchProducts({ status: "ACTIVE", isBestSeller: true }, limit);
  return products.map(toCardData).filter((p): p is ProductCardData => p !== null);
}

export async function getSaleProducts(limit = 4): Promise<ProductCardData[]> {
  // A product is "on sale" if any active variant has a compareAtPrice
  // higher than its price — filtered here at the DB level via `some`.
  const products = await fetchProducts(
    {
      status: "ACTIVE",
      variants: { some: { isActive: true, compareAtPrice: { not: null } } },
    },
    limit
  );
  return products
    .map(toCardData)
    .filter((p): p is ProductCardData => p !== null && p.compareAtPrice !== undefined && p.compareAtPrice > p.price);
}

// ---------------------------------------------------------------------------
// Shop listing page: filtering, sorting, pagination, and facet counts
// ---------------------------------------------------------------------------

export type ShopSort = "newest" | "price-asc" | "price-desc" | "name-asc";

export interface ShopFilters {
  categorySlug?: string;
  sizes?: string[];
  colors?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: ShopSort;
  page?: number;
  pageSize?: number;
}

export interface ShopResult {
  products: ProductCardData[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

function buildShopWhere(filters: ShopFilters): Prisma.ProductWhereInput {
  const variantFilters: Prisma.ProductVariantWhereInput = { isActive: true };

  if (filters.sizes?.length) variantFilters.sizeName = { in: filters.sizes };
  if (filters.colors?.length) variantFilters.colorName = { in: filters.colors };
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    variantFilters.price = {
      ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
      ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
    };
  }

  return {
    status: "ACTIVE",
    ...(filters.categorySlug ? { categories: { some: { slug: filters.categorySlug } } } : {}),
    variants: { some: variantFilters },
  };
}

function sortToOrderBy(sort: ShopSort = "newest"): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "name-asc":
      return { name: "asc" };
    case "newest":
    default:
      return { createdAt: "desc" };
    // price-asc/price-desc are applied client-side after fetch below,
    // since price lives on ProductVariant, not Product, and a product
    // can have several variants at different prices.
  }
}

export async function getShopProducts(filters: ShopFilters): Promise<ShopResult> {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = filters.pageSize ?? 12;
  const where = buildShopWhere(filters);

  const total = await prisma.product.count({ where });

  const products = await prisma.product.findMany({
    where,
    orderBy: sortToOrderBy(filters.sort),
    include: {
      images: { orderBy: { position: "asc" }, take: 2 },
      variants: { where: { isActive: true } },
    },
    // For price sorting we need every matching row before paginating,
    // since price is per-variant; for other sorts we can page at the DB.
    ...(filters.sort === "price-asc" || filters.sort === "price-desc" ? {} : { skip: (page - 1) * pageSize, take: pageSize }),
  });

  let cards = products.map(toCardData).filter((p): p is ProductCardData => p !== null);

  if (filters.sort === "price-asc") cards = cards.sort((a, b) => a.price - b.price);
  if (filters.sort === "price-desc") cards = cards.sort((a, b) => b.price - a.price);

  if (filters.sort === "price-asc" || filters.sort === "price-desc") {
    cards = cards.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
  }

  return {
    products: cards,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export interface ShopFacets {
  sizes: { value: string; label: string; count: number }[];
  colors: { value: string; label: string; count: number }[];
  priceRange: { min: number; max: number };
}

// Facets are computed from ALL active products (not the currently
// filtered set) so the filter panel doesn't shrink to nothing once a
// filter is applied — this matches how most shop UIs behave.
export async function getShopFacets(): Promise<ShopFacets> {
  const variants = await prisma.productVariant.findMany({
    where: { isActive: true, product: { status: "ACTIVE" } },
    select: { sizeName: true, sizeLabel: true, colorName: true, price: true },
  });

  const sizeMap = new Map<string, number>();
  const colorMap = new Map<string, number>();
  let min = Infinity;
  let max = 0;

  for (const v of variants) {
    sizeMap.set(v.sizeName, (sizeMap.get(v.sizeName) ?? 0) + 1);
    colorMap.set(v.colorName, (colorMap.get(v.colorName) ?? 0) + 1);
    const price = Number(v.price);
    if (price < min) min = price;
    if (price > max) max = price;
  }

  return {
    sizes: [...sizeMap.entries()].map(([value, count]) => ({ value, label: value, count })),
    colors: [...colorMap.entries()].map(([value, count]) => ({ value, label: value, count })),
    priceRange: { min: variants.length ? Math.floor(min) : 0, max: variants.length ? Math.ceil(max) : 1000 },
  };
}

// ---------------------------------------------------------------------------
// Product detail page
// ---------------------------------------------------------------------------

export interface ProductVariantData {
  id: string;
  sku: string;
  colorName: string;
  colorHex: string;
  sizeName: string;
  sizeLabel: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
}

export interface ProductDetailData {
  id: string;
  name: string;
  slug: string;
  description: string;
  categories: { id: string; name: string; slug: string }[];
  images: { url: string; alt: string }[];
  variants: ProductVariantData[];
  tags: string[];
}

export async function getProductBySlug(slug: string): Promise<ProductDetailData | null> {
  const product = await prisma.product.findUnique({
    where: { slug, status: "ACTIVE" },
    include: {
      categories: { select: { id: true, name: true, slug: true } },
      images: { orderBy: { position: "asc" } },
      variants: { where: { isActive: true } },
    },
  });

  if (!product) return null;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    categories: product.categories,
    images: product.images.map((img) => ({ url: img.url, alt: img.alt ?? product.name })),
    variants: product.variants.map((v) => ({
      id: v.id,
      sku: v.sku,
      colorName: v.colorName,
      colorHex: v.colorHex,
      sizeName: v.sizeName,
      sizeLabel: v.sizeLabel,
      price: Number(v.price),
      compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : undefined,
      stock: v.stock,
    })),
    tags: product.tags,
  };
}

export async function getRelatedProducts(productId: string, categoryIds: string[], limit = 4): Promise<ProductCardData[]> {
  if (categoryIds.length === 0) return [];
  const products = await fetchProducts(
    {
      status: "ACTIVE",
      id: { not: productId },
      categories: { some: { id: { in: categoryIds } } },
    },
    limit
  );
  return products.map(toCardData).filter((p): p is ProductCardData => p !== null);
}