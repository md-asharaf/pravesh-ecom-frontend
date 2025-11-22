import { useQuery } from "@tanstack/react-query";
import { brandService } from "@/services/brand.service";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

const BrandShowcase = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const res = await brandService.getAll({ limit: 20, page: 1 });
      return res.data;
    },
  });

  const brands = data?.brands || [];
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  if (!isLoading && brands.length === 0) {
    return null;
  }

  const handleHoverStart = (brandId: string) => {
    setHoveredBrand(brandId);
    setIsPaused(true);
  };

  const handleHoverEnd = () => {
    setHoveredBrand(null);
    setIsPaused(false);
  };

  return (
    <section className="py-12 bg-white border-b">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-foreground mb-6">Popular Brands</h2>

        {isLoading ? (
          <div className="flex gap-6 overflow-x-auto no-scrollbar py-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <BrandShowcaseSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="relative overflow-hidden py-4">
            {/* Infinite scroll container */}
            <motion.div
              className="flex gap-6"
              animate={{
                x: isPaused ? undefined : [-100 * brands.length, 0],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: brands.length * 3,
                  ease: "linear",
                },
              }}
            >
              {/* Duplicate list twice for infinite effect */}
              {[...brands, ...brands].map((brand, i) => {
                const isHovered = hoveredBrand === brand._id;
                const isOtherHovered = hoveredBrand !== null && !isHovered;

                return (
                  <Link
                    key={`${brand._id}-${i}`}
                    to={`/products?b=${brand._id}`}
                    className={`min-w-[150px] h-32 flex flex-col items-center justify-center 
                    p-4 rounded-xl border bg-white transition-all duration-300
                    hover:shadow-md hover:border-primary cursor-pointer flex-shrink-0
                    ${isOtherHovered ? "grayscale opacity-60" : "grayscale-0 opacity-100"}`}
                    onMouseEnter={() => handleHoverStart(brand._id)}
                    onMouseLeave={handleHoverEnd}
                  >
                    <img
                      src={brand.image}
                      className="h-12 w-auto object-contain mb-2"
                      alt={brand.name}
                    />

                    <span className="text-xs font-semibold text-gray-700 text-center 
                    leading-tight line-clamp-2 max-w-[110px]">
                      {brand.name}
                    </span>
                  </Link>
                );
              })}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BrandShowcase;

export const BrandShowcaseSkeleton = () => {
  return (
    <div className="min-w-[130px] h-28 bg-muted rounded-xl animate-pulse">
      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
        <div className="w-14 h-14 bg-muted rounded-md"></div>
        <div className="w-20 h-3 bg-muted rounded-full"></div>
      </div>
    </div>
  );
};
