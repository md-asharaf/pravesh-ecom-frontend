import { Category } from "@/types";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link to={`/products?cat=${category.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer bg-gradient-card">
        <div className="relative h-40 overflow-hidden">
          <img
            src={category.img}
            alt={category.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-industrial/80 to-transparent" />
          <h3 className="absolute bottom-4 left-4 text-xl font-bold text-primary-foreground">
            {category.title}
          </h3>
        </div>
      </Card>
    </Link>
  );
};

export default CategoryCard;
