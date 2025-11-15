import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Heart,
  Star,
  Minus,
  Plus,
  Truck,
  Shield,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import { reviewService } from "@/services/review.service";
import { wishlistService } from "@/services/wishlist.service";
import { cartService } from "@/services/cart.service";

const ProductDetail = () => {
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1);

  const { data: product } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const response = await productService.getBySlug(slug);
      return response.data;
    },
  });

  const { data: reviewsData } = useQuery({
    queryKey: ["reviews", slug],
    queryFn: async () => {
      const response = await reviewService.getProductReviews(product._id);
      return response.data;
    },
    enabled: !!product,
  });

  const reviews = reviewsData?.reviews || [];

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const response = await cartService.addToCart(product._id);
      return response.data;
    },
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async () => {
      const response = await wishlistService.addProduct(product._id);
      return response.data;
    },
  });

  if (!product) {
    return (
        <div className="container mx-auto px-6 py-24 text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-4">
            Product not found
          </h1>
          <Button asChild className="rounded-full">
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
    );
  }

  return (

      <div className="container mx-auto px-6 py-10">
        <Button
          variant="ghost"
          asChild
          className="mb-6 text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <Link to="/products">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* LEFT — Image */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden bg-muted">
              <img
                src={product.thumbnail}
                alt={product.name}
                className="object-contain w-full h-full"
              />
            </div>
            {/* {product.discountValue && (
              <div className="absolute top-6 left-6">
                <Badge variant="secondary">
                  {product.discountType === "percentage"
                    ? `${product.discountValue}% OFF`
                    : `₹${product.discountValue} OFF`}
                </Badge>
              </div>
            )} */}
          </div>

          {/* RIGHT — Info */}
          <div className="flex flex-col gap-4">
            {/* Title + Brand */}
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold mb-1 leading-tight">
                {product.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {product.brand?.name && (
                  <>
                    by{" "}
                    <span className="text-foreground font-medium">
                      {product.brand.name}
                    </span>{" "}
                    •{" "}
                  </>
                )}
                SKU: {product.sku}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {product.rating} • {product.reviewCount} reviews
              </span>
              <span className="text-xs text-muted-foreground">
                | {product.totalSold} sold
              </span>
            </div>

            {/* Price */}
            <div>
              <span className="text-2xl font-semibold">
                ₹{product.originalPrice.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground ml-1">
                per {product.unit}
              </span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Qty</span>
              <div className="flex items-center border border-border rounded-full">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="rounded-full"
                >
                  <Minus className="h-3 w-3 text-muted-foreground" />
                </Button>
                <span className="px-4 font-medium text-sm">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="rounded-full"
                >
                  <Plus className="h-3 w-3 text-muted-foreground" />
                </Button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                size="sm"
                className="flex-1 rounded-full"
                onClick={() => addToCartMutation.mutate()}
              >
                <ShoppingCart className="mr-1 h-4 w-4" />
                Add to Cart
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => addToWishlistMutation.mutate()}
                className="rounded-full"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>

            {/* Specs */}
            {product.specifications &&
              Object.keys(product.specifications).length > 0 && (
                <div className="pt-2 border-t border-border">
                  <h3 className="text-base font-medium mb-2">
                    Specifications
                  </h3>
                  <dl className="space-y-1 text-sm text-muted-foreground">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between border-b border-border/40 pb-1"
                      >
                        <dt className="font-medium text-foreground">{key}</dt>
                        <dd>{String(value)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="pt-2">
                <h3 className="text-base font-medium mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="rounded-full text-xs px-3 py-1"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Info Icons */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/60">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Fast Delivery</p>
                  <p className="text-xs text-muted-foreground">2–3 days</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Quality Assured</p>
                  <p className="text-xs text-muted-foreground">100% Genuine</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* REVIEWS */}
        <section className="mt-12">
          <h2 className="text-lg font-medium mb-4">Customer Reviews</h2>
          {reviews.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-border pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm mb-1">{review.comment}</p>
                  <p className="text-xs text-muted-foreground">
                    — {review.user.name}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No reviews yet. Be the first to review this product!
            </p>
          )}
        </section>
      </div>
  );
};

export default ProductDetail;
