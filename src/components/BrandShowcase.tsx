import { useQuery } from "@tanstack/react-query";
import { brandService } from "@/services/brand.service";
import { Link } from "react-router-dom";
import { motion, useAnimationControls } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const BrandShowcase = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const res = await brandService.getAll({ limit: 20, page: 1 });
      return res.data;
    },
  });

  const brands = data?.brands || [];

  const controls = useAnimationControls();
  const containerRef = useRef<HTMLDivElement>(null);

  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.scrollWidth;

    controls.start({
      x: [0, -width],
      transition: {
        duration: width / 80,
        ease: "linear",
        repeat: Infinity,
      },
    });
  }, [brands]);


  if (!isLoading && brands.length === 0) return null;

  return (
    <section className="py-10 sm:py-12 md:py-16 bg-white border-b">
      <div className="container mx-auto px-3 sm:px-4 space-y-6 sm:space-y-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          Popular Brands
        </h2>

        {isLoading ? (
          <div className="flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto no-scrollbar py-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <BrandShowcaseSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="relative overflow-hidden py-2 sm:py-3 md:py-4">
            <motion.div
              ref={containerRef}
              className="flex gap-3 sm:gap-4 md:gap-6 whitespace-nowrap"
              animate={controls}
            >

              {[...brands, ...brands].map((brand, i) => {
                const isHovered = hoveredBrand === brand._id;
                const isOtherHovered = hoveredBrand !== null && !isHovered;

                return (
                  <Link
                    key={`${brand._id}-${i}`}
                    to={`/products?b=${brand._id}`}
                    className={`
        min-w-[120px] sm:min-w-[140px] md:min-w-[160px]
        h-24 sm:h-28 md:h-32
        flex flex-col items-center justify-center 
        px-3 py-3 sm:px-4 sm:py-4
        rounded-xl border bg-white transition-all duration-300
        hover:shadow-md hover:border-primary cursor-pointer flex-shrink-0
        ${isOtherHovered ? "grayscale opacity-60" : ""}
      `}
                    onMouseEnter={() => setHoveredBrand(brand._id)}
                    onMouseLeave={() => setHoveredBrand(null)}

                  >
                    <img
                      src={brand.image}
                      className="h-10 sm:h-12 w-auto object-contain mb-1.5 sm:mb-2"
                      alt={brand.name}
                    />
                    <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-gray-700 text-center leading-tight line-clamp-2">
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

export const BrandShowcaseSkeleton = () => (
  <div className="min-w-[120px] sm:min-w-[140px] md:min-w-[160px] h-24 sm:h-28 md:h-32 bg-muted rounded-xl animate-pulse flex-shrink-0" />
);
