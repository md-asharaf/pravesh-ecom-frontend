import { Product } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Partial<Product>;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 bg-gradient-card">
      <Link to={`/product/${product.slug}`}>
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.thumbnail}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.discountValue && (
            <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">
              {product.discountType === "percentage" ? `${product.discountValue}% OFF` : `₹${product.discountValue} OFF`}
            </Badge>
          )}
          {product.isNewArrival && (
            <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
              NEW
            </Badge>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.shortDescription}</p>
        <div className="flex items-center gap-1 mb-3">
          <Star className="h-4 w-4 fill-accent text-accent" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-sm text-muted-foreground">({product.reviewCount})</span>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-bold text-primary">₹{product.finalPrice.toLocaleString()}</span>
          {product.discountValue && (
            <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Per {product.unit}</p>
        <Badge
          variant={product.stockStatus === "in_stock" ? "secondary" : "destructive"}
          className="mt-2"
        >
          {product.stockStatus === "in_stock" ? "In Stock" : product.stockStatus === "low_stock" ? "Low Stock" : "Out of Stock"}
        </Badge>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button className="flex-1" disabled={product.stockStatus === "out_of_stock"}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
        <Button variant="outline" size="icon">
          <Heart className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
