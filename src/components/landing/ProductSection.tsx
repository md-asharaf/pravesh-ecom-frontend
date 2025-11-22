"use client";

import { ArrowRight } from "lucide-react";
import ProductCard, { ProductCardSkeleton } from "../ProductCard";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ProductSectionCarousel = ({ title, link, products, bg, loading }) => {

  if (!loading && products.length === 0) return null;

  return (
    <section className={`py-10 sm:py-12 md:py-16 ${bg} relative`}>
      <div className="container mx-auto px-3 sm:px-4 space-y-6 sm:space-y-8">

        {/* header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            {title}
          </h2>

          <Button
            variant="outline"
            className="text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4"
            asChild
          >
            <Link to={link}>
              View All <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            </Link>
          </Button>
        </div>

        {/* carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full relative"
        >
          <CarouselContent className="flex gap-3 sm:gap-4 md:gap-6">
            {loading
              ? [1, 2, 3, 4, 5].map((i) => (
                  <CarouselItem
                    key={i}
                    className="basis-[75%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                  >
                    <ProductCardSkeleton />
                  </CarouselItem>
                ))
              : products.map((p) => (
                  <CarouselItem
                    key={p._id}
                    className="basis-[75%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                  >
                    <ProductCard product={p} />
                  </CarouselItem>
                ))}
          </CarouselContent>

          {/* navigation buttons */}
          {!loading && products.length > 5 && (
            <>
              <CarouselPrevious className="hidden md:flex absolute -left-3 lg:-left-5 top-1/2 -translate-y-1/2 h-8 w-8 lg:h-10 lg:w-10 rounded-full" />
              <CarouselNext className="hidden md:flex absolute -right-3 lg:-right-5 top-1/2 -translate-y-1/2 h-8 w-8 lg:h-10 lg:w-10 rounded-full" />
            </>
          )}
        </Carousel>
      </div>
    </section>
  );
};

export default ProductSectionCarousel;
