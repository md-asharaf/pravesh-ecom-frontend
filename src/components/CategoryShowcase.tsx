import { Category } from "@/types";
import CategoryCard, { CategoryCardSkeleton } from "./CategoryCard";

export default function CategoryShowcase({ categories, isCategoryLoading }: { categories: Category[], isCategoryLoading: boolean }) {
  if (!isCategoryLoading && categories.length === 0) return null;
  return (
    <section className="py-10 sm:py-12 md:py-16 bg-white border-b">
      <div className="container mx-auto px-3 sm:px-4 space-y-6 sm:space-y-8">

        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
          Shop by Categories
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
          {isCategoryLoading
            ? [1, 2, 3, 4, 5, 6].map((i) => (
              <CategoryCardSkeleton key={i} />
            ))
            : categories?.map((cat, i) => (
              <CategoryCard key={i} category={cat} />
            ))}
        </div>

      </div>
    </section>
  )
}