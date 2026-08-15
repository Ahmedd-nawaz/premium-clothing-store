/**
 * Category Service
 * Fetches real categories with live product counts for the homepage's
 * category grid and featured-collections banner.
 */

import { prisma } from "@/lib/prisma";

export interface CategoryCardData {
  id: string;
  name: string;
  slug: string;
  image: string;
  imageAlt: string;
  productCount: number;
}

export interface CollectionCardData extends CategoryCardData {
  description?: string;
  ctaText?: string;
}

// Categories don't have a dedicated "hero image" column filled in yet
// (Category.image is nullable and unset for all seeded rows). Rather
// than showing a broken <img> for every category, fall back to the
// primary image of that category's first product until real category
// photography/Cloudinary assets are uploaded.
async function resolveCategoryImage(categoryId: string): Promise<{ url: string; alt: string } | null> {
  const product = await prisma.product.findFirst({
    where: { categories: { some: { id: categoryId } } },
    include: { images: { where: { isPrimary: true }, take: 1 } },
  });
  const image = product?.images[0];
  return image ? { url: image.url, alt: image.alt ?? product?.name ?? "" } : null;
}

export async function getShopCategories(limit = 4): Promise<CategoryCardData[]> {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    take: limit,
    include: { _count: { select: { products: true } } },
  });

  const results: CategoryCardData[] = [];
  for (const category of categories) {
    const fallback = category.image ? { url: category.image, alt: category.name } : await resolveCategoryImage(category.id);
    if (!fallback) continue; // skip categories with literally no image source yet
    results.push({
      id: category.id,
      name: category.name,
      slug: category.slug,
      image: fallback.url,
      imageAlt: fallback.alt,
      productCount: category._count.products,
    });
  }
  return results;
}

export async function getFeaturedCollections(slugs: string[]): Promise<CollectionCardData[]> {
  const categories = await prisma.category.findMany({
    where: { slug: { in: slugs }, isActive: true },
    include: { _count: { select: { products: true } } },
  });

  const results: CollectionCardData[] = [];
  for (const category of categories) {
    const fallback = category.image ? { url: category.image, alt: category.name } : await resolveCategoryImage(category.id);
    if (!fallback) continue;
    results.push({
      id: category.id,
      name: `${category.name}'s Collection`,
      slug: category.slug,
      description: category.description ?? undefined,
      image: fallback.url,
      imageAlt: fallback.alt,
      productCount: category._count.products,
      ctaText: `Shop ${category.name}`,
    });
  }
  // Preserve the order the caller asked for (slugs order), not DB order.
  return slugs.map((slug) => results.find((r) => r.slug === slug)).filter((r): r is CollectionCardData => !!r);
}