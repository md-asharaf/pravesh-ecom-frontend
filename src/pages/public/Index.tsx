import Hero from "@/components/Hero";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import { bannerService } from "@/services/banner.service";
import BrandShowcase from "@/components/BrandShowcase";
import { categoryService } from "@/services/category.service";
import FeaturesSection from "@/components/landing/FeaturesSection";
import ProductSectionCarousel from "@/components/landing/ProductSection";
import CategoryShowcase from "@/components/CategoryShowcase";

const Index = () => {
  const { data: banners = [] } = useQuery({
    queryKey: ["banners"],
    queryFn: async () => {
      const res = await bannerService.getAllBanners();
      return res?.data?.banners || [];
    },
  });

  const { data: categoryResp, isLoading: isCategoryLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getAll({ limit: 6, parentCategoryId: "null" }).then((r) => r.data),
  });

  const categories = categoryResp?.categories || []
  const { data: featuredRes, isLoading: isFeaturedLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: () => productService.getAll({ limit: 6, sort: "featured" }).then((r) => r.data),

  });
  const featuredProducts = featuredRes?.products || [];

  const { data: bestSellingRes, isLoading: isBestSellingLoading } = useQuery({
    queryKey: ["best-selling"],
    queryFn: () => productService.getAll({ sort: "bestSelling", limit: 8 }).then((r) => r.data),
  });
  const bestSelling = bestSellingRes?.products || [];

  const { data: newArrivalsRes, isLoading: isNewArrivalsLoading } = useQuery({
    queryKey: ["new-arrivals"],
    queryFn: () => productService.getAll({ isNewArrival: true, limit: 8 }).then((r) => r.data),
  });
  const newArrivals = newArrivalsRes?.products || [];

  const { data: trendingRes, isLoading: isTrendingLoading } = useQuery({
    queryKey: ["trending-products"],
    queryFn: () => productService.getAll({ sort: "trending", limit: 8 }).then((r) => r.data),
  });
  const trending = trendingRes?.products || [];

  return (
    <>
      <Hero banners={banners} />

      <FeaturesSection />

      <BrandShowcase />

      <CategoryShowcase categories={categories} isCategoryLoading={isCategoryLoading} />

      <ProductSectionCarousel
        loading={isFeaturedLoading}
        title="Featured Products"
        link="/products?sort=featured"
        products={featuredProducts}
        bg="bg-white"
      />

      <ProductSectionCarousel
        loading={isBestSellingLoading}
        title="High-Demand Products"
        link="/products?sort=bestSelling"
        products={bestSelling}
        bg="bg-muted/10"
      />

      <ProductSectionCarousel
        loading={isTrendingLoading}
        title="Currently Trending"
        link="/products?sort=trending"
        products={trending}
        bg="bg-white"
      />

      <ProductSectionCarousel
        loading={isNewArrivalsLoading}
        title="Recently Stocked Items"
        link="/products?sort=newArrivals"
        products={newArrivals}
        bg="bg-muted/10"
      />
    </>
  );
};

export default Index;
