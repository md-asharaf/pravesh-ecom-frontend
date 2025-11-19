import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wrench, Truck, ShieldCheck, Flame, Boxes } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import { bannerService } from "@/services/banner.service"; // if you have banners API
import BrandShowcase from "@/components/BrandShowcase";
import { categoryService } from "@/services/category.service";

const Index = () => {
  const { data: banners = [] } = useQuery({
    queryKey: ["banners"],
    queryFn: async () => {
      const res = await bannerService.getAllBanners();
      return res?.data?.banners || [];
    },
  });

  const { data:categoryResp } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getAll({ limit: 6 }).then((r) => r.data),
  });

  const categories = categoryResp?.categories || []
  const { data: featuredRes } = useQuery({
    queryKey: ["featured-products"],
    queryFn: () => productService.getAll({ isFeatured: true, limit: 12 }).then((r) => r.data),
  });
  const featuredProducts = featuredRes?.products || [];

  const { data: bestSellingRes } = useQuery({
    queryKey: ["best-selling"],
    queryFn: () => productService.getAll({ sort: "bestSelling", limit: 8 }).then((r) => r.data),
  });
  const bestSelling = bestSellingRes?.products || [];

  const { data: newArrivalsRes } = useQuery({
    queryKey: ["new-arrivals"],
    queryFn: () => productService.getAll({ isNewArrival: true, limit: 8 }).then((r) => r.data),
  });
  const newArrivals = newArrivalsRes?.products || [];

  const { data: trendingRes } = useQuery({
    queryKey: ["trending-products"],
    queryFn: () => productService.getAll({ sort: "trending", limit: 8 }).then((r) => r.data),
  });
  const trending = trendingRes?.products || [];

  return (
    <>
      <Hero banners={banners} />

      <section className="py-10 bg-muted/10 border-b">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Wrench className="h-7 w-7 text-primary" />,
              title: "Industrial Grade Quality",
              sub: "Trusted material from certified manufacturers",
            },
            {
              icon: <Truck className="h-7 w-7 text-primary" />,
              title: "Pan-India Delivery",
              sub: "Fast & reliable shipping for all orders",
            },
            {
              icon: <ShieldCheck className="h-7 w-7 text-primary" />,
              title: "100% Genuine Products",
              sub: "Guaranteed authentic & verified items",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 bg-muted/10 p-5 rounded-xl hover:shadow-sm transition"
            >
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                {item.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <BrandShowcase />

      <section className="py-14 bg-muted/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Shop by Categories</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {categories?.map((cat, i) => (
              <Link
                to={`/category/${cat.slug}`}
                key={i}
                className="group p-4 shadow flex flex-col items-center text-center border rounded-xl hover:shadow-sm transition cursor-pointer"
              >
                <img
                  src={""}
                  className="h-20 w-20 object-contain mb-3 group-hover:scale-105 transition"
                />
                <span className="font-medium">{cat.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <LandingSection
          title="Featured Products"
          link="/products?sort=featured"
          products={featuredProducts}
          bg="bg-white"
        />
      )}

      {bestSelling.length > 0 && (
        <LandingSection
          title="Best Selling"
          link="/products?sort=bestSelling"
          products={bestSelling}
          bg="bg-muted/10"
        />
      )}

      {trending.length > 0 && (
        <LandingSection
          title="Trending Now"
          link="/products?sort=trending"
          products={trending}
          bg="bg-white"
        />
      )}

      {newArrivals.length > 0 && (
        <LandingSection
          title="New Arrivals"
          link="/products?sort=newArrivals"
          products={newArrivals}
          bg="bg-muted/10"
        />
      )}

      {/* <section className="py-20 bg-gradient-hero text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white mb-4">
            Build Better. Build Stronger.
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
            Explore India's most trusted construction materials marketplace.
          </p>
          <Button
            asChild
            size="lg"
            className="rounded-full bg-white text-primary hover:bg-gray-200"
          >
            <Link to="/products">
              Start Shopping <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section> */}
    </>
  );
};

const LandingSection = ({ title, link, products, bg }) => (
  <section className={`py-16 ${bg}`}>
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-foreground">{title}</h2>
        <Button variant="outline" asChild>
          <Link to={link}>
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  </section>
);

export default Index;
