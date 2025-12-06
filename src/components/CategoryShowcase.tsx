import { Category } from "@/types";
import CategoryCard, { CategoryCardSkeleton } from "./CategoryCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function CategoryShowcase({ categories, isCategoryLoading }: { categories: Category[], isCategoryLoading: boolean }) {
  if (!isCategoryLoading && categories.length === 0) return null;
  return (
    <section className="py-10 sm:py-12 md:py-16 bg-white border-b">
      <div className="container mx-auto px-3 sm:px-4 space-y-6 sm:space-y-8">

        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
          Shop by Categories
        </h2>

        {/* Carousel for mobile, grid for larger screens */}
        <div className="block md:hidden">
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full relative"
          >
            <CarouselContent className="flex gap-3 sm:gap-4">
              {isCategoryLoading
                ? [1, 2, 3, 4, 5, 6].map((i) => (
                  <CarouselItem
                    key={i}
                    className="basis-[45%] sm:basis-1/3"
                  >
                    <CategoryCardSkeleton />
                  </CarouselItem>
                ))
                : categories?.map((cat, i) => (
                  <CarouselItem
                    key={cat._id || i}
                    className="basis-[45%] sm:basis-1/3"
                  >
                    <CategoryCard category={cat} />
                  </CarouselItem>
                ))}
            </CarouselContent>

            {/* Navigation buttons for mobile */}
            {!isCategoryLoading && categories.length > 2 && (
              <>
                <CarouselPrevious className="absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-background border shadow-sm" />
                <CarouselNext className="absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-background border shadow-sm" />
              </>
            )}
          </Carousel>
        </div>

        {/* Grid layout for larger screens */}
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-5">
          {isCategoryLoading
            ? [1, 2, 3, 4, 5, 6].map((i) => (
              <CategoryCardSkeleton key={i} />
            ))
            : categories?.map((cat, i) => (
              <CategoryCard key={cat._id || i} category={cat} />
            ))}
        </div>

      </div>
    </section>
  )
}