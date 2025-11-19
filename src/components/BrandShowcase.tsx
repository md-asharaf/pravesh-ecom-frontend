import { useQuery } from "@tanstack/react-query";
import { brandService } from "@/services/brand.service";
import { Link } from "react-router-dom";

const BrandShowcase = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const res = await brandService.getAll({ limit: 20, page: 1 });
      return res.data;
    },
    enabled: true,
  });

  const brands = data?.brands || [];

  return (
    <section className="py-10 bg-white border-b">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-foreground mb-6">Popular Brands</h2>

        {/* Loading skeleton */}
        {isLoading ? (
          <div className="flex gap-6 overflow-x-auto no-scrollbar py-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="min-w-[140px] h-16 bg-gray-200 animate-pulse rounded-xl"
              ></div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar py-2">
            {brands.map((brand) => (
              <Link
                key={brand._id}
                to={`/products?b=${brand._id}`}
                className="min-w-[140px] h-20 flex flex-col items-center justify-center p-3 bg-gray-50 border rounded-xl hover:shadow-md transition cursor-pointer"
              >
                <img
                  src={brand.image}
                  className="h-10 object-contain mb-2 grayscale hover:grayscale-0 transition-all"
                />
                <span className="text-xs font-medium text-gray-700">
                  {brand.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BrandShowcase;
