import { Loader } from "@/components/Loader";
import { Card, CardContent } from "@/components/ui/card";
import { brandService } from "@/services/brand.service";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Brands = () => {
  const lastBrandRef = useRef<HTMLDivElement>(null);
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["brands-infinite"],
    queryFn: async ({ pageParam }) => {
      const response = await brandService.getAll({
        limit: 12,
        page: pageParam,
      });
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.page || !lastPage.totalPages) return null;
      return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : null;
    },
  });
  const brands = (data?.pages ?? []).flatMap((page: any) => page?.brands ?? []);

  const { ref, entry } = useIntersection({
    root: lastBrandRef.current,
    threshold: 1,
  });
  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [entry, hasNextPage, isFetching, fetchNextPage]);

  if (isLoading) {
    return <Loader />
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">All Brands</h1>
        <p className="text-muted-foreground">
          Shop from trusted construction material brands
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {brands?.map((brand) => {
          return (
            <Link key={brand._id} to={`/products?b=${brand._id}`}>
              <Card
                className="
          group relative h-48 overflow-hidden cursor-pointer
          bg-gradient-card rounded-xl
          transition-all duration-300
          hover:shadow-lg hover:scale-[1.02]
        "
              >
                <CardContent className="p-6 text-center relative h-full w-full">
                  <img
                    src={brand.image || "/placeholder.svg"}
                    alt={brand.name}
                    className="absolute inset-0 w-full h-full object-cover
                       transition-transform duration-500
                       group-hover:scale-110"
                  />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                  <h3
                    className="
              absolute bottom-4 left-4 right-4 
              text-lg font-semibold text-white
              leading-tight line-clamp-2
            "
                  >
                    {brand.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {brand.productCount} products
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
        <div ref={ref} className="h-1" />

        {(isFetchingNextPage || isFetching) && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            Loading more...
          </div>
        )}
      </div>
    </div>
  );
};

export default Brands;
