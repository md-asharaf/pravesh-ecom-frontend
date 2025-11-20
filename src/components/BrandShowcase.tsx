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
  });

  const brands = data?.brands || [];

  return (
    <section className="py-12 bg-white border-b">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Popular Brands
        </h2>

        {isLoading ? (
          <div className="flex gap-6 overflow-x-auto no-scrollbar py-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <BrandShowcaseSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-2">
            {brands.map((brand) => (
              <Link
                key={brand._id}
                to={`/products?b=${brand._id}`}
                className="min-w-[130px] h-28 flex flex-col items-center justify-center 
                  p-4 rounded-xl bg-gray-50 border transition-all duration-200
                  hover:shadow-md hover:border-primary cursor-pointer"
              >
                <img
                  src={brand.image}
                  className="h-12 w-auto object-contain mb-2 transition-all duration-300 
                    grayscale hover:grayscale-0"
                />

                <span className="text-xs font-semibold text-gray-700 text-center 
                  leading-tight line-clamp-2 max-w-[110px]">
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
