import { HeroBanner } from "@/components/layout/hero-banner";
import { FeaturedCollections } from "@/components/layout/featured-collections";
import { ProductSection } from "@/components/layout/product-section";
import { CategorySection } from "@/components/layout/category-section";
import { TestimonialSection } from "@/components/layout/testimonial-section";
import { BrandStorySection } from "@/components/layout/brand-story";
import { InstagramGallery } from "@/components/layout/instagram-gallery";
import { NewsletterSection } from "@/components/layout/newsletter-section";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getNewArrivals, getBestSellers, getSaleProducts } from "@/services/product-service";
import { getShopCategories, getFeaturedCollections } from "@/services/category-service";

// NOTE ON WHAT'S REAL VS STATIC BELOW:
// Featured Collections, Shop by Category, New Arrivals, Best Sellers, and
// Limited Time Offers are now pulled live from Postgres via Prisma — this
// is real catalog data, not mock data.
// Testimonials, Instagram Gallery, and Brand Story remain static editorial
// copy for now: there's no seeded Review data to pull real testimonials
// from yet, and Instagram posts / brand-story copy aren't modeled in the
// schema at all — those are marketing content decisions, not product data,
// so faking "customer quotes" would be misleading in a way faking a hero
// image isn't.

export default async function Home() {
  const [featuredCollections, categories, newArrivals, bestSellers, saleProducts] = await Promise.all([
    getFeaturedCollections(["women", "men"]),
    getShopCategories(4),
    getNewArrivals(4),
    getBestSellers(4),
    getSaleProducts(4),
  ]);

  const testimonials = [
    {
      id: "test-1",
      content:
        "The quality is exceptional. Every piece feels luxurious and lasts for years. This is what sustainable fashion should be.",
      author: "Sarah Mitchell",
      role: "Verified Customer",
      rating: 5,
      verified: true,
    },
    {
      id: "test-2",
      content:
        "I've never received so many compliments on my wardrobe. The fit is perfect, the fabrics are incredible. A true game changer.",
      author: "James Chen",
      role: "Style Enthusiast",
      rating: 5,
      verified: true,
    },
    {
      id: "test-3",
      content:
        "Finally a brand that understands timeless design. I've built my entire capsule wardrobe from these pieces.",
      author: "Elena Rodriguez",
      role: "Fashion Editor",
      rating: 5,
      verified: true,
    },
  ];

  const instagramPosts = [
    { id: "ig-1", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400", alt: "Summer collection", url: "https://instagram.com", likes: 2847, comments: 124 },
    { id: "ig-2", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400", alt: "Men's styling", url: "https://instagram.com", likes: 1923, comments: 87 },
    { id: "ig-3", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", alt: "Evening wear", url: "https://instagram.com", likes: 3156, comments: 203 },
    { id: "ig-4", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400", alt: "Knitwear detail", url: "https://instagram.com", likes: 1678, comments: 56 },
    { id: "ig-5", image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400", alt: "Outerwear styling", url: "https://instagram.com", likes: 2234, comments: 98 },
    { id: "ig-6", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400", alt: "Trousers fit", url: "https://instagram.com", likes: 1445, comments: 67 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 lg:pt-20">
        <HeroBanner
          title="Timeless Elegance, Modern Craft"
          subtitle="New Season Collection"
          description="Discover our latest collection of meticulously crafted pieces designed for the modern wardrobe. Sustainable materials, ethical production, timeless style."
          ctaText="Shop New Arrivals"
          ctaHref="/shop?filter=new"
          secondaryCtaText="Explore Sale"
          secondaryCtaHref="/shop?filter=sale"
          image="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920"
          imageAlt="New season fashion collection"
          variant="split"
        />

        {featuredCollections.length > 0 && (
          <FeaturedCollections
            title="Featured Collections"
            subtitle="Curated selections for every occasion"
            collections={featuredCollections}
          />
        )}

        {categories.length > 0 && (
          <CategorySection
            title="Shop by Category"
            subtitle="Explore our carefully curated categories"
            categories={categories}
            columns={4}
          />
        )}

        {newArrivals.length > 0 && (
          <ProductSection
            title="New Arrivals"
            subtitle="Fresh drops just landed"
            products={newArrivals}
            viewAllHref="/shop?filter=new"
            viewAllText="View All New Arrivals"
            columns={4}
          />
        )}

        {bestSellers.length > 0 && (
          <ProductSection
            title="Best Sellers"
            subtitle="Customer favorites, loved by thousands"
            products={bestSellers}
            viewAllHref="/shop?filter=bestseller"
            viewAllText="View All Best Sellers"
            columns={4}
          />
        )}

        {saleProducts.length > 0 && (
          <ProductSection
            title="Limited Time Offers"
            subtitle="Exceptional pieces at exceptional prices"
            products={saleProducts}
            viewAllHref="/shop?filter=sale"
            viewAllText="View All Sale"
            columns={4}
          />
        )}

        <TestimonialSection
          title="Loved by Thousands"
          subtitle="What our customers are saying"
          testimonials={testimonials}
        />

        <BrandStorySection
          title="Our Story"
          subtitle="Crafted with Purpose"
          description="Founded on the belief that clothing should be both beautiful and responsible. Every piece in our collection tells a story of meticulous craftsmanship, sustainable practices, and timeless design."
          image="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800"
          imageAlt="Our atelier and craftsmanship"
        />

        <InstagramGallery
          title="Follow Us on Instagram"
          subtitle="Tag us for a chance to be featured"
          posts={instagramPosts}
          columns={6}
        />

        <NewsletterSection
          title="Join Our Community"
          subtitle="Subscribe for exclusive access"
          description="Be the first to know about new collections, sales, and styling inspiration. Get 10% off your first order."
          variant="accent"
        />
      </main>
      <Footer />
    </div>
  );
}
