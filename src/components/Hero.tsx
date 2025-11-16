import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Banner } from "@/types/banner"; // adjust path

type HeroProps = {
  banners: Banner[];
};

const Hero = ({ banners }: HeroProps) => {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<any>(null);
  const navigate = useNavigate();

  // Auto-slide
  useEffect(() => {
    if (!banners || banners.length === 0) return;

    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4500);

    return () => clearTimeout(timeoutRef.current);
  }, [current, banners]);

  const next = () => setCurrent((prev) => (prev + 1) % banners.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);

  // Navigation handler
  const handleBannerClick = (banner: Banner) => {
    const { type, targetId, targetUrl } = banner;

    // external link
    if (type === "external") {
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

    // offer
    if (type === "offer" && targetId) {
      navigate(`/offers/${targetId}`);
      return;
    }
  };

  return (
    <section className="relative w-full overflow-hidden min-h-[450px] md:min-h-[520px] bg-black">
      {/* Carousel */}
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.length > 0 ? (
          banners.map((banner) => (
            <div
              key={banner._id}
              className="relative min-w-full h-[450px] md:h-[520px] cursor-pointer group"
              onClick={() => handleBannerClick(banner)}
            >
              <img
                src={banner.image}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />

              {/* gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

              {/* text */}
              <div className="absolute inset-0 flex items-center px-6 md:px-16">
                <div className="max-w-2xl text-white drop-shadow-md">
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
          ))
        ) : (
          <div className="min-w-full h-[450px] md:h-[520px] bg-gradient-hero flex items-center px-10">
            <h1 className="text-white text-4xl font-bold">
              Loading banners...
            </h1>
          </div>
        )}
      </div>

      {/* Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-2 rounded-full text-white transition"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-2 rounded-full text-white transition"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2.5 w-2.5 rounded-full cursor-pointer transition ${
              i === current ? "bg-white" : "bg-white/40"
            }`}
          ></div>
        ))}
      </div>
    </section>
  );
};

export default Hero;
