import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Pagination } from "@/components/shared/pagination";
import { ShopFilters } from "@/components/shop/shop-filters";
import { ShopToolbar } from "@/components/shop/shop-toolbar";
import { ProductCard } from "@/components/product/product-card";
import { getShopProducts, getShopFacets, type ShopSort } from "@/services/product-service";

interface ShopPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

const VALID_SORTS: ShopSort[] = ["newest", "price-asc", "price-desc", "name-asc"];

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  const filters = {
    categorySlug: params.category,
    sizes: params.size?.split(",").filter(Boolean),
    colors: params.color?.split(",").filter(Boolean),
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    sort: VALID_SORTS.includes(params.sort as ShopSort) ? (params.sort as ShopSort) : "newest",
    page: params.page ? Number(params.page) : 1,
  };

  const view = params.view === "list" ? "list" : "grid";

  const [{ products, total, page, totalPages }, facets] = await Promise.all([
    getShopProducts(filters),
    getShopFacets(),
  ]);

  function buildPageHref(targetPage: number) {
    const search = new URLSearchParams(params as Record<string, string>);
    search.set("page", String(targetPage));
    return `/shop?${search.toString()}`;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 lg:pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />

          <div className="flex items-start gap-8 mt-6">
            <Suspense fallback={null}>
              <ShopFilters facets={facets} />
            </Suspense>

            <div className="flex-1 min-w-0 space-y-6">
              <Suspense fallback={null}>
                <ShopToolbar total={total} />
              </Suspense>

              {products.length === 0 ? (
                <div className="text-center py-20">
                  <h2 className="text-xl font-semibold mb-2">No products match your filters</h2>
                  <p className="text-muted-foreground text-sm">Try adjusting or clearing your filters.</p>
                </div>
              ) : view === "list" ? (
                <div className="flex flex-col divide-y divide-border">
                  {products.map((product) => (
                    <ProductCard key={product.id} {...product} variant="compact" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              )}

              <Pagination currentPage={page} totalPages={totalPages} buildHref={buildPageHref} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
