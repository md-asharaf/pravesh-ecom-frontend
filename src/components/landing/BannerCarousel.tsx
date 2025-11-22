import { useCallback, useEffect, useState, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface Banner {
    _id: string;
    title: string;
    image: string;
    targetUrl?: string;
    type: "category" | "product" | "brand" | "offer" | "external";
    targetId?: string;
    isDeleted: boolean;
    order: number;
}

interface BannerCarouselProps {
    banners: Banner[];
    autoplayDelay?: number;
}

export const BannerCarousel = ({ banners, autoplayDelay = 5000 }: BannerCarouselProps) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, align: "center" },
        [Autoplay({ delay: autoplayDelay, stopOnInteraction: false })]
    );
    const [selectedIndex, setSelectedIndex] = useState(0);
    const navigate = useNavigate();

    const activeBanners = useMemo(
        () =>
            banners
                .filter((banner) => !banner.isDeleted)
                .sort((a, b) => a.order - b.order),
        [banners]
    );

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        return () => {
            emblaApi.off("select", onSelect);
        };
    }, [emblaApi, onSelect]);

    if (activeBanners.length === 0) return null;

    const handleBannerClick = (banner: Banner) => {
        const { type, targetId, targetUrl } = banner;

        if (type === "external" || type === "offer") {
            if (targetUrl?.startsWith("http")) {
                window.open(targetUrl, "_blank");
            } else if (targetUrl) {
                navigate(targetUrl);
            }
            return;
        }

        // product
        if (type === "product" && targetId) {
            navigate(`/product/${targetId}`);
            return;
        }

        // category
        if (type === "category" && targetId) {
            navigate(`/products?c=${targetId}`);
            return;
        }

        // brand
        if (type === "brand" && targetId) {
            navigate(`/products?b=${targetId}`);
            return;
        }
    };

    return (
        <div className="relative w-full group">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex touch-pan-y">
                    {activeBanners.map((banner) => (
                        <div
                            key={banner._id}
                            className="flex-[0_0_100%] relative min-w-full h-72 md:h-[520px] cursor-pointer group"
                            onClick={() => handleBannerClick(banner)}
                        >
                            <img
                                src={banner.image || "/placeholder.svg"}
                                alt={banner.title}
                                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                                loading="lazy"
                            />

                            {/* gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

                            {/* text */}
                            <div className="absolute inset-0 flex items-center px-6 md:px-16">
                                <div className="max-w-xl text-white drop-shadow-md">
                                    <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
                                        {banner.title}
                                    </h1>

                                    {(banner.type !== "external" || banner.targetUrl) && (
                                        <Button
                                            size="lg"
                                            variant="secondary"
                                            className="rounded-full font-semibold"
                                        >
                                            Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Arrow Navigation - Hidden on mobile */}
            {activeBanners.length > 1 && (
                <>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10",
                            "h-12 w-12 rounded-full bg-carousel-nav/80 backdrop-blur-sm",
                            "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                            "hover:bg-carousel-nav-hover hover:text-white"
                        )}
                        onClick={scrollPrev}
                        aria-label="Previous banner"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10",
                            "h-12 w-12 rounded-full bg-carousel-nav/80 backdrop-blur-sm",
                            "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                            "hover:bg-carousel-nav-hover hover:text-white"
                        )}
                        onClick={scrollNext}
                        aria-label="Next banner"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </Button>
                </>
            )}

            {/* Indicator Dots */}
            {activeBanners.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                    {activeBanners.map((_, index) => (
                        <button
                            key={index}
                            className={cn(
                                "h-2 rounded-full transition-all duration-300",
                                selectedIndex === index ? "w-8 bg-carousel-nav-hover" : "w-2 bg-carousel-nav/60"
                            )}
                            onClick={() => scrollTo(index)}
                            aria-label={`Go to banner ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
