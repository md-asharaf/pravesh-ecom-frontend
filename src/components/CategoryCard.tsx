import { Category } from "@/types";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link to={`/products?c=${category._id}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer bg-gradient-card h-48">
        <div className="relative h-full overflow-hidden">
          {/* <img
            src={category.image}
            alt={category.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          /> */}
          <div className="absolute inset-0 bg-gradient-to-t from-industrial/80 to-transparent" />
          <h3 className="absolute bottom-4 left-4 right-4 text-xl font-bold text-primary-foreground truncate">
            {category.title}
          </h3>
        </div>
      </Card>
    </Link>
  );
};

export function CategoryCardSkeleton() {
  return (
    <div className="group h-48 bg-gradient-card overflow-hidden animate-pulse">
      <div className="relative h-full">
        <div className="absolute inset-0 bg-muted" />
        <div className="absolute bottom-4 left-4 right-4 h-6 bg-muted rounded" />
      </div>
    </div>
  );
}



export default CategoryCard;
