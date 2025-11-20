import { Product } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Star, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addItem } from "@/store/slices/cart";
import { addToWishlist, removeFromWishlist } from "@/store/slices/wishlist";
import { useMutation } from "@tanstack/react-query";
import { wishlistService } from "@/services/wishlist.service";
import { toast } from "sonner";
import { cartService } from "@/services/cart.service";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items)
  const isWishlisted = wishlistItems.some(item => item._id === product._id);

  const addToWishlistMutation = useMutation({
    mutationFn: wishlistService.addProduct,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add to wishlist");
    }
  })

  const removeFromWishlistMutation = useMutation({
    mutationFn: wishlistService.removeProduct,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to remove from wishlist");
    }
  })

  const addToCartMutation = useMutation({
    mutationFn: cartService.addToCart,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  })

  const handleWishlistClick = () => {
    if (isWishlisted) {
      removeFromWishlistMutation.mutate(product._id!);
      dispatch(removeFromWishlist(product._id!));
    } else {
      addToWishlistMutation.mutate(product._id!);
      dispatch(addToWishlist(product));
    }
  };

  const isWishlistMutationPending = addToWishlistMutation.isPending || removeFromWishlistMutation.isPending;
  return (
    <Card className="group hover:shadow-md transition-shadow duration-300 bg-gradient-card h-full flex flex-col w-full">
      <Link to={`/product/${product.slug}`}>
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.thumbnail || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-48 sm:h-56 md:h-64 group-hover:scale-105 transition-transform duration-300 object-cover"
          />
        </div>
      </Link>
      <CardContent className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-2 line-clamp-2 hover:text-primary transition-colors min-h-[3.5rem]">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mb-3">
          <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-accent text-accent" />
          <span className="text-xs sm:text-sm font-medium">{product.rating}</span>
          <span className="text-xs sm:text-sm text-muted-foreground">({product.reviewCount})</span>
        </div>
        {/* Price Section */}
        {/* <div className="flex items-baseline gap-2 mb-4">
          <span className="text-lg sm:text-xl font-bold text-foreground">₹{product.price.toLocaleString()}</span>
        </div> */}
      </CardContent>
      <CardFooter className="p-3 sm:p-4 pt-0 flex gap-2">
        <Button
          className="flex-1 h-9 sm:h-10 text-xs sm:text-sm"
          onClick={() => {
            addToCartMutation.mutate({ productId: product._id, quantity: 1 })
            dispatch(addItem({ product, quantity: 1 }))
          }}
        >
          {addToCartMutation.isPending ? (
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
          ) : (
            <>
              <ShoppingCart className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span >Add to Cart</span>
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleWishlistClick}
          className={`h-9 sm:h-10 w-9 sm:w-10 ${isWishlisted ? "text-pink-500 border-pink-500" : ""}`}
        >
          {isWishlistMutationPending ? <Loader2 className="animate-spin h-4 w-4" /> : <Heart className="h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  )
}

export const ProductCardSkeleton = () => {
  return (
    <Card className="group bg-gradient-card h-full flex flex-col w-full animate-pulse">
      <div className="relative overflow-hidden rounded-t-lg">
        <div className="w-full h-48 sm:h-56 md:h-64 bg-muted" />
      </div>

      <CardContent className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="h-4 sm:h-5 bg-muted rounded w-3/4" />
          <div className="h-4 sm:h-5 bg-muted rounded w-1/2" />
        </div>

        <div className="flex items-center gap-2 mt-4">
          <div className="h-3 sm:h-4 w-3 sm:w-4 bg-muted rounded" />
          <div className="h-3 sm:h-4 w-8 sm:w-10 bg-muted rounded" />
          <div className="h-3 sm:h-4 w-10 sm:w-12 bg-muted rounded" />
        </div>
      </CardContent>

      <CardFooter className="p-3 sm:p-4 pt-0 flex gap-2">
        <div className="flex-1 h-9 sm:h-10 bg-muted rounded" />
        <div className="h-9 sm:h-10 w-9 sm:w-10 bg-muted rounded" />
      </CardFooter>
    </Card>
  )
}

export default ProductCard