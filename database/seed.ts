/**
 * Database Seed Script
 * Populates categories, products, variants, images, a coupon, and settings
 * so you have real data to develop against.
 *
 * NOTE: This does NOT create a User you can log in as. Better Auth hashes
 * passwords with its own algorithm (scrypt) when you sign up through the
 * app — faking that hash here would create a user whose password doesn't
 * actually work. Register through /register in the running app instead;
 * that goes through Better Auth properly and will work immediately.
 *
 * Run with: npx tsx database/seed.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Clearing existing seed data...");
  // Delete in reverse dependency order so this script is safe to re-run.
  await prisma.productImageVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.setting.deleteMany();

  console.log("Creating categories...");
  const [men, women, dresses, outerwear] = await Promise.all([
    prisma.category.create({
      data: { name: "Men", slug: "men", description: "Refined classics for the contemporary man", sortOrder: 1 },
    }),
    prisma.category.create({
      data: { name: "Women", slug: "women", description: "Elegant essentials for the modern woman", sortOrder: 2 },
    }),
    prisma.category.create({
      data: { name: "Dresses", slug: "dresses", description: "Occasion and everyday dresses", sortOrder: 3 },
    }),
    prisma.category.create({
      data: { name: "Outerwear", slug: "outerwear", description: "Coats and jackets built to last", sortOrder: 4 },
    }),
  ]);

  console.log("Creating products...");

  const productSeeds = [
    {
      name: "Tailored Wool Coat",
      slug: "tailored-wool-coat",
      description:
        "A structured wool coat cut for a clean, tailored silhouette. Finished with horn-style buttons and a half-belt back for a refined, elevated look that pairs with both casual and formal outfits.",
      categories: [outerwear.id, men.id],
      tags: ["coat", "wool", "outerwear", "winter"],
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1200",
      hoverImage: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=1200",
      variants: [
        { colorName: "Charcoal", colorHex: "#36454F", sizeName: "M", sizeLabel: "Medium", price: 289.0, compareAtPrice: 340.0, stock: 18, sku: "COAT-WL-CHR-M" },
        { colorName: "Camel", colorHex: "#C19A6B", sizeName: "L", sizeLabel: "Large", price: 289.0, compareAtPrice: 340.0, stock: 12, sku: "COAT-WL-CML-L" },
      ],
    },
    {
      name: "Silk Slip Dress",
      slug: "silk-slip-dress",
      description:
        "A bias-cut silk slip dress with adjustable straps and a fluid drape. Designed to move with you, from dinner to evenings out, in a fabric that catches the light.",
      categories: [dresses.id, women.id],
      tags: ["dress", "silk", "evening"],
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200",
      hoverImage: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1200",
      variants: [
        { colorName: "Ivory", colorHex: "#F4F1E8", sizeName: "S", sizeLabel: "Small", price: 165.0, compareAtPrice: null, stock: 24, sku: "DRS-SLK-IVR-S" },
        { colorName: "Black", colorHex: "#111111", sizeName: "M", sizeLabel: "Medium", price: 165.0, compareAtPrice: null, stock: 20, sku: "DRS-SLK-BLK-M" },
      ],
    },
    {
      name: "Essential Crewneck Tee",
      slug: "essential-crewneck-tee",
      description:
        "A heavyweight cotton crewneck built as a daily staple. Pre-shrunk, garment-dyed, and cut with a slightly relaxed fit for lasting comfort.",
      categories: [men.id, women.id],
      tags: ["t-shirt", "cotton", "essentials"],
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: true,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200",
      hoverImage: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=1200",
      variants: [
        { colorName: "White", colorHex: "#FFFFFF", sizeName: "M", sizeLabel: "Medium", price: 45.0, compareAtPrice: null, stock: 60, sku: "TEE-CRW-WHT-M" },
        { colorName: "Black", colorHex: "#111111", sizeName: "L", sizeLabel: "Large", price: 45.0, compareAtPrice: null, stock: 55, sku: "TEE-CRW-BLK-L" },
      ],
    },
    {
      name: "Pleated Midi Skirt",
      slug: "pleated-midi-skirt",
      description:
        "Fine knife-pleats fall from a fitted waistband into a fluid midi length. Made from a satin-finish fabric that holds its shape and movement all day.",
      categories: [women.id],
      tags: ["skirt", "midi", "pleated"],
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      image: "https://images.unsplash.com/photo-1583496661160-fb5886a13d05?w=1200",
      hoverImage: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1200",
      variants: [
        { colorName: "Beige", colorHex: "#D4B996", sizeName: "S", sizeLabel: "Small", price: 98.0, compareAtPrice: 120.0, stock: 15, sku: "SKT-PLT-BGE-S" },
        { colorName: "Black", colorHex: "#111111", sizeName: "M", sizeLabel: "Medium", price: 98.0, compareAtPrice: 120.0, stock: 17, sku: "SKT-PLT-BLK-M" },
      ],
    },
    {
      name: "Merino Wool Sweater",
      slug: "merino-wool-sweater",
      description:
        "A lightweight yet warm merino wool sweater with a ribbed crewneck collar. Fine-gauge knit that layers cleanly under a coat or stands alone.",
      categories: [men.id],
      tags: ["sweater", "merino", "knitwear"],
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: false,
      image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=1200",
      hoverImage: "https://images.unsplash.com/photo-1614975059251-992f11792b9f?w=1200",
      variants: [
        { colorName: "Navy", colorHex: "#1B2A4A", sizeName: "M", sizeLabel: "Medium", price: 135.0, compareAtPrice: null, stock: 22, sku: "SWT-MRN-NVY-M" },
        { colorName: "Grey", colorHex: "#808080", sizeName: "L", sizeLabel: "Large", price: 135.0, compareAtPrice: null, stock: 19, sku: "SWT-MRN-GRY-L" },
      ],
    },
    {
      name: "Wide-Leg Tailored Trousers",
      slug: "wide-leg-tailored-trousers",
      description:
        "High-waisted, wide-leg trousers with a crisp front crease and a fluid drape. Tailored construction meets everyday comfort with a hidden elastic back waistband.",
      categories: [women.id],
      tags: ["trousers", "tailored", "workwear"],
      isFeatured: false,
      isNewArrival: false,
      isBestSeller: true,
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200",
      hoverImage: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=1200",
      variants: [
        { colorName: "Black", colorHex: "#111111", sizeName: "S", sizeLabel: "Small", price: 118.0, compareAtPrice: null, stock: 20, sku: "TRS-WDL-BLK-S" },
        { colorName: "Stone", colorHex: "#B2A98F", sizeName: "M", sizeLabel: "Medium", price: 118.0, compareAtPrice: null, stock: 16, sku: "TRS-WDL-STN-M" },
      ],
    },
  ];

  for (const p of productSeeds) {
    const product = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        status: "ACTIVE",
        isFeatured: p.isFeatured,
        isNewArrival: p.isNewArrival,
        isBestSeller: p.isBestSeller,
        tags: p.tags,
        seoTitle: `${p.name} | Premium Clothing Store`,
        seoDescription: p.description.slice(0, 155),
        seoKeywords: p.tags,
        categories: { connect: p.categories.map((id) => ({ id })) },
      },
    });

    const [primaryImage, hoverImage] = await Promise.all([
      prisma.productImage.create({
        data: { productId: product.id, url: p.image, alt: p.name, position: 0, isPrimary: true },
      }),
      prisma.productImage.create({
        data: { productId: product.id, url: p.hoverImage, alt: `${p.name} alternate view`, position: 1, isPrimary: false },
      }),
    ]);

    for (const v of p.variants) {
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          sku: v.sku,
          colorName: v.colorName,
          colorHex: v.colorHex,
          sizeName: v.sizeName,
          sizeLabel: v.sizeLabel,
          price: v.price,
          compareAtPrice: v.compareAtPrice ?? undefined,
          stock: v.stock,
          isActive: true,
          images: {
            create: [{ productImageId: primaryImage.id }, { productImageId: hoverImage.id }],
          },
        },
      });
    }

    console.log(`  created product: ${p.name}`);
  }

  console.log("Creating coupon...");
  await prisma.coupon.create({
    data: {
      code: "WELCOME10",
      name: "Welcome Discount",
      description: "10% off your first order",
      type: "PERCENTAGE",
      value: 10.0,
      minOrderAmount: 50.0,
      usageLimit: 1000,
      userUsageLimit: 1,
      startsAt: new Date(),
      status: "ACTIVE",
      applicableProducts: [],
      applicableCategories: [],
      excludedProducts: [],
      excludedCategories: [],
      firstOrderOnly: true,
    },
  });

  console.log("Creating settings...");
  await prisma.setting.createMany({
    data: [
      { key: "site_name", value: JSON.stringify("Premium Clothing Store") },
      { key: "default_currency", value: JSON.stringify("PKR") },
      { key: "free_shipping_threshold", value: JSON.stringify(200) },
    ],
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });