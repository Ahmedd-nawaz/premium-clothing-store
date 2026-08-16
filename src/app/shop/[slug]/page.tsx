import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { ProductGallery } from "@/components/product/product-gallery";
import { VariantSelector } from "@/components/product/variant-selector";
import { ProductCard } from "@/components/product/product-card";
import { ProductWishlistButton } from "@/components/product/product-wishlist-button";
import { getProductBySlug, getRelatedProducts } from "@/services/product-service";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} | Premium Clothing Store`,
    description: product.description.slice(0, 155),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const related = await getRelatedProducts(
    product.id,
    product.categories.map((c) => c.id)
  );

  const primaryCategory = product.categories[0];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 lg:pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/shop" },
              ...(primaryCategory ? [{ label: primaryCategory.name, href: `/shop?category=${primaryCategory.slug}` }] : []),
              { label: product.name },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mt-6">
            <ProductGallery images={product.images} productName={product.name} />

            <div className="space-y-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-display font-semibold tracking-tight">{product.name}</h1>
                  {product.categories.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {product.categories.map((c) => c.name).join(" · ")}
                    </p>
                  )}
                </div>
                <ProductWishlistButton productId={product.id} />
              </div>

              <VariantSelector variants={product.variants} />

              <div className="border-t border-border pt-6">
                <h2 className="font-medium mb-2">Description</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full bg-muted text-xs text-muted-foreground capitalize"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="border-t border-border pt-6 space-y-2 text-sm text-muted-foreground">
                <p>Free shipping on orders over Rs 20,000.</p>
                <p>Easy 14-day returns on unworn items.</p>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <section className="mt-20">
              <h2 className="text-2xl font-display font-semibold mb-6">You May Also Like</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {related.map((item) => (
                  <ProductCard key={item.id} {...item} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
