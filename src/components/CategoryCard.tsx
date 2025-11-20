import { Category } from "@/types";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link to={`/products?c=${category._id}`}>
      <Card
        className="
          group relative h-48 overflow-hidden cursor-pointer
          bg-gradient-card rounded-xl
          transition-all duration-300
          hover:shadow-lg hover:scale-[1.02]
        "
      >
        <div className="relative h-full w-full">
          {/* Enable when using images */}
          <img
            src={"/placeholder.svg"}
            alt={category.title}
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
            {category.title}
          </h3>
        </div>
      </Card>
    </Link>
  );
};

export default CategoryCard;

export function CategoryCardSkeleton() {
  return (
    <div
      className="
        relative h-48 rounded-xl bg-muted animate-pulse overflow-hidden
      "
    >
      <div className="absolute inset-0 bg-muted" />

      <div className="absolute bottom-4 left-4 right-4 space-y-2">
        <div className="h-4 bg-muted-foreground/20 rounded w-3/4" />
        {/* <div className="h-4 bg-muted-foreground/20 rounded w-1/2" /> */}
      </div>
    </div>
  );
}
