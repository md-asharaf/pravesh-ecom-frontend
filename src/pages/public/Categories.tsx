import CategoryCard from "@/components/CategoryCard";
import { categoryService } from "@/services/category.service";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { Loader } from "@/components/Loader";

const Categories = () => {
  const lastCategoryRef = useRef<HTMLDivElement>(null);
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["categories-parent"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await categoryService.getAll({
        limit: 12,
        page: pageParam,
        parentCategoryId: "null"
      });
      return response.data
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.page || !lastPage.totalPages) return null;
      return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : null;
    },
  });
  const categories = (data?.pages ?? []).flatMap((page: any) => page?.categories ?? []);

  const { ref, entry } = useIntersection({
    root: lastCategoryRef.current,
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
        <h1 className="text-4xl font-bold mb-2">All Categories</h1>
        <p className="text-muted-foreground">
          Browse construction materials by category
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories?.map((category) => {
          return (
            <div key={category._id} className="relative">
              <CategoryCard category={category} />
              <div className="mt-2 text-center">
                <p className="text-sm text-muted-foreground">
                  {category.productCount} products
                </p>
              </div>
            </div>
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

export default Categories;
