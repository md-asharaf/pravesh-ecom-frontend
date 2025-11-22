import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard, { ProductCardSkeleton } from "../ProductCard";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import { cn } from "@/lib/utils";

const ProductSectionCarousel = ({ title, link, products, bg, loading }) => {

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: "start",
        slidesToScroll: 1,
    });

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    if (!loading && products.length === 0) {
        return null;
    }

    return (
        <section className={`py-16 ${bg} relative group`}>
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-foreground">{title}</h2>
                    <Button variant="outline" asChild>
                        <Link to={link}>
                            View All <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex gap-6">
                        {loading ? [1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_calc(50%-12px)] md:flex-[0_0_calc(33.333%-16px)] lg:flex-[0_0_calc(25%-18px)]">
                                <ProductCardSkeleton />
                            </div>
                        )) :
                            products.map((p) => (
                                <div key={p._id} className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_calc(50%-12px)] md:flex-[0_0_calc(33.333%-16px)] lg:flex-[0_0_calc(25%-18px)]">
                                    <ProductCard product={p} />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

            {!loading && products.length > 4 && (
                <>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10",
                            "h-10 w-10 rounded-full bg-primary backdrop-blur-sm shadow-md",
                            "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                            "hover:bg-blue-400"
                        )}
                        onClick={scrollPrev}
                        aria-label="Previous products"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10",
                            "h-10 w-10 rounded-full bg-primary   backdrop-blur-sm shadow-md",
                            "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                            "hover:bg-blue-400"
                        )}
                        onClick={scrollNext}
                        aria-label="Next products"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </>
            )}
        </section>
    );
};

export default ProductSectionCarousel;